using Processor.Api.Data.Common.Entities;

namespace Processor.Api.Repositories
{
    public interface IProcessorRepository
    {
        IEnumerable<Transaction> Get(IServiceProvider provider, int pageNumber, string? cardNumber, string? status);

        void SaveTransactions(IServiceProvider provider, DataType type, string data);

        void AddTransaction(IServiceProvider provider, Transaction transaction);

        int Get(IServiceProvider provider, string? cardNumber, string? status);
    }
}
