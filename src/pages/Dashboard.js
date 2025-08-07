import React from 'react';
import SummaryCard from '../components/results/SummaryCard';
import LoanPieChart from '../components/charts/LoanPieChart';
import LoanBalanceChart from '../components/charts/LoanBalanceChart';

const Dashboard = ({ 
  loanAmount, 
  annualInterestRate, 
  numMonths, 
  monthlyPayment, 
  totalAmount,
  totalInterest,
  amortizationSchedule 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats - Row of small cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-500 mb-1">Loan Amount</div>
          <div className="text-xl font-semibold">${loanAmount ? parseFloat(loanAmount).toLocaleString() : '0'}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
          <div className="text-xl font-semibold">${monthlyPayment ? parseFloat(monthlyPayment).toLocaleString() : '0'}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-500 mb-1">Total Interest</div>
          <div className="text-xl font-semibold">${totalInterest ? parseFloat(totalInterest).toLocaleString() : '0'}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-500">
          <div className="text-sm text-gray-500 mb-1">Term</div>
          <div className="text-xl font-semibold">
            {numMonths ? `${Math.floor(numMonths / 12)} years` : '0 years'}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div>
        <SummaryCard
          loanAmount={loanAmount}
          annualInterestRate={annualInterestRate}
          numMonths={numMonths}
          monthlyPayment={monthlyPayment}
          totalAmount={totalAmount}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <LoanPieChart 
            loanAmount={loanAmount} 
            totalInterest={totalInterest}
          />
        </div>
        <div>
          <LoanBalanceChart 
            amortizationSchedule={amortizationSchedule}
          />
        </div>
      </div>

      {/* Additional Analytics Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-primary mb-4">Loan Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Interest to Principal Ratio</h3>
            <div className="text-2xl font-bold mt-1">
              {totalInterest && loanAmount ? 
                `${((parseFloat(totalInterest) / parseFloat(loanAmount)) * 100).toFixed(1)}%` : 
                '0%'
              }
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {totalInterest && loanAmount && parseFloat(totalInterest) > parseFloat(loanAmount) / 2 ? 
                'Consider increasing your down payment or finding a better interest rate.' : 
                'Your interest to principal ratio looks good.'
              }
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Monthly Payment to Income Ratio</h3>
            <div className="flex mt-2 items-center">
              <div className="relative w-full">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="absolute h-2 bg-green-500 rounded-full"
                    style={{ width: '25%' }} 
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25% (Good)</span>
                  <span>40% (High)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
