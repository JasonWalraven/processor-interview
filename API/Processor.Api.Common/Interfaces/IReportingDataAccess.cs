using Processor.Api.Data.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Processor.Api.Data.Common.Interfaces
{
    public interface IReportingDataAccess
    {
        string? ConnectionString { get; set; }

        IEnumerable<ReportingByCardType> GetReportingByCardType();

        IEnumerable<ReportingByCard> GetReportingByCard();

        IEnumerable<ReportingByDay> GetReportingByDay();
    }
}
