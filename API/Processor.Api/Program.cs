using Processor.Api.Data;
using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Repositories;
using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:4000", "http://localhost:8083")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IProcessorDataAccess, ProcessorDataAccess>(sp =>
{
    return new ProcessorDataAccess
    {
        ConnectionString = builder.Configuration.GetConnectionString("Processor")
    };
});

builder.Services.AddScoped<IReportingDataAccess, ReportingDataAccess>(sp =>
{
    return new ReportingDataAccess
    {
        ConnectionString = builder.Configuration.GetConnectionString("Processor")
    };
});

builder.Services.AddScoped<IProcessorRepository, ProcessorRepository>();
builder.Services.AddScoped<IReportingRepository, ReportingRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();

