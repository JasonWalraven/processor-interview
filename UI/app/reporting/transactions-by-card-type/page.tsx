'use client';

import React, { useState, useEffect } from 'react';
import { fetchReportingByCardType, formatCurrency } from '../../../lib/api';
import { CardTypeReport } from '../../../lib/types';
import DataTable from '../../../components/DataTable';

export default function TransactionsByCardType() {
  const [reportData, setReportData] = useState<CardTypeReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchReportingByCardType();
        setReportData(data);
      } catch (err) {
        setError('Failed to fetch report data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadReportData();
  }, []);
    const columns = [
    {
      header: 'Card Type',
      accessor: 'cardType' as keyof CardTypeReport
    },
    {
      header: 'Transaction Count',
      accessor: 'transactionCount' as keyof CardTypeReport
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount' as keyof CardTypeReport,
      render: (item: CardTypeReport) => formatCurrency(item.totalAmount)
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions By Card Type</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Loading report data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <DataTable
              data={reportData}
              columns={columns}
              keyField="cardType"
              emptyMessage="No transaction data available"
            />
            
            {reportData.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-right">
                Total Card Types: {reportData.length}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
