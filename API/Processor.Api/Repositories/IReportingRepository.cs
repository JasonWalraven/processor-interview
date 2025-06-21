using Processor.Api.Data.Common.Entities;

namespace Processor.Api.Repositories
{
    public interface IReportingRepository
    {
        IEnumerable<ReportingByCard> GetReportingByCard(IServiceProvider provider);
        IEnumerable<ReportingByCardType> GetReportingByCardType(IServiceProvider provider);
        IEnumerable<ReportingByDay> GetReportingByDay(IServiceProvider provider);
    }
}
