using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Repositories;
using System.Text.Json;
using System.Xml.Linq;

namespace Processor.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProcessorController : ProcessorControllerBase
    {
        private IServiceProvider _provider;

        public ProcessorController(IServiceProvider provider)
        {
            _provider = provider;
        }

        [HttpGet]
        public IEnumerable<Transaction> Get(int pageNumber, string? cardNumber, string? status)
        {
            return _provider.GetService<IProcessorRepository>()?.Get(_provider, pageNumber, cardNumber, status) ?? new List<Transaction>();
        }

        [HttpPost("bulk")]
        public void Post(BulkTransaction data)
        {
            var type = Enum.TryParse<DataType>(data.Type, true, out var parsedType) ? parsedType : DataType.JSON;

            _provider.GetService<IProcessorRepository>()?.SaveTransactions(_provider, type, data.Data);
        }

        [HttpPost]
        public void Post(Transaction data)
        {
            _provider.GetService<IProcessorRepository>()?.AddTransaction(_provider, data);
        }
    }
}
