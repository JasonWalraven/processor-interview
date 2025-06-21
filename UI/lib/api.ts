import axios from 'axios';
import { CardReport, CardTypeReport, DailyReport, Transaction } from './types';

// Use environment variable with fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7039';
const ITEMS_PER_PAGE = 25;
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODUxNDA5ODQsImlhdCI6MTQ4NTEzNzM4NCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiIyOWFjMGMxOC0wYjRhLTQyY2YtODJmYy0wM2Q1NzAzMThhMWQiLCJhcHBsaWNhdGlvbklkIjoiNzkxMDM3MzQtOTdhYi00ZDFhLWFmMzctZTAwNmQwNWQyOTUyIiwicm9sZXMiOltdfQ.Mp0Pcwsz5VECK11Kf2ZZNF_SMKu5CgBeLN9ZOP04kZo';

export async function fetchProcessorCount(cardNumber?: string, status?: string): Promise<number> {
  try {    
    const response = await fetch(`${BASE_URL}/ProcessorCount?cardNumber=${cardNumber}&status=${status}`, {
      headers: {
        'Authorization': `Bearer ${getBearerToken()}`
      }
    });
    const count = await response.json();

    const  totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE); 

    return totalPages;

  } catch (error) {
    console.error('Error fetching processor count:', error);
    return 0;
  }
}

export async function fetchProcessorData(pageNum: number, cardNumber?: string, status?: string): Promise<Transaction[]> {
  try {
    console.log(`Calling API: ${BASE_URL}/Processor?pageNumber=${pageNum}&cardNumber=${cardNumber || ''}&status=${status || ''}`);
    const response = await fetch(`${BASE_URL}/Processor?pageNumber=${pageNum}&cardNumber=${cardNumber || ''}&status=${status || ''}`, {
      headers: {
        'Authorization': `Bearer ${getBearerToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const transactions = await response.json();
    console.log('Raw transaction data:', transactions);
    
    // Ensure we have a valid array
    if (!Array.isArray(transactions)) {
      console.error('API did not return an array:', transactions);
      return [];
    }
    
    // Map and validate the data
    const validatedTransactions = transactions.map(item => ({
      id: Number(item.id || 0),
      cardNumber: String(item.cardNumber || ''),
      cardType: String(item.cardType || ''),
      amount: Number(item.amount || 0),
      transactionTimeStamp: String(item.transactionTimeStamp || ''),
      transactionStatus: Number(item.transactionStatus || 0),
      transactionProcessedTimeStamp: String(item.transactionProcessedTimeStamp || '')
    }));
    
    return validatedTransactions;
  } catch (error) {
    console.error('Error fetching processor data:', error);
    return [];
  }
}

export async function fetchRejectedTransactionsCount(): Promise<number> {
  try {
    console.log(`Calling API for rejected count: ${BASE_URL}/ProcessorCount?status=Rejected`);
    const response = await fetch(`${BASE_URL}/ProcessorCount?status=Rejected`, {
      headers: {
        'Authorization': `Bearer ${getBearerToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const count = await response.json();
    console.log('Rejected transactions count:', count);
    
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE); 
    console.log(`Total pages for rejected transactions: ${totalPages}`);
    
    return totalPages;
  } catch (error) {
    console.error('Error fetching rejected transactions count:', error);
    return 0;
  }
}

export async function fetchReportingByCard(): Promise<CardReport[]> {
  try {
    console.log(`Calling API: ${BASE_URL}/ReportingByCard`);
    const response = await fetch(`${BASE_URL}/ReportingByCard`, {
      headers: {
        'Authorization': `Bearer ${getBearerToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const results = await response.json();
    console.log('Raw API response:', results);
    
    // Ensure we have a valid array
    if (!Array.isArray(results)) {
      console.error('API did not return an array:', results);
      return [];
    }
    
    // Map and validate the data structure
    const cardReports = results.map(item => ({
      cardNumber: String(item.cardNumber || ''),
      transactionCount: Number(item.transactionCount || 0),
      totalAmount: Number(item.totalAmount || 0)
    }));
    
    return cardReports;
  } catch (error) {
    console.error('Error fetching reporting by card:', error);
    return [];
  }
}

export async function fetchReportingByCardType(): Promise<CardTypeReport[]> {
  try {
    console.log(`Calling API: ${BASE_URL}/ReportingByCardType`);
    const response = await fetch(`${BASE_URL}/ReportingByCardType`, {
      headers: {
        'Authorization': `Bearer ${getBearerToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const results = await response.json();
    console.log('Raw API response:', results);
    
    // Ensure we have a valid array
    if (!Array.isArray(results)) {
      console.error('API did not return an array:', results);
      return [];
    }
    
    // Map and validate the data
    const cardTypeReports = results.map(item => ({
      cardType: String(item.cardType || ''),
      transactionCount: Number(item.transactionCount || 0),
      totalAmount: Number(item.totalAmount || 0)
    }));
    
    return cardTypeReports;
  } catch (error) {
    console.error('Error fetching reporting by card type:', error);
    return [];
  }
}

export async function fetchReportingByDay(): Promise<DailyReport[]> {
  try {
    console.log(`Calling API: ${BASE_URL}/ReportingByDay`);
    const response = await fetch(`${BASE_URL}/ReportingByDay`, {
      headers: {
        'Authorization': `Bearer ${getBearerToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const results = await response.json();
    console.log('Raw API response:', results);
    
    // Ensure we have a valid array
    if (!Array.isArray(results)) {
      console.error('API did not return an array:', results);
      return [];
    }
    
    // Map and validate the data
    const dailyReports = results.map(item => ({
      transactionDate: String(item.transactionDate || ''),
      transactionCount: Number(item.transactionCount || 0),
      totalAmount: Number(item.totalAmount || 0)
    }));
    
    return dailyReports;
  } catch (error) {
    console.error('Error fetching reporting by day:', error);
    return [];
  }
}

export async function submitProcessorData(type: string, data: string): Promise<any> {
  try {
    // Always use uppercase for format type as expected by API
    const dataType = type.toUpperCase();    
    console.log(`Submitting ${dataType} data to ${BASE_URL}/Processor`);
    console.log(`Input format type: ${type}, normalized to: ${dataType}`);

    // Important: The API expects "type" as the property name, not "dataType"
    const bulkTransaction = {
        type: dataType,
        data: data
    };
    
    console.log('Request payload structure:', { 
      type: bulkTransaction.type, 
      dataLength: bulkTransaction.data.length,
      dataSample: bulkTransaction.data.substring(0, 50) + '...'
    });    const response = await fetch(`${BASE_URL}/Processor/bulk`, 
        { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify(bulkTransaction)
        });
    
    console.log('API response status:', response.status);
        
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText || response.statusText}`);
    }
    
    const result = await response.json().catch(() => ({ message: 'Data submitted successfully' }));
    console.log('API Response:', result);
    return result;

  } catch (error) {
    console.error('Error submitting processor data:', error);    throw error;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function mapTransactionStatus(status: number): string {
  switch (status) {
    case 1:
      return 'Accepted';
    case 2:
      return 'Rejected';
    default:
      return 'Unknown';
  }
}

export function getBearerToken(): string {
  // Return the cached token or get a new one if expired or missing, based on credentials.  
  // This will need to be changed with real authentication logic.
  return BEARER_TOKEN;
}
