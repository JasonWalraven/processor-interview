'use client';

import React, { useState, useEffect } from 'react';
import { fetchReportingByCard, formatCurrency } from '../../../lib/api';
import { CardReport } from '../../../lib/types';
import DataTable from '../../../components/DataTable';

// Mock data for testing when API is unavailable
const mockData: CardReport[] = [
  { cardNumber: '4111111111111111', transactionCount: 5, totalAmount: 500.00 },
  { cardNumber: '5555555555554444', transactionCount: 3, totalAmount: 300.50 },
  { cardNumber: '3782822463100005', transactionCount: 2, totalAmount: 250.75 }
];

export default function TransactionsByCard() {
  const [reportData, setReportData] = useState<CardReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);
  
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching report data...');
        const data = await fetchReportingByCard();
        console.log('Received report data:', data);
        
        // Check if data is array and has content
        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          setError('Invalid data format received');
          return;
        }
        
        if (data.length === 0) {
          console.log('No data returned from API');
        }
        
        // Ensure data has the expected structure
        const validData = data.filter(item => 
          typeof item === 'object' && 
          item !== null && 
          'cardNumber' in item && 
          'transactionCount' in item && 
          'totalAmount' in item
        );
        
        if (validData.length !== data.length) {
          console.warn('Some items were filtered due to invalid structure', data);
        }
        
        setReportData(validData);      } catch (err) {
        console.error('Error in fetch operation:', err);
        
        // Check for specific error types
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          setError('Could not connect to the server. The API might be unavailable.');
        } else {
          setError('Failed to fetch report data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadReportData();
  }, []);
    const columns = [
    {
      header: 'Card Number',
      accessor: 'cardNumber' as keyof CardReport
    },
    {
      header: 'Transaction Count',
      accessor: 'transactionCount' as keyof CardReport
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount' as keyof CardReport,
      render: (item: CardReport) => formatCurrency(item.totalAmount)
    }
  ];
    // Function to use mock data when real API fails
  const loadMockData = () => {
    setUseMockData(true);
    setReportData(mockData);
    setError(null);
    setLoading(false);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions By Card</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div></div>
        {error && !useMockData && (
          <button 
            onClick={loadMockData}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm transition"
          >
            Use Sample Data
          </button>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Loading report data...</p>
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
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ): (
          <>
            <DataTable
              data={reportData.length > 0 ? reportData : mockData}
              columns={columns}
              keyField="cardNumber"
              emptyMessage="No transaction data available"
            />
            
            {reportData.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-right">
                Total Cards: {reportData.length}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
