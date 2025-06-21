'use client';

import React, { useState } from 'react';
import { submitProcessorData } from '../../../lib/api';

export default function ProcessTransactions() {
  const [type, setType] = useState<string>('JSON');
  const [data, setData] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Basic validation function for different formats
  const validateData = (dataStr: string, format: string): string | null => {
    try {
      switch (format.toUpperCase()) {
        case 'JSON':
          // Try to parse as JSON
          JSON.parse(dataStr);
          return null;
        case 'XML':
          // Basic XML validation (checks opening/closing tags)
          if (!dataStr.includes('<transactions>') || !dataStr.includes('</transactions>')) {
            return 'XML data must include <transactions> root element';
          }
          return null;
        case 'CSV':
          // Check for header row and at least one data row
          const lines = dataStr.trim().split('\n');
          if (lines.length < 2) {
            return 'CSV must include a header row and at least one data row';
          }
          const headerFields = lines[0].split(',');
          if (headerFields.length < 3 || 
              !headerFields.includes('cardNumber') || 
              !headerFields.includes('amount') || 
              !headerFields.includes('timestamp')) {
            return 'CSV header must include cardNumber, amount, and timestamp fields';
          }
          return null;
        default:
          return null;
      }    } catch (e) {
      return `Invalid ${format} format: ${e instanceof Error ? e.message : String(e)}`;
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    console.log(`Processing data as ${type} format`);
    
    // First validate the data format
    const validationError = validateData(data, type);
    if (validationError) {
      setErrorMessage(validationError);
      setSubmitting(false);
      return;
    }    try {
      // Log detailed information about the submission
      console.log(`Submitting data with format type: ${type}`);
      console.log('Data sample (first 100 chars):', data.substring(0, 100));
      
      // Submit the data with the selected type
      const result = await submitProcessorData(type, data);
      
      // Show success message with format type
      setSuccessMessage(`Transaction data submitted successfully as ${type}!`);
      setData(''); // Clear the text area after successful submission
      
      console.log('Submission result:', result);    } catch (err: any) {
      console.error('Error submitting data:', err);
      setErrorMessage(err.message || `Failed to submit transaction data as ${type}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Process Transactions</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>          <div className="mb-4">
            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-700">
              Data Format
            </label>              <select
              id="type"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={type}
              onChange={(e) => {
                const newType = e.target.value;
                console.log(`Format changed to: ${newType}`);
                setType(newType);
              }}
              required
              data-testid="data-format-select"
            >              <option value="JSON">JSON</option>
              <option value="XML">XML</option>
              <option value="CSV">CSV</option>
            </select>
          </div>            <div className="mb-6">
            <label htmlFor="data" className="block mb-2 text-sm font-medium text-gray-700">
              Transaction Data
            </label>
            <textarea
              id="data"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={data}
              onChange={(e) => setData(e.target.value)}
              rows={10}
              required
              placeholder={`Enter ${type} data here...`}
              data-testid="transaction-data-input"
            ></textarea>
          </div>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}
            {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-start">
              <svg 
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" 
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
              <div>
                <p className="font-medium">Error:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
            <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={submitting}
          >
            {submitting ? `Submitting ${type} data...` : `Submit ${type} Data`}
          </button>
        </form>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-medium mb-4">Format Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* JSON Example */}
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">JSON Example</h3>
              <pre className="text-xs overflow-x-auto">
{`[
  {
    "cardNumber": "3336208249795480",
    "timestamp": "2025-03-06T05:11:08.759901",
    "amount": -362.26
  }
]`}
              </pre>
            </div>
            
            {/* XML Example */}
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">XML Example</h3>
              <pre className="text-xs overflow-x-auto">
{`<transactions>
  <transaction>
    <cardNumber>3336208249795480</cardNumber>
    <timestamp>2025-03-06T05:11:08.759901</timestamp>
    <amount>-362.26</amount>
  </transaction>
</transactions>`}
              </pre>
            </div>
            
            {/* CSV Example */}
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">CSV Example</h3>
              <pre className="text-xs overflow-x-auto">
{`cardNumber,timestamp,amount
3336208249795480,2025-03-06T05:11:08.759901,-362.26`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
