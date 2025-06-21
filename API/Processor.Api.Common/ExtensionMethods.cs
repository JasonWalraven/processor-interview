using Processor.Api.Data.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Processor.Api.Data.Common
{
    public static class ExtensionMethods
    {
        public static void Validate(this Transaction transaction)
        {
            switch (transaction.CardNumber)
            {
                case var s when s.StartsWith("4"):
                    transaction.CardType = "Visa";
                    transaction.TransactionStatus = TransactionStatusType.Accepted;
                    break;
                case var s when s.StartsWith("5"):
                    transaction.CardType = "MasterCard";
                    transaction.TransactionStatus = TransactionStatusType.Accepted;
                    break;
                case var s when s.StartsWith("3"):
                    transaction.CardType = "American Express";
                    transaction.TransactionStatus = TransactionStatusType.Accepted;
                    break;
                case var s when s.StartsWith("6"):
                    transaction.CardType = "Discover";
                    transaction.TransactionStatus = TransactionStatusType.Accepted;
                    break;
                default:
                    transaction.CardType = "Unknown";
                    transaction.TransactionStatus = TransactionStatusType.Rejected;
                    break;
            }
        }

        public static Transaction CreateTransaction(this JsonElement element)
        {
            return new Transaction
            {
                CardNumber = element.GetProperty("cardNumber").GetString() ?? string.Empty,
                Amount = element.GetProperty("amount").GetDecimal(),
                TransactionTimeStamp = element.GetProperty("timestamp").GetDateTime()
            };
        }

        public static Transaction CreateTransaction(this XElement element)
        {
            return new Transaction
            {
                CardNumber = element.Element("cardNumber")?.Value ?? string.Empty,
                Amount = decimal.Parse(element.Element("amount")?.Value ?? "0"),
                TransactionTimeStamp = DateTime.Parse(element.Element("timestamp")?.Value ?? DateTime.Now.ToString())
            };
        }

        public static Transaction CreateTransaction(this string data, string[] headers)
        {
            var values = data.Split(',');

            if (values.Length != headers.Length)
            {
                throw new ArgumentException("The number of values does not match the number of headers.");
            }

            var transaction = new Transaction();

            for (int i = 0; i < headers.Length; i++)
            {
                switch (headers[i].ToLower())
                {
                    case "cardnumber":
                        transaction.CardNumber = values[i];
                        break;
                    case "amount":
                        transaction.Amount = decimal.Parse(values[i]);
                        break;
                    case "timestamp":
                        transaction.TransactionTimeStamp = DateTime.Parse(values[i]);
                        break;
                }
            }

            return transaction;
        }
    }
}
