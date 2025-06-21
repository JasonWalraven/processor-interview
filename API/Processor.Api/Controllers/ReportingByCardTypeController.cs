using Microsoft.AspNetCore.Mvc;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Repositories;

namespace Processor.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportingByCardTypeController : ProcessorControllerBase
    {
        private IServiceProvider _provider;

        public ReportingByCardTypeController(IServiceProvider provider)
        {
            _provider = provider;
        }

        [HttpGet]
        public IEnumerable<ReportingByCardType> Get()
        {
            return _provider.GetService<IReportingRepository>()?.GetReportingByCardType(_provider) ?? new List<ReportingByCardType>();
        }
    }
}
