<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SignaPay Transaction Processor Application

This is a Next.js application with TypeScript for processing and viewing transaction data.

## Key Components

- `/app/processor/view-transactions`: View and filter transaction records (FR002)
- `/app/processor/process-transactions`: Add new transactions via JSON, XML, or CSV formats (FR003)
- `/app/reporting/transactions-by-card`: View transaction reports by card (FR004)
- `/app/reporting/transactions-by-card-type`: View transaction reports by card type (FR005)
- `/app/reporting/transactions-per-day`: View transaction reports by day (FR006)
- `/app/reporting/rejected-transactions`: View rejected transactions (FR007)

## API Endpoints

- `GET https://localhost:7039/ProcessorCount`: Get total count of transactions (with optional cardNumber filter)
- `GET https://localhost:7039/processor`: Get paged transaction data (with pageNum and optional cardNumber parameters)
- `POST https://localhost:7039/processor`: Submit new transactions (with type and data parameters)
- `GET https://localhost:7039/ReportingByCard`: Get transaction totals by card
- `GET https://localhost:7039/ReportingByCardType`: Get transaction totals by card type
- `GET https://localhost:7039/ReportingByDay`: Get transaction totals by day
- `GET https://localhost:7039/Processor?status=Rejected`: Get count of rejected transactions

## Data Structures

- Transaction: Includes id, cardNumber, cardType, amount, transactionTimeStamp, transactionStatus, transactionProcessedTimeStamp
- CardReport: Includes cardNumber, transactionCount, totalAmount
- CardTypeReport: Includes cardType, transactionCount, totalAmount
- DailyReport: Includes transactionDate, transactionCount, totalAmount
