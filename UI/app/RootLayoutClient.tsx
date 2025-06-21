'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';

interface RootLayoutClientProps {
  children: React.ReactNode;
  inter: any;
}

export default function RootLayoutClient({ children, inter }: RootLayoutClientProps) {
  const [transactionsOpen, setTransactionsOpen] = useState(true);
  const [reportingOpen, setReportingOpen] = useState(true);
  const pathname = usePathname();

  // Set the initial state of menu based on current path
  useEffect(() => {
    if (pathname?.startsWith('/processor')) {
      setTransactionsOpen(true);
    }
    if (pathname?.startsWith('/reporting')) {
      setReportingOpen(true);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className={inter.className + " flex flex-col min-h-screen"}>
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center">
            <svg 
              className="w-8 h-8 mr-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h1 className="text-2xl font-bold">SignaPay Processor</h1>
          </div>
        </header>
        <div className="flex flex-1">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-gray-100 border-r shadow-inner">
            <nav className="p-4">
              {/* Transactions Section */}
              <div className="mb-4">
                <button 
                  onClick={() => setTransactionsOpen(!transactionsOpen)}
                  className="flex items-center justify-between w-full p-3 bg-gray-200 rounded text-left font-medium hover:bg-gray-300 transition-colors"
                >
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Transactions</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${transactionsOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {transactionsOpen && (
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>
                      <Link 
                        href="/processor/view-transactions"
                        className={`flex items-center p-3 rounded transition-colors ${
                          pathname === '/processor/view-transactions'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        View Transactions
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/processor/process-transactions"
                        className={`flex items-center p-3 rounded transition-colors ${
                          pathname === '/processor/process-transactions'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Process Transactions
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              
              {/* Reporting Section */}
              <div className="mb-4">
                <button 
                  onClick={() => setReportingOpen(!reportingOpen)}
                  className="flex items-center justify-between w-full p-3 bg-gray-200 rounded text-left font-medium hover:bg-gray-300 transition-colors"
                >
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Reporting</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${reportingOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {reportingOpen && (
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>
                      <Link 
                        href="/reporting/transactions-by-card"
                        className={`flex items-center p-3 rounded transition-colors ${
                          pathname === '/reporting/transactions-by-card'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Transactions By Card
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/reporting/transactions-by-card-type"
                        className={`flex items-center p-3 rounded transition-colors ${
                          pathname === '/reporting/transactions-by-card-type'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                        By Card Type
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/reporting/transactions-per-day"
                        className={`flex items-center p-3 rounded transition-colors ${
                          pathname === '/reporting/transactions-per-day'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Per Day
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/reporting/rejected-transactions"
                        className={`flex items-center p-3 rounded transition-colors ${
                          pathname === '/reporting/rejected-transactions'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        <svg 
                          className="w-4 h-4 mr-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Rejected Transactions
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
        
        <footer className="bg-gray-200 p-4 border-t">
          <div className="container mx-auto text-center text-gray-600">
            &copy; {new Date().getFullYear()} SignaPay Processor
          </div>
        </footer>
      </body>
    </html>
  );
}
