import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  ChartBarIcon,
  CloudIcon,
  CloudArrowDownIcon
} from '@heroicons/react/24/outline';
import { saveLoan, getAllLoans, deleteLoan, clearLoans, requestBackgroundSync } from '../../utils/indexedDB';

const LoanComparison = ({
  loanType,
  loanAmount,
  numMonths,
  annualInterestRate,
  monthlyPayment,
  totalAmount,
  startDate
}) => {
  const [savedLoans, setSavedLoans] = useState([]);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Check online status on mount and add event listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load saved loans from IndexedDB
    loadSavedLoans();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load saved loans from IndexedDB
  const loadSavedLoans = async () => {
    try {
      const loans = await getAllLoans();
      setSavedLoans(loans);
    } catch (error) {
      console.error('Error loading saved loans:', error);
    }
  };
  
  // Generate a unique ID for each loan
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  // Save current loan to comparison
  const addLoan = async () => {
    if (!loanAmount || !numMonths || !annualInterestRate || !monthlyPayment) {
      alert('Please calculate a loan before adding it to comparison');
      return;
    }
    
    const newLoan = {
      id: generateId(),
      name: `${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan`,
      loanType,
      loanAmount: parseFloat(loanAmount),
      numMonths: parseInt(numMonths),
      annualInterestRate: parseFloat(annualInterestRate),
      monthlyPayment: parseFloat(monthlyPayment),
      totalAmount: parseFloat(totalAmount),
      totalInterest: parseFloat(totalAmount) - parseFloat(loanAmount),
      startDate: new Date(startDate),
      savedAt: new Date()
    };
    
    try {
      // Save to IndexedDB
      await saveLoan(newLoan);
      
      // Update state
      setSavedLoans(prev => [...prev, newLoan]);
      
      // Request background sync if online
      if (navigator.onLine) {
        requestBackgroundSync();
      }
    } catch (error) {
      console.error('Error saving loan:', error);
      alert('Failed to save loan. Please try again.');
    }
  };
  
  // Remove a loan from comparison
  const removeLoanItem = async (id) => {
    try {
      // Delete from IndexedDB
      await deleteLoan(id);
      
      // Update state
      setSavedLoans(prev => prev.filter(loan => loan.id !== id));
      
      // Request background sync if online
      if (navigator.onLine) {
        requestBackgroundSync();
      }
    } catch (error) {
      console.error('Error removing loan:', error);
      alert('Failed to remove loan. Please try again.');
    }
  };
  
  // Clear all saved loans
  const clearAllLoans = async () => {
    if (window.confirm('Are you sure you want to clear all saved loans?')) {
      try {
        // Clear from IndexedDB
        await clearLoans();
        
        // Update state
        setSavedLoans([]);

        
        // Request background sync if online
        if (navigator.onLine) {
          requestBackgroundSync();
        }
      } catch (error) {
        console.error('Error clearing loans:', error);
        alert('Failed to clear loans. Please try again.');
      }
    }
  };
  
  // Sync loans with server (simulated)
  const syncLoans = () => {
    setIsSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      alert('Loans synced successfully!');
    }, 1500);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Get best loan based on total interest
  const getBestLoan = () => {
    if (savedLoans.length < 2) return null;
    
    return savedLoans.reduce((best, current) => {
      return current.totalInterest < best.totalInterest ? current : best;
    }, savedLoans[0]);
  };
  
  // Calculate monthly savings compared to the worst option
  const calculateMonthlySavings = (bestLoan) => {
    if (savedLoans.length < 2) return 0;
    
    const worstLoan = savedLoans.reduce((worst, current) => {
      return current.monthlyPayment > worst.monthlyPayment ? current : worst;
    }, savedLoans[0]);
    
    return worstLoan.monthlyPayment - bestLoan.monthlyPayment;
  };
  
  // Calculate lifetime savings compared to the worst option
  const calculateLifetimeSavings = (bestLoan) => {
    if (savedLoans.length < 2) return 0;
    
    const worstLoan = savedLoans.reduce((worst, current) => {
      return current.totalAmount > worst.totalAmount ? current : worst;
    }, savedLoans[0]);
    
    return worstLoan.totalAmount - bestLoan.totalAmount;
  };
  
  // Determine the best loan
  const bestLoan = getBestLoan();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-primary flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Loan Comparison
          </h2>
          {isOffline && (
            <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              <CloudIcon className="h-3 w-3 mr-1" />
              Offline
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={addLoan}
            className="flex items-center px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Current
          </button>
          {navigator.onLine && (
            <button
              onClick={syncLoans}
              disabled={isSyncing || savedLoans.length === 0}
              className="flex items-center px-3 py-1.5 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <CloudArrowDownIcon className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
          )}
          <button
            onClick={clearAllLoans}
            disabled={savedLoans.length === 0}
            className="flex items-center px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Clear All
          </button>
        </div>
      </div>
      
      {savedLoans.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center text-blue-700">
          <p>Add loans to compare different options.</p>
          <p className="text-sm mt-1">Calculate a loan and click "Add Current" to start comparing.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedLoans.map((loan) => (
                  <tr 
                    key={loan.id} 
                    className={`${loan.id === bestLoan?.id ? 'bg-green-50' : ''} hover:bg-gray-50`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {loan.id === bestLoan?.id && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1.5">
                          Best
                        </span>
                      )}
                      {loan.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{loan.loanType}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(loan.loanAmount)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {Math.floor(loan.numMonths / 12) > 0 ? `${Math.floor(loan.numMonths / 12)}y ` : ''}
                      {loan.numMonths % 12 > 0 ? `${loan.numMonths % 12}m` : ''}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{loan.annualInterestRate}%</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(loan.monthlyPayment)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(loan.totalAmount)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(loan.totalInterest)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeLoanItem(loan.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {bestLoan && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Savings Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Monthly Savings</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(calculateMonthlySavings(bestLoan))}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">Lifetime Savings</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(calculateLifetimeSavings(bestLoan))}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Savings calculated by comparing the best option against the most expensive option.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoanComparison;
