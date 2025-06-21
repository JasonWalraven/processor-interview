'use client';

import React, { useState, useEffect } from 'react';
import { fetchRejectedTransactionsCount, fetchProcessorData, formatCurrency, formatDateTime } from '../../../lib/api';
import { Transaction } from '../../../lib/types';
import DataTable from '../../../components/DataTable';
import Pagination from '../../../components/Pagination';

// Mock data for testing when API is unavailable
const mockRejectedTransactions: Transaction[] = [
  {
    id: 1,
    cardNumber: '4111111111111111',
    cardType: 'Visa',
    amount: 125.50,
    transactionTimeStamp: '2025-06-18T14:32:15',
    transactionStatus: 2, // Rejected
    transactionProcessedTimeStamp: '2025-06-18T14:32:16'
  },
  {
    id: 2,
    cardNumber: '5555555555554444',
    cardType: 'MasterCard',
    amount: 89.99,
    transactionTimeStamp: '2025-06-18T15:11:22',
    transactionStatus: 2, // Rejected
    transactionProcessedTimeStamp: '2025-06-18T15:11:23'
  },
  {
    id: 3,
    cardNumber: '3782822463100005',
    cardType: 'AmEx',
    amount: 299.95,
    transactionTimeStamp: '2025-06-18T16:42:08',
    transactionStatus: 2, // Rejected
    transactionProcessedTimeStamp: '2025-06-18T16:42:09'
  }
];

export default function RejectedTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [useMockData, setUseMockData] = useState<boolean>(false);
  
  const recordsPerPage = 25;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  
  const fetchData = async (page: number) => {
    console.log(`Fetching rejected transactions for page ${page}`);
    setLoading(true);
    setError(null);
    
    try {
      // Fetch total count of rejected transactions
      console.log('Fetching rejected transactions count...');
      const count = await fetchRejectedTransactionsCount();
      console.log(`Rejected transactions count: ${count}`);
      setTotalRecords(count);
      
      // Fetch rejected transactions data for the current page
      console.log(`Fetching rejected transactions for page ${page}...`);
      const data = await fetchProcessorData(page, undefined, '2'); // Using 2 for Rejected status
      console.log(`Retrieved ${data.length} rejected transactions:`, data);
      setTransactions(data);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching rejected transactions:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Could not connect to the server. The API might be unavailable.');
      } else {
        setError('Failed to fetch rejected transactions. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };
  
  // Load mock data function
  const loadMockData = () => {
    setUseMockData(true);
    setTransactions(mockRejectedTransactions);
    setTotalRecords(mockRejectedTransactions.length);
    setError(null);
    setLoading(false);
    setCurrentPage(1);
  };
  
  // Initial data load
  useEffect(() => {
    console.log('Initial load of rejected transactions');
    fetchData(1);
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
    }
  ];
    return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rejected Transactions</h1>
      
      {/* Sample data button */}
      {error && !useMockData && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={loadMockData}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm transition"
          >
            Use Sample Data
          </button>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Loading rejected transactions...</p>
          </div>
        ) : error ? (
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
              onClick={() => fetchData(1)}
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
              emptyMessage="No rejected transactions found"
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
