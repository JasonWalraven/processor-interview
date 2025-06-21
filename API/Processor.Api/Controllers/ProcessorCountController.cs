using Microsoft.AspNetCore.Mvc;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Repositories;

namespace Processor.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProcessorCountController : ProcessorControllerBase
    {
        private IServiceProvider _provider;
        public ProcessorCountController(IServiceProvider provider)
        {
            _provider = provider;
        }

        [HttpGet]
        public int Get(string? cardNumber, string? status)
        {
            var repository = _provider.GetService<IProcessorRepository>();
            return repository?.Get(_provider, cardNumber, status) ?? 0;
        }
    }
}
