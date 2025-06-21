using Processor.Api.Data.Common.Interfaces;
using Processor.Api.Data.Common.Entities;
using Microsoft.Data.Sqlite;
using System.Text;
using Microsoft.Extensions.Primitives;
using System.Text.Json;
using System.Xml;
using System.Xml.Linq;

namespace Processor.Api.Data
{
    public class ProcessorDataAccess : IProcessorDataAccess
    {
        public string? ConnectionString { get; set; }

        public void AddTransaction(Transaction transaction)
        {
            //This enters transactions in a "bulk state. Normally we woun't do this, it would be done individually in an API, and a website.  If we have to process bulk, such as from a file the records
            //should be put on a queue in a queuing system and a containerized process should pick up for processing.
            //Performing the processing this way is going to bad for API performance.

            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "INSERT INTO \"Transaction\" (CardNumber, CardType, Amount, TransactionTimeStamp, TransactionStatus, TransactionProcessedTimeStamp) VALUES (@CardNumber, @CardType, @Amount, @TransactionTimeStamp, @TransactionStatus, @TransactionProcessedTimeStamp)";
                    command.Parameters.AddWithValue("@CardNumber", transaction.CardNumber);
                    command.Parameters.AddWithValue("@CardType", transaction.CardType);
                    command.Parameters.AddWithValue("@Amount", transaction.Amount);
                    command.Parameters.AddWithValue("@TransactionTimeStamp", transaction.TransactionTimeStamp.ToString("o"));
                    command.Parameters.AddWithValue("@TransactionStatus", (int)transaction.TransactionStatus);
                    command.Parameters.AddWithValue("@TransactionProcessedTimeStamp", DateTime.Now.ToString("o"));

                    command.ExecuteNonQuery();
                }
            }
        }

        public Transaction Get(int id)
        {
            var transaction = new Transaction();

            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT Id, CardNumber, CardType, Amount, TransactionTimeStamp, TransactionStatus, TransactionProcessedTimeStamp FROM \"Transaction\" WHERE Id=@Id";
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            transaction.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                            transaction.CardNumber = reader.GetString(reader.GetOrdinal("CardNumber"));
                            transaction.CardType = reader.GetString(reader.GetOrdinal("CardType"));
                            transaction.Amount = reader.GetDecimal(reader.GetOrdinal("Amount"));
                            transaction.TransactionTimeStamp = DateTime.Parse(reader.GetString(reader.GetOrdinal("TransactionTimeStamp")));
                            transaction.TransactionStatus = (TransactionStatusType)reader.GetInt32(reader.GetOrdinal("TransactionStatus"));
                            transaction.TransactionProcessedTimeStamp = DateTime.Parse(reader.GetString(reader.GetOrdinal("TransactionProcessedTimeStamp")));
                        }
                    }
                }
            }

            return transaction;
        }

        public IEnumerable<Transaction> Get(int pageNumber, string? cardNumber, TransactionStatusType? transactionStatus)
        {
            var transactions = new List<Transaction>();

            const int pageSize = 25;
            var startRow = pageSize * (pageNumber - 1) + 1;
            var endRow = pageSize * pageNumber;

            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    var sqlText = new StringBuilder();

                    sqlText.Append("SELECT Id, CardNumber, CardType, Amount, TransactionTimeStamp, TransactionStatus, TransactionProcessedTimeStamp FROM (SELECT Id, CardNumber, CardType, Amount, TransactionTimeStamp, TransactionStatus, TransactionProcessedTimeStamp, ROW_NUMBER() OVER (ORDER BY Id) AS RowNum FROM \"Transaction\"");

                    if (!string.IsNullOrWhiteSpace(cardNumber))
                    {
                        sqlText.Append($"  WHERE CardNumber LIKE @CardNumber");
                        command.Parameters.AddWithValue("@CardNumber", $"{cardNumber}%");
                    }

                    if (transactionStatus.HasValue)
                    {
                        if (string.IsNullOrWhiteSpace(cardNumber))
                        {
                            sqlText.Append(" WHERE ");
                        }
                        else
                        {
                            sqlText.Append(" AND ");
                        }
                        sqlText.Append($"TransactionStatus = @TransactionStatus");
                        command.Parameters.AddWithValue("@TransactionStatus", (int)transactionStatus.Value);
                    }

                    sqlText.Append(@") AS Result WHERE RowNum BETWEEN @StartRow AND @EndRow");

                    command.CommandText = sqlText.ToString();

                    command.Parameters.AddWithValue("@StartRow", startRow);
                    command.Parameters.AddWithValue("@EndRow", endRow);

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            transactions.Add(new Transaction
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                CardNumber = reader.GetString(reader.GetOrdinal("CardNumber")),
                                CardType = reader.GetString(reader.GetOrdinal("CardType")),
                                Amount = reader.GetDecimal(reader.GetOrdinal("Amount")),
                                TransactionTimeStamp = DateTime.Parse(reader.GetString(reader.GetOrdinal("TransactionTimeStamp"))),
                                TransactionStatus = (TransactionStatusType)reader.GetInt32(reader.GetOrdinal("TransactionStatus")),
                                TransactionProcessedTimeStamp = DateTime.Parse(reader.GetString(reader.GetOrdinal("TransactionProcessedTimeStamp")))
                            });
                        }
                    }
                }
            }

            return transactions;
        }

        public int GetCount(string? cardNumber, TransactionStatusType? transactionStatus)
        {
            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    var sqlText = new StringBuilder();

                    sqlText.Append("SELECT COUNT(Id) FROM \"Transaction\"");

                    if (!string.IsNullOrWhiteSpace(cardNumber))
                    {
                        sqlText.Append(" WHERE CardNumber LIKE @CardNumber");
                        command.Parameters.AddWithValue("@CardNumber", $"{cardNumber}%");
                    }

                    if (transactionStatus.HasValue)
                    {
                        if (string.IsNullOrWhiteSpace(cardNumber))
                        {
                            sqlText.Append(" WHERE ");
                        }
                        else
                        {
                            sqlText.Append(" AND ");
                        }
                        sqlText.Append($"TransactionStatus = @TransactionStatus");
                        command.Parameters.AddWithValue("@TransactionStatus", (int)transactionStatus.Value);
                    }

                    command.CommandText = sqlText.ToString();              

                    return Convert.ToInt32(command.ExecuteScalar());
                }
            }
        }
    }
}
