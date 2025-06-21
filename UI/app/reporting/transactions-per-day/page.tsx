'use client';

import React, { useState, useEffect } from 'react';
import { fetchReportingByDay, formatCurrency, formatDate } from '../../../lib/api';
import { DailyReport } from '../../../lib/types';
import DataTable from '../../../components/DataTable';

export default function TransactionsPerDay() {
  const [reportData, setReportData] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchReportingByDay();
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
      header: 'Transaction Date',
      accessor: 'transactionDate' as keyof DailyReport,
      render: (item: DailyReport) => formatDate(item.transactionDate)
    },
    {
      header: 'Transaction Count',
      accessor: 'transactionCount' as keyof DailyReport
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount' as keyof DailyReport,
      render: (item: DailyReport) => formatCurrency(item.totalAmount)
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions Per Day</h1>
      
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
              keyField="transactionDate"
              emptyMessage="No transaction data available"
            />
            
            {reportData.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-right">
                Total Days: {reportData.length}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
