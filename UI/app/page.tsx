'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-4">Welcome to SignaPay Processor</h1>
      <p className="text-xl mb-8 text-gray-600">Select an option from the menu or cards below to get started</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        <Link href="/processor/view-transactions" className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-blue-600 transition-colors">View Transactions</h2>
          </div>
          <p className="text-gray-600">Browse and filter transaction records with advanced filtering</p>
        </Link>
        
        <Link href="/processor/process-transactions" className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-green-600 transition-colors">Process Transactions</h2>
          </div>
          <p className="text-gray-600">Upload and process new transactions via JSON, XML, or CSV formats</p>
        </Link>
        
        <Link href="/reporting/transactions-by-card" className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-purple-600 transition-colors">By Card</h2>
          </div>
          <p className="text-gray-600">View transaction totals summarized by individual card numbers</p>
        </Link>
        
        <Link href="/reporting/transactions-by-card-type" className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-indigo-600 transition-colors">By Card Type</h2>
          </div>
          <p className="text-gray-600">View transaction totals summarized by card types (Visa, Mastercard, etc.)</p>
        </Link>
        
        <Link href="/reporting/transactions-per-day" className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-amber-600 transition-colors">Per Day</h2>
          </div>
          <p className="text-gray-600">View transaction totals grouped by transaction date</p>
        </Link>
        
        <Link href="/reporting/rejected-transactions" className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-red-600 transition-colors">Rejected Transactions</h2>
          </div>
          <p className="text-gray-600">View all rejected transaction records for troubleshooting</p>
        </Link>
      </div>
    </div>
  );
}
