import React from 'react';
import { CurrencyDollarIcon, ClockIcon, CalculatorIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const SummaryCard = ({ loanAmount, annualInterestRate, numMonths, monthlyPayment, totalAmount }) => {
  // Calculate total interest
  const totalInterest = totalAmount - loanAmount;
  
  return (
    <div className="card bg-gradient-to-br from-white to-blue-50 shadow-lg border border-gray-100 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-primary flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2" />
          Loan Summary
        </h2>
        <div className="bg-primary text-white rounded-full px-3 py-1 text-xs font-medium">
          {annualInterestRate ? `${annualInterestRate}% APR` : 'Enter details'}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
            <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
              <CurrencyDollarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Monthly Payment</p>
              <p className="text-xl font-bold text-primary">${monthlyPayment || '0.00'}</p>
            </div>
          </div>
          <div className="bg-gray-100 h-12 w-px hidden md:block"></div>
          <div className="flex items-center w-full md:w-auto">
            <div className="bg-accent bg-opacity-10 p-2 rounded-full mr-3">
              <ClockIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Loan Term</p>
              <p className="text-lg font-semibold">
                {Math.floor(numMonths / 12) > 0 ? `${Math.floor(numMonths / 12)} years` : ''} 
                {numMonths % 12 > 0 ? ` ${numMonths % 12} months` : numMonths ? '' : 'Not set'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
          <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
            <div className="bg-error bg-opacity-10 p-2 rounded-full mr-3">
              <CalculatorIcon className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Interest</p>
              <p className="text-lg font-semibold text-error">
                ${totalInterest > 0 ? totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 h-12 w-px hidden md:block"></div>
          <div className="flex items-center w-full md:w-auto">
            <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
              <CurrencyDollarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Principal</p>
              <p className="text-lg font-semibold">${loanAmount || '0.00'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Total Cost</p>
              <p className="text-2xl font-bold">${totalAmount > 0 ? Number(totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;