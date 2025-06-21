using Microsoft.AspNetCore.Mvc;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Repositories;

namespace Processor.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportingByDayController : ProcessorControllerBase
    {
        private IServiceProvider _provider;
        public ReportingByDayController(IServiceProvider provider)
        {
            _provider = provider;
        }

        [HttpGet]
        public IEnumerable<ReportingByDay> Get()
        {
            return _provider.GetService<IReportingRepository>()?.GetReportingByDay(_provider) ?? new List<ReportingByDay>();
        }
    }
}
