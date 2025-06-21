'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchProcessorCount, fetchProcessorData, formatCurrency, formatDateTime, mapTransactionStatus } from '../../../lib/api';
import { Transaction } from '../../../lib/types';
import { debounce } from '../../../lib/utils';
import Pagination from '../../../components/Pagination';
import DataTable from '../../../components/DataTable';

// Mock data for testing when API is unavailable
const mockTransactions: Transaction[] = [
  {
    id: 1,
    cardNumber: '4111111111111111',
    cardType: 'Visa',
    amount: 125.50,
    transactionTimeStamp: '2025-06-18T14:32:15',
    transactionStatus: 1,
    transactionProcessedTimeStamp: '2025-06-18T14:32:16'
  },
  {
    id: 2,
    cardNumber: '5555555555554444',
    cardType: 'MasterCard',
    amount: 89.99,
    transactionTimeStamp: '2025-06-18T15:11:22',
    transactionStatus: 1,
    transactionProcessedTimeStamp: '2025-06-18T15:11:23'
  },
  {
    id: 3,
    cardNumber: '3782822463100005',
    cardType: 'AmEx',
    amount: 299.95,
    transactionTimeStamp: '2025-06-18T16:42:08',
    transactionStatus: 2,
    transactionProcessedTimeStamp: '2025-06-18T16:42:09'
  }
];

export default function ViewTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cardNumberFilter, setCardNumberFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('-1'); // Default to "All"
  const [useMockData, setUseMockData] = useState<boolean>(false);
  
  const recordsPerPage = 25;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  
  // Debounced function for searching by card number
  const debouncedCardNumberSearch = useCallback(
    debounce((cardNumber: string) => {
      setCurrentPage(1);
      fetchData(1, cardNumber, statusFilter);
    }, 100),
    [statusFilter]
  );
    const fetchData = async (page: number, cardNumber?: string, status?: string) => {
    console.log(`Fetching data for page ${page}, cardNumber: ${cardNumber || 'none'}, status: ${status || 'none'}`);
    setLoading(true);
    setError(null);
    
    try {
      // Filter out -1 status (All) to not send it to the API
      const statusParam = status && status !== '-1' ? status : undefined;
      
      if (useMockData) {
        // Use mock data for testing
        console.log('Using mock data');
        const start = (page - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const filteredTransactions = mockTransactions
          .filter(tx => 
            (!cardNumber || tx.cardNumber.includes(cardNumber)) &&
            (!statusParam || tx.transactionStatus.toString() === statusParam)
          )
          .slice(start, end);
        
        setTotalRecords(filteredTransactions.length);
        setTransactions(filteredTransactions);
      } else {
        // Fetch total count
        console.log('Fetching count...');
        const count = await fetchProcessorCount(cardNumber, statusParam);
        console.log(`Total pages: ${count}`);
        setTotalRecords(count);
        
        // Fetch data for the current page
        console.log(`Fetching page ${page} data...`);
        const data = await fetchProcessorData(page, cardNumber, statusParam);
        console.log(`Retrieved ${data.length} transactions`);
        
        // Update state with the fetched data
        setCurrentPage(page);
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. The API might be unavailable.');
      } else {
        setError('Failed to fetch transactions. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle card number filter change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumberFilter(value);
    debouncedCardNumberSearch(value);
  };
  
  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    setCurrentPage(1);
    fetchData(1, cardNumberFilter, value);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page, cardNumberFilter, statusFilter);
  };  
  // Effect to load data on initial page load
  useEffect(() => {
    console.log('Initial data loading');
    // Always start with page 1 on initial load
    fetchData(1, '', statusFilter);
  }, []);
    const columns = [
    {
      header: 'Card Type',
      accessor: 'cardType' as keyof Transaction
    },
    {
      header: 'Card Number',
      accessor: 'cardNumber' as keyof Transaction
    },
    {
      header: 'Amount',
      accessor: 'amount' as keyof Transaction,
      render: (item: Transaction) => formatCurrency(item.amount)
    },
    {
      header: 'Transaction Timestamp',
      accessor: 'transactionTimeStamp' as keyof Transaction,
      render: (item: Transaction) => formatDateTime(item.transactionTimeStamp)
    },
    {
      header: 'Status',
      accessor: 'transactionStatus' as keyof Transaction,
      render: (item: Transaction) => mapTransactionStatus(item.transactionStatus)
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">View Transactions</h1>
        {/* Sample data button */}
      {error && !useMockData && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => {
              setUseMockData(true);
              setTransactions(mockTransactions);
              setTotalRecords(mockTransactions.length);
              setError(null);
              setLoading(false);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm transition"
          >
            Use Sample Data
          </button>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Card Number Filter */}
          <div className="flex-1">
            <label htmlFor="cardNumber" className="block mb-2 text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={cardNumberFilter}
              onChange={handleCardNumberChange}
              placeholder="Filter by card number..."
            />
          </div>
          
          {/* Status Filter */}
          <div className="md:w-1/3">
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="All">All</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Loading transactions...</p>
          </div>        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <svg 
              className="w-12 h-12 mx-auto text-red-500 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium text-lg">{error}</p>
            <button 
              onClick={() => fetchData(1, cardNumberFilter, statusFilter)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ): (
          <>
            <DataTable
              data={transactions}
              columns={columns}
              keyField="id"
              emptyMessage="No transactions found"
            />
            
            {totalPages > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="text-sm text-gray-500 text-center mt-2">
                  Showing {Math.min((currentPage - 1) * recordsPerPage + 1, totalRecords)}-
                  {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} results
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
