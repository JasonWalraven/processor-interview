using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Processor.Api.Data.Common.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public string CardNumber { get; set; } = string.Empty;
        public string CardType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime TransactionTimeStamp { get; set; }
        public TransactionStatusType TransactionStatus { get; set; } = TransactionStatusType.Undefined;
        public DateTime TransactionProcessedTimeStamp { get; set; }
    }
}
