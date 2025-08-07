import React, { useState } from 'react';
import { 
  ArrowTrendingDownIcon, 
  CalendarIcon, 
  BanknotesIcon, 
  CurrencyDollarIcon,
  ChartPieIcon,
  ClockIcon,
  DocumentIcon,
  CalculatorIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const LoanInputForm = ({ 
  loanAmount, 
  setLoanAmount, 
  numMonths, 
  setNumMonths, 
  annualInterestRate, 
  setAnnualInterestRate, 
  monthlyPayment,
  handleMonthlyPayment, 
  extraPrincipal, 
  setExtraPrincipal, 
  paymentFrequencyPreference,
  setPaymentFrequencyPreference,
  clearAllFields,
  generateAmortizationSchedule,
  generateExtraAmortizationSchedule
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formErrors, setFormErrors] = useState({
    loanAmount: '',
    numMonths: '',
    annualInterestRate: ''
  });
  const frequencyOptions = ['monthly', 'quarterly', 'semi-annually', 'annually'];
  
  // Common term presets
  const termPresets = [
    { label: '1 Year', months: 12 },
    { label: '3 Years', months: 36 },
    { label: '5 Years', months: 60 },
    { label: '10 Years', months: 120 },
    { label: '15 Years', months: 180 },
    { label: '20 Years', months: 240 },
    { label: '25 Years', months: 300 },
    { label: '30 Years', months: 360 }
  ];
  
  // Validation functions
  const validateLoanAmount = (value) => {
    const amount = parseFloat(value);
    if (!value) return "Loan amount is required";
    if (isNaN(amount) || amount <= 0) return "Please enter a valid positive number";
    if (amount > 100000000) return "Loan amount is too large";
    return "";
  };
  
  const validateNumMonths = (value) => {
    const months = parseInt(value);
    if (!value) return "Loan term is required";
    if (isNaN(months) || months <= 0) return "Please enter a valid number of months";
    if (months > 600) return "Loan term cannot exceed 50 years (600 months)";
    return "";
  };
  
  const validateInterestRate = (value) => {
    const rate = parseFloat(value);
    if (!value) return "Interest rate is required";
    if (isNaN(rate) || rate < 0) return "Please enter a valid interest rate";
    if (rate > 100) return "Interest rate cannot exceed 100%";
    return "";
  };
  
  // Handle input changes with validation
  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    setLoanAmount(value);
    setFormErrors(prev => ({...prev, loanAmount: validateLoanAmount(value)}));
  };
  
  const handleNumMonthsChange = (e) => {
    const value = e.target.value;
    setNumMonths(value);
    setFormErrors(prev => ({...prev, numMonths: validateNumMonths(value)}));
  };
  
  const handleInterestRateChange = (e) => {
    const value = e.target.value;
    setAnnualInterestRate(value);
    setFormErrors(prev => ({...prev, annualInterestRate: validateInterestRate(value)}));
  };
  
  // Validation before calculation
  const validateAndCalculate = () => {
    const loanAmountError = validateLoanAmount(loanAmount);
    const numMonthsError = validateNumMonths(numMonths);
    const interestRateError = validateInterestRate(annualInterestRate);
    
    setFormErrors({
      loanAmount: loanAmountError,
      numMonths: numMonthsError,
      annualInterestRate: interestRateError
    });
    
    if (!loanAmountError && !numMonthsError && !interestRateError) {
      handleMonthlyPayment();
      
      // Also generate the amortization schedule automatically when calculating
      setTimeout(() => {
        generateAmortizationSchedule();
      }, 100);
    }
  };
  
  // Helper function to determine if form has errors
  const hasErrors = () => {
    return Object.values(formErrors).some(error => error !== "");
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'basic' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'advanced' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Options
        </button>
      </div>
      
      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="card shadow-lg border border-gray-100 transition-all hover:shadow-xl">
          <h2 className="text-xl font-bold text-primary flex items-center mb-4">
            <BanknotesIcon className="h-6 w-6 mr-2 text-primary" />
            Loan Details
          </h2>
          
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="loanAmount">
                Loan Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="loanAmount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  className={`pl-7 input-field focus:ring-primary block w-full ${formErrors.loanAmount ? 'border-red-500' : 'border-gray-300 focus:border-primary'}`}
                />
              </div>
              {formErrors.loanAmount && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {formErrors.loanAmount}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {[100000, 250000, 500000, 750000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setLoanAmount(amount);
                      setFormErrors(prev => ({...prev, loanAmount: ""}));
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="numMonths">
                Loan Term
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="numMonths"
                    type="number"
                    placeholder="Months"
                    value={numMonths}
                    onChange={handleNumMonthsChange}
                    className={`pl-10 input-field focus:ring-primary block w-full ${formErrors.numMonths ? 'border-red-500' : 'border-gray-300 focus:border-primary'}`}
                  />
                </div>
                <select 
                  className="input-field focus:ring-primary focus:border-primary"
                  onChange={(e) => {
                    setNumMonths(e.target.value);
                    setFormErrors(prev => ({...prev, numMonths: ""}));
                  }}
                  value=""
                >
                  <option value="" disabled>Common terms</option>
                  {termPresets.map(term => (
                    <option key={term.months} value={term.months}>
                      {term.label} ({term.months} months)
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.numMonths && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {formErrors.numMonths}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="interestRate">
                Annual Interest Rate
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter interest rate"
                  value={annualInterestRate}
                  onChange={handleInterestRateChange}
                  className={`input-field focus:ring-primary pr-12 block w-full ${formErrors.annualInterestRate ? 'border-red-500' : 'border-gray-300 focus:border-primary'}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">% APR</span>
                </div>
              </div>
              {formErrors.annualInterestRate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {formErrors.annualInterestRate}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {[3.5, 4.0, 4.5, 5.0, 5.5].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setAnnualInterestRate(rate);
                      setFormErrors(prev => ({...prev, annualInterestRate: ""}));
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="monthlyPayment">
                Monthly Payment
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="monthlyPayment"
                  type="text"
                  placeholder="Monthly payment"
                  value={monthlyPayment}
                  readOnly
                  className="pl-7 input-field bg-gray-50 focus:ring-primary focus:border-primary block w-full"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={validateAndCalculate} 
                className="btn-primary flex-1 flex items-center justify-center py-2.5"
                disabled={hasErrors()}
              >
                <CalculatorIcon className="h-5 w-5 mr-2" />
                Calculate Payment
              </button>
              <button 
                onClick={clearAllFields} 
                className="btn-danger flex items-center justify-center py-2.5"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Advanced Options Tab */}
      {activeTab === 'advanced' && (
        <div className="card shadow-lg border border-gray-100 transition-all hover:shadow-xl">
          <h2 className="text-xl font-bold text-primary flex items-center mb-4">
            <ChartPieIcon className="h-6 w-6 mr-2 text-primary" />
            Advanced Options
          </h2>
          
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="extraPrincipal">
                Extra Principal Payment
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="extraPrincipal"
                  type="number"
                  placeholder="Extra payment amount"
                  value={extraPrincipal}
                  onChange={(e) => setExtraPrincipal(e.target.value)}
                  className="pl-7 input-field focus:ring-primary focus:border-primary block w-full"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Extra payments help reduce your loan term and save on interest
              </p>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="paymentFrequency">
                Payment Frequency
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  id="paymentFrequency"
                  value={paymentFrequencyPreference}
                  onChange={(e) => setPaymentFrequencyPreference(e.target.value)}
                  className="pl-10 input-field focus:ring-primary focus:border-primary block w-full"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button 
                onClick={generateAmortizationSchedule} 
                className="btn-primary flex items-center justify-center py-2.5"
              >
                <DocumentIcon className="h-5 w-5 mr-2" />
                View Regular Schedule
              </button>
              <button 
                onClick={generateExtraAmortizationSchedule} 
                className="btn-success flex items-center justify-center py-2.5"
              >
                <ArrowTrendingDownIcon className="h-5 w-5 mr-2" />
                View With Extra Payments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanInputForm;