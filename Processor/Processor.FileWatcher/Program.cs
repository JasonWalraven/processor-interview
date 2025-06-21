using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.Extensions.Configuration;
using Processor.Api.Data.Common;
using Processor.Api.Data.Common.Entities;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();

var directory = configuration.GetSection("FileWatcherSettings:DirectoryPath").Value;

if (string.IsNullOrEmpty(directory))
{
    Console.WriteLine("Directory path is not configured in appsettings.json.");
    return;
}

var fileTypes = new string[] { "*.json", "*.xml", "*.csv" };

var watchers = fileTypes
    .Where(fileType => fileType.StartsWith("*") && fileType.Length > 2)
    .Select(fileType => new FileSystemWatcher
    {
        Path = directory,
        Filter = fileType,
        NotifyFilter = NotifyFilters.FileName,
    });

if (!watchers.Any())
{
    Console.WriteLine("No valid file types configured");
    return;
}

foreach (var watcher in watchers)
{
    watcher.Created += fileCreated;   

    watcher.EnableRaisingEvents = true;
}

using var cts = new CancellationTokenSource();

Console.CancelKeyPress += (sender, e) =>
{
    Console.WriteLine("Cancellation requested. Exiting...");
    e.Cancel = true; // Prevent the process from terminating immediately
    cts.Cancel(); // Signal cancellation
};

try
{
    await Task.Delay(Timeout.Infinite, cts.Token);
}
catch (TaskCanceledException) { }

foreach (var watcher in watchers)
{
    watcher.Dispose();
}

void fileCreated(object sender, FileSystemEventArgs e)
{
    var useBulkPocessing = bool.TryParse(configuration.GetSection("BulkProcessing:UseBulkProcessing").Value, out var useBulk) && useBulk;

    Console.WriteLine($"Processing File: {e.FullPath}");

    if (e.Name.ToLower().EndsWith("json"))
    {
        UpdateJsonData(e.FullPath, useBulkPocessing);
    }
    else if (e.Name.ToLower().EndsWith("xml"))
    {
        UpdateXmlData(e.FullPath, useBulkPocessing);
    }
    else if (e.Name.ToLower().EndsWith("csv"))
    {
        UpdateCsvData(e.FullPath, useBulkPocessing);
    }
    else
    {
        return;
    }
    if (!useBulkPocessing)
        Console.WriteLine($"File processed: {e.FullPath}");
}

void UpdateJsonData(string filePath, bool useBulkProcessing)
{
    try
    {
        var jsonData = File.ReadAllText(filePath);
        
        if (useBulkProcessing)
        {
            AddBulkTransaction(DataType.JSON, jsonData);
            return;
        }

        var document = JsonDocument.Parse(jsonData);

        if (document.RootElement.ValueKind == JsonValueKind.Array)
        {
            foreach (var item in document.RootElement.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.Object)
                    continue;

                AddTransaction(item.CreateTransaction());
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing JSON file: {ex.Message}");
    }
}

void UpdateXmlData(string filePath, bool useBulkProcessing)
{
    try
    {
        var xmlData = File.ReadAllText(filePath);

        if (useBulkProcessing)
        {
            AddBulkTransaction(DataType.XML, xmlData);
            return;
        }

        var document = XDocument.Parse(xmlData);

        foreach (var element in document.Descendants("transaction"))
        {
            AddTransaction(element.CreateTransaction());
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing XML file: {ex.Message}");
    }
}

void UpdateCsvData(string filePath, bool useBulkProcessing)
{
    try
    {
        var csvData = File.ReadAllText(filePath);

        if (useBulkProcessing)
        {
            AddBulkTransaction(DataType.CSV, csvData);
            return;
        }

        using var reader = new StringReader(csvData);

        var headerLine = reader.ReadLine();

        if (headerLine == null)
        {
            Console.WriteLine("CSV file is empty or has no header.");
            return;
        }

        var headers = headerLine.Split(',');

        string? line;
        while ((line = reader.ReadLine()) != null)
        {
            if (string.IsNullOrWhiteSpace(line))
                continue;


            AddTransaction(line.CreateTransaction(headers));
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing CSV file: {ex.Message}");
    }
}

async Task AddTransaction(Transaction transaction)
{
    try
    {
        //First we would normally get token from the cache, or from an IDP, if we either do not have a token, or it is expired, for this excercise we are hard-coding.
        var client = new HttpClient();

        var token = GetSecurityToken();

        var baseUrl = configuration.GetSection("BaseUrl:Url").Value;

        if (baseUrl.EndsWith("/"))
            baseUrl = baseUrl.TrimEnd('/');

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var content = new StringContent(JsonSerializer.Serialize(transaction), System.Text.Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"{baseUrl}/processor", content);

        response.EnsureSuccessStatusCode();

        Console.WriteLine("Added New Record");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error adding transaction: {ex.Message}");
    }
}

async Task AddBulkTransaction(DataType type, string data)
{
    try 
    {
        //First we would normally get token from the cache, or from an IDP, if we either do not have a token, or it is expired, for this excercise we are hard-coding.
        var client = new HttpClient();
        //Setting to 10 minutes for this bulk transaction
        client.Timeout = TimeSpan.FromMinutes(10);

        var token = GetSecurityToken();

        var baseUrl = configuration.GetSection("BaseUrl:Url").Value;

        if (baseUrl.EndsWith("/"))
            baseUrl = baseUrl.TrimEnd('/');

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var bulkTransaction = new BulkTransaction
        {
            Type = type.ToString(),
            Data = data
        };

        var content = new StringContent(JsonSerializer.Serialize(bulkTransaction), System.Text.Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"{baseUrl}/processor/bulk", content);

        response.EnsureSuccessStatusCode();

        Console.WriteLine("Finished Bulk File");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error adding transaction: {ex.Message}");
    }
}

string GetSecurityToken()
{
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODUxNDA5ODQsImlhdCI6MTQ4NTEzNzM4NCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiIyOWFjMGMxOC0wYjRhLTQyY2YtODJmYy0wM2Q1NzAzMThhMWQiLCJhcHBsaWNhdGlvbklkIjoiNzkxMDM3MzQtOTdhYi00ZDFhLWFmMzctZTAwNmQwNWQyOTUyIiwicm9sZXMiOltdfQ.Mp0Pcwsz5VECK11Kf2ZZNF_SMKu5CgBeLN9ZOP04kZo";
}