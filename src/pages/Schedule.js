import React, { useState } from 'react';
import AmortizationTable from '../components/tables/AmortizationTable';
import LoanBalanceChart from '../components/charts/LoanBalanceChart';
import { ChartPieIcon, ListBulletIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import AmortizationSchedule from '../AmortizationSchedule';

const Schedule = ({
  loanAmount,
  annualInterestRate,
  numMonths,
  monthlyPayment,
  totalAmount,
  amortizationSchedule,
  extraAmortizationSchedule
}) => {
  const [viewMode, setViewMode] = useState('table');
  const [selectedSchedule, setSelectedSchedule] = useState('regular');

  const currentSchedule = selectedSchedule === 'regular' 
    ? amortizationSchedule 
    : extraAmortizationSchedule;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Amortization Schedule</h1>
        
        {/* View type toggle */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md flex items-center ${viewMode === 'table' ? 
              'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <TableCellsIcon className="h-4 w-4 mr-2" />
            Table
          </button>
          <button 
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1.5 rounded-md flex items-center ${viewMode === 'visual' ? 
              'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <ChartPieIcon className="h-4 w-4 mr-2" />
            Visual
          </button>
        </div>
      </div>

      {/* Schedule type selector */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Schedule Options</h2>
            <p className="text-sm text-gray-500">Select the type of schedule to view</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedSchedule('regular')}
              className={`px-4 py-2 rounded-md ${selectedSchedule === 'regular' ? 
                'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              disabled={!amortizationSchedule || amortizationSchedule.length === 0}
            >
              Regular Schedule
            </button>
            <button
              onClick={() => setSelectedSchedule('extra')}
              className={`px-4 py-2 rounded-md ${selectedSchedule === 'extra' ? 
                'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              disabled={!extraAmortizationSchedule || extraAmortizationSchedule.length === 0}
            >
              With Extra Payments
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Display */}
      {!currentSchedule || currentSchedule.length === 0 ? (
        <div className="bg-white rounded-lg p-12 shadow-md text-center">
          <ListBulletIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Schedule Available</h2>
          <p className="text-gray-500 mb-6">Please calculate a loan first to view the amortization schedule.</p>
          <button
            onClick={() => window.location.href = '/calculator'}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go to Calculator
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-primary">
              {selectedSchedule === 'regular' ? 'Regular Amortization Schedule' : 'Schedule with Extra Payments'}
            </h2>
            <div>
              {/* PDF Download Button - Add proper styling and error handling */}
              <div className="ml-2">
                <AmortizationSchedule
                  loanAmount={loanAmount}
                  annualInterestRate={annualInterestRate}
                  numMonths={numMonths}
                  monthlyPayment={monthlyPayment}
                  totalAmount={totalAmount}
                  amortizationSchedule={currentSchedule}
                />
              </div>
            </div>
          </div>
          <AmortizationTable 
            schedule={currentSchedule}
            title=""
            isExtra={selectedSchedule === 'extra'}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-primary mb-4">
            {selectedSchedule === 'regular' ? 'Regular Schedule Visualization' : 'Extra Payments Visualization'}
          </h2>
          <div className="h-[500px]">
            <LoanBalanceChart amortizationSchedule={currentSchedule} />
          </div>
        </div>
      )}

      {/* Schedule Summary */}
      {currentSchedule && currentSchedule.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Payments</h3>
            <p className="text-2xl font-semibold text-primary">{currentSchedule.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.floor(currentSchedule.length / 12)} years, {currentSchedule.length % 12} months
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Interest Paid</h3>
            <p className="text-2xl font-semibold text-red-500">
              ${currentSchedule.reduce((total, item) => total + parseFloat(item.interestPaid), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Payment Date</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {currentSchedule[currentSchedule.length - 1].month} {Math.floor((currentSchedule[currentSchedule.length - 1].count) / 12) + new Date().getFullYear()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
