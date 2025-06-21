using Processor.Api.Data.Common;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using System.Text.Json;
using System.Xml.Linq;

namespace Processor.Api.Repositories
{
    public class ProcessorRepository : IProcessorRepository
    {
        public IEnumerable<Transaction> Get(IServiceProvider provider, int pageNumber, string? cardNumber, string? status)
        {
            var processorData = provider.GetService<IProcessorDataAccess>();
            var transactionStatus = (string.IsNullOrEmpty(status) || status.ToLower().Equals("all") || status.ToLower().Equals("undefined"))
                ? (TransactionStatusType?)null
                : Enum.TryParse<TransactionStatusType>(status, true, out var parsedStatus)
                    ? parsedStatus
                    : null;

            return processorData?.Get(pageNumber, cardNumber, transactionStatus) ?? new List<Transaction>();
        }

        public void SaveTransactions(IServiceProvider provider, DataType type, string data)
        {
            switch (type)
            {
                case DataType.JSON:
                    SaveJsonData(provider, data);
                    break;
                case DataType.XML:
                    SaveXmlData(provider, data);
                    break;
                case DataType.CSV:
                    SaveCsvData(provider, data);
                    break;
            }
        }

        public void AddTransaction(IServiceProvider provider, Transaction transaction)
        {
            //Perform validation
            ValidateTransaction(transaction);

            provider.GetService<IProcessorDataAccess>()?.AddTransaction(transaction);
        }

        public int Get(IServiceProvider provider, string? cardNumber, string? status)
        {
            var transactionStatus = (string.IsNullOrEmpty(status) || status.ToLower().Equals("all") || status.ToLower().Equals("undefined"))
                ? (TransactionStatusType?)null
                : Enum.TryParse<TransactionStatusType>(status, true, out var parsedStatus)
                    ? parsedStatus
            : null;

            return provider.GetService<IProcessorDataAccess>().GetCount(cardNumber, transactionStatus);
        }

        private void SaveJsonData(IServiceProvider provider, string data)
        {
            var document = JsonDocument.Parse(data);

            if (document.RootElement.ValueKind == JsonValueKind.Array)
            {

                foreach (var item in document.RootElement.EnumerateArray())
                {
                    if (item.ValueKind != JsonValueKind.Object)
                        continue;

                    var transaction = item.CreateTransaction();

                    //var transaction = new Transaction();

                    //foreach (var property in item.EnumerateObject())
                    //{
                    //    switch (property.Name.ToLower())
                    //    {
                    //        case "cardnumber":
                    //            transaction.CardNumber = property.Value.GetString() ?? string.Empty;
                    //            break;
                    //        case "amount":
                    //            transaction.Amount = property.Value.GetDecimal();
                    //            break;
                    //        case "timestamp":
                    //            transaction.TransactionTimeStamp = property.Value.GetDateTime();
                    //            break;
                    //    }
                    //}

                    AddTransaction(provider, transaction);
                }
            }
        }

        private void SaveXmlData(IServiceProvider provider, string data)
        {
            var document = XDocument.Parse(data);

            foreach (var element in document.Descendants("transaction"))
            {
                var transaction = element.CreateTransaction();
                //var transaction = new Transaction
                //{
                //    CardNumber = element.Element("cardNumber")?.Value ?? string.Empty,
                //    Amount = decimal.Parse(element.Element("amount")?.Value ?? "0"),
                //    TransactionTimeStamp = DateTime.Parse(element.Element("timestamp")?.Value ?? DateTime.MinValue.ToString())
                //};

                AddTransaction(provider, transaction);
            }
        }

        private void SaveCsvData(IServiceProvider provider, string data)
        {
            using var reader = new StringReader(data);

            string? headerLine = reader.ReadLine();

            if (headerLine == null)
                return;

            var headers = headerLine.Split(',');

            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                var transaction = line.CreateTransaction(headers);

                //var values = line.Split(',');

                //var transaction = new Transaction();

                //for (int i = 0; i < headers.Length && i < values.Length; i++)
                //{
                //    var header = headers[i].Trim().ToLowerInvariant();
                //    var value = values[i].Trim();

                //    switch (header)
                //    {
                //        case "cardnumber":
                //            transaction.CardNumber = value;
                //            break;
                //        case "amount":
                //            transaction.Amount = decimal.TryParse(value, out var amt) ? amt : 0;
                //            break;
                //        case "timestamp":
                //            transaction.TransactionTimeStamp = DateTime.TryParse(value, out var ts) ? ts : DateTime.MinValue;
                //            break;
                //    }
                //}

                AddTransaction(provider, transaction);
            }
        }

        private void ValidateTransaction(Transaction transaction)
        {
            //Normally, I like to do this differently, but given the trying to make this quick and no code duplication, I chose the extension method. Also, doing this as a method lets me change this later
            transaction.Validate();
        }
    }
}
