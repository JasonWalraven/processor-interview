# SignaPay Processor Interview UI

This is the UI portion of the processor interview project. It's built with Next.js and TypeScript.

## Features

The application consists of the following key features:

1. **View Transactions** - Displays a paged list of transactions with filtering by card number and status
2. **Process Transactions** - Allows adding new transactions in JSON, XML, or CSV formats
3. **Reporting**
   - Transactions By Card - Shows transaction counts and total amounts by card number
   - Transactions By Card Type - Shows transaction counts and total amounts by card type
   - Transactions Per Day - Shows transaction counts and total amounts by day
   - Rejected Transactions - Shows a paged list of rejected transactions

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

This UI connects to the following API endpoints:

- `GET https://localhost:7039/ProcessorCount` - Get total count of transactions
- `GET https://localhost:7039/processor` - Get paged transaction data
- `POST https://localhost:7039/processor` - Submit new transactions
- `GET https://localhost:7039/ReportingByCard` - Get transaction totals by card
- `GET https://localhost:7039/ReportingByCardType` - Get transaction totals by card type
- `GET https://localhost:7039/ReportingByDay` - Get transaction totals by day
- `GET https://localhost:7039/Processor?status=Rejected` - Get count of rejected transactions

Make sure the API server is running at `https://localhost:7039` before using this application.
