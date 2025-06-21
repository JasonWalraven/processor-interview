using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Processor.Api.Data.Common.Entities
{
    public class ReportingByDay : ReportingBase
    {
        public DateOnly TransactionDate { get; set; }
    }
}
