using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;

namespace Processor.Api.Repositories
{
    public class ReportingRepository : IReportingRepository
    {
        public IEnumerable<ReportingByCard> GetReportingByCard(IServiceProvider provider)
        {
            return provider.GetService<IReportingDataAccess>()?.GetReportingByCard() ?? [];
        }

        public IEnumerable<ReportingByCardType> GetReportingByCardType(IServiceProvider provider)
        {
            return provider.GetService<IReportingDataAccess>()?.GetReportingByCardType() ?? [];
        }

        public IEnumerable<ReportingByDay> GetReportingByDay(IServiceProvider provider)
        {
            return provider.GetService<IReportingDataAccess>()?.GetReportingByDay() ?? [];
        }
    }
}
