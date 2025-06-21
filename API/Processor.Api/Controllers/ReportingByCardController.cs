using Microsoft.AspNetCore.Mvc;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Repositories;
using System.Security.Cryptography.X509Certificates;

namespace Processor.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReportingByCardController : ProcessorControllerBase
    {
        private IServiceProvider _provider;

        public ReportingByCardController(IServiceProvider provider)
        {
            _provider = provider;
        }

        [HttpGet]
        public IEnumerable<ReportingByCard> Get()
        {
            return _provider.GetService<IReportingRepository>()?.GetReportingByCard(_provider) ?? new List<ReportingByCard>();
        }
    }
}
