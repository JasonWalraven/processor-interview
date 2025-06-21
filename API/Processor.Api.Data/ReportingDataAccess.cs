using Microsoft.Data.Sqlite;
using Processor.Api.Data.Common.Entities;
using Processor.Api.Data.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Processor.Api.Data
{
    public class ReportingDataAccess : IReportingDataAccess
    {
        public string? ConnectionString { get; set; }

        public IEnumerable<ReportingByCard> GetReportingByCard()
        {
            var results = new List<ReportingByCard>();

            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT CardNumber, COUNT(Id) AS TransactionCount, SUM(Amount) AS TotalAmount FROM \"Transaction\" WHERE TransactionStatus=1 GROUP BY CardNumber";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new ReportingByCard
                            {
                                CardNumber = reader.GetString(reader.GetOrdinal("CardNumber")),
                                TransactionCount = reader.GetInt32(reader.GetOrdinal("TransactionCount")),
                                TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount"))
                            });
                        }
                    }
                }
            }

            return results;
        }

        public IEnumerable<ReportingByCardType> GetReportingByCardType()
        {
            var results = new List<ReportingByCardType>();

            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT CardType, COUNT(Id) AS TransactionCount, SUM(Amount) AS TotalAmount FROM \"Transaction\" WHERE TransactionStatus=1 GROUP BY CardType";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new ReportingByCardType
                            {
                                CardType = reader.GetString(reader.GetOrdinal("CardType")),
                                TransactionCount = reader.GetInt32(reader.GetOrdinal("TransactionCount")),
                                TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount"))
                            });
                        }
                    }
                }
            }

            return results;
        }

        public IEnumerable<ReportingByDay> GetReportingByDay()
        {
            var results = new List<ReportingByDay>();

            using (var connection = new SqliteConnection(ConnectionString))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT strftime('%m/%d/%Y', date(TransactionTimeStamp)) AS TransactionDate, COUNT(Id) AS TransactionCount, SUM(Amount) AS TotalAmount FROM \"Transaction\" WHERE TransactionStatus=1 GROUP BY strftime('%m/%d/%Y', date(TransactionTimeStamp))";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new ReportingByDay
                            {
                                TransactionDate = DateOnly.Parse(reader.GetString(reader.GetOrdinal("TransactionDate"))),
                                TransactionCount = reader.GetInt32(reader.GetOrdinal("TransactionCount")),
                                TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount"))
                            });
                        }
                    }
                }
            }

            return results;
        }
    }
}
