using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Processor.Api.Data.Common.Entities
{
    public abstract class ReportingBase
    {
        public int TransactionCount { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
