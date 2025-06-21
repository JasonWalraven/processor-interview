using Processor.Api.Data.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Processor.Api.Data.Common.Interfaces
{
    public interface IProcessorDataAccess
    {
        string? ConnectionString { get; set; }

        Transaction Get(int id);

        IEnumerable<Transaction> Get(int pageNumber, string? cardNumber, TransactionStatusType? transactionStatus);

        void AddTransaction(Transaction transaction);

        int GetCount(string? cardNumber, TransactionStatusType? transactionStatus);
    }
}
