import React from 'react';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  CalculatorIcon,
  HomeIcon,
  TruckIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const SummaryCard = ({ 
  loanType,
  loanAmount, 
  annualInterestRate, 
  numMonths, 
  monthlyPayment, 
  totalAmount,
  downPayment,
  tradeInValue,
  propertyTax,
  homeInsurance,
  deviceModel
}) => {
  // Calculate total interest
  const totalInterest = totalAmount - loanAmount;
  
  // Get loan type icon and label
  const getLoanTypeInfo = () => {
    switch(loanType) {
      case "car":
        return { icon: TruckIcon, label: "Car Loan" };
      case "mobile":
        return { icon: DevicePhoneMobileIcon, label: "Mobile Phone Loan" };
      case "house":
        return { icon: HomeIcon, label: "Home Loan" };
      default:
        return { icon: BuildingLibraryIcon, label: "Mortgage Loan" };
    }
  };
  
  const { icon: LoanTypeIcon, label: loanTypeLabel } = getLoanTypeInfo();
  
  return (
    <div className="card bg-gradient-to-br from-white to-blue-50 shadow-lg border border-gray-100 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center">
          <LoanTypeIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
          {loanTypeLabel}
        </h2>
        <div className="bg-primary text-white rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium">
          {annualInterestRate ? `${annualInterestRate}% APR` : 'Enter details'}
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Monthly Payment and Loan Term - Mobile: Stack, Desktop: Side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-10 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
              <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Monthly Payment</p>
              <p className="text-lg sm:text-xl font-bold text-primary">${monthlyPayment || '0.00'}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-accent bg-opacity-10 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
              <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Loan Term</p>
              <p className="text-base sm:text-lg font-semibold">
                {Math.floor(numMonths / 12) > 0 ? `${Math.floor(numMonths / 12)} years` : ''} 
                {numMonths % 12 > 0 ? ` ${numMonths % 12} months` : numMonths ? '' : 'Not set'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Total Interest and Principal - Mobile: Stack, Desktop: Side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="bg-error bg-opacity-10 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
              <CalculatorIcon className="h-5 w-5 sm:h-6 sm:w-6 text-error" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Interest</p>
              <p className="text-base sm:text-lg font-semibold text-error">
                ${totalInterest > 0 ? totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-10 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
              <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Principal</p>
              <p className="text-base sm:text-lg font-semibold">${loanAmount || '0.00'}</p>
            </div>
          </div>
        </div>
        
        {/* Loan-specific information */}
        {(loanType === "car" || loanType === "house") && downPayment && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Down Payment</p>
              <p className="text-sm font-semibold">${downPayment}</p>
            </div>
          </div>
        )}
        
        {loanType === "car" && tradeInValue && (
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Trade-in Value</p>
              <p className="text-sm font-semibold">${tradeInValue}</p>
            </div>
          </div>
        )}
        
        {loanType === "house" && (
          <div className="border-t border-gray-200 pt-3 space-y-2">
            {propertyTax && (
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Property Tax</p>
                <p className="text-sm font-semibold">{propertyTax}%</p>
              </div>
            )}
            {homeInsurance && (
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Monthly Insurance</p>
                <p className="text-sm font-semibold">${homeInsurance}</p>
              </div>
            )}
          </div>
        )}
        
        {loanType === "mobile" && deviceModel && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Device Model</p>
              <p className="text-sm font-semibold">{deviceModel}</p>
            </div>
          </div>
        )}

        {/* Total Cost - Full width */}
        <div className="mt-4 sm:mt-6 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Total Cost</p>
              <p className="text-xl sm:text-2xl font-bold">${totalAmount > 0 ? Number(totalAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;