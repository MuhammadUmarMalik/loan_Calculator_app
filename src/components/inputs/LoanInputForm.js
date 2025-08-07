import React, { useState, useEffect, useCallback } from 'react';
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
  const [touchedFields, setTouchedFields] = useState({
    loanAmount: false,
    numMonths: false,
    annualInterestRate: false
  });
  const frequencyOptions = ['monthly', 'quarterly', 'semi-annually', 'annually'];
  
  // Debounced validation
  const debouncedValidate = useCallback((field, value) => {
    let validationFunction;
    
    switch (field) {
      case 'loanAmount':
        validationFunction = validateLoanAmount;
        break;
      case 'numMonths':
        validationFunction = validateNumMonths;
        break;
      case 'annualInterestRate':
        validationFunction = validateInterestRate;
        break;
      default:
        return;
    }
    
    const errorMessage = validationFunction(value);
    setFormErrors(prev => ({...prev, [field]: errorMessage}));
  }, []);
  
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
    if (!value) return "Loan amount is required";
    
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) return "Enter a valid positive number";
    if (amount > 100000000) return "Amount exceeds maximum (100M)";
    return "";
  };
  
  const validateNumMonths = (value) => {
    if (!value) return "Loan term is required";
    
    const months = parseInt(value);
    if (isNaN(months) || months <= 0) return "Enter valid number of months";
    if (months > 600) return "Term cannot exceed 600 months (50 years)";
    return "";
  };
  
  const validateInterestRate = (value) => {
    if (!value) return "Interest rate is required";
    
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0) return "Enter valid interest rate";
    if (rate > 100) return "Rate cannot exceed 100%";
    return "";
  };
  
  // Effect to validate fields when touched
  useEffect(() => {
    const timeoutIds = {};
    
    if (touchedFields.loanAmount) {
      timeoutIds.loanAmount = setTimeout(() => {
        debouncedValidate('loanAmount', loanAmount);
      }, 300);
    }
    
    if (touchedFields.numMonths) {
      timeoutIds.numMonths = setTimeout(() => {
        debouncedValidate('numMonths', numMonths);
      }, 300);
    }
    
    if (touchedFields.annualInterestRate) {
      timeoutIds.annualInterestRate = setTimeout(() => {
        debouncedValidate('annualInterestRate', annualInterestRate);
      }, 300);
    }
    
    return () => {
      Object.values(timeoutIds).forEach(id => clearTimeout(id));
    };
  }, [loanAmount, numMonths, annualInterestRate, touchedFields, debouncedValidate]);
  
  // Handle input changes with validation
  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    setLoanAmount(value);
    setTouchedFields(prev => ({...prev, loanAmount: true}));
  };
  
  const handleNumMonthsChange = (e) => {
    const value = e.target.value;
    setNumMonths(value);
    setTouchedFields(prev => ({...prev, numMonths: true}));
  };
  
  const handleInterestRateChange = (e) => {
    const value = e.target.value;
    setAnnualInterestRate(value);
    setTouchedFields(prev => ({...prev, annualInterestRate: true}));
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
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium ${activeTab === 'basic' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium ${activeTab === 'advanced' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Options
        </button>
      </div>
      
      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="card shadow-lg border border-gray-100 transition-all hover:shadow-xl">
          <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center mb-3 sm:mb-4">
            <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 text-primary" />
            Loan Details
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="form-group">
              <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1" htmlFor="loanAmount">
                Loan Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs sm:text-sm">$</span>
                </div>
                <input
                  id="loanAmount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  className={`pl-7 input-field block w-full transition duration-200 ${formErrors.loanAmount ? 'border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 focus:ring-red-200 dark:focus:ring-red-800' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                  aria-invalid={formErrors.loanAmount ? "true" : "false"}
                  aria-describedby={formErrors.loanAmount ? "loanAmount-error" : ""}
                />
              </div>
              {formErrors.loanAmount && (
                <p id="loanAmount-error" className="mt-1 text-xs sm:text-sm text-red-600 flex items-center animate-fadeIn">
                  <ExclamationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span>{formErrors.loanAmount}</span>
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                {[100000, 250000, 500000, 750000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setLoanAmount(amount);
                      setFormErrors(prev => ({...prev, loanAmount: ""}));
                    }}
                    className="px-2 sm:px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1" htmlFor="numMonths">
                Loan Term
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="numMonths"
                    type="number"
                    placeholder="Months"
                    value={numMonths}
                    onChange={handleNumMonthsChange}
                    className={`pl-8 sm:pl-10 input-field block w-full transition duration-200 ${formErrors.numMonths ? 'border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 focus:ring-red-200 dark:focus:ring-red-800' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                    aria-invalid={formErrors.numMonths ? "true" : "false"}
                    aria-describedby={formErrors.numMonths ? "numMonths-error" : ""}
                  />
                </div>
                <select 
                  className="input-field focus:ring-primary focus:border-primary text-xs sm:text-sm"
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
                <p id="numMonths-error" className="mt-1 text-xs sm:text-sm text-red-600 flex items-center animate-fadeIn">
                  <ExclamationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span>{formErrors.numMonths}</span>
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1" htmlFor="interestRate">
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
                  className={`input-field pr-12 block w-full transition duration-200 ${formErrors.annualInterestRate ? 'border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 focus:ring-red-200 dark:focus:ring-red-800' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                  aria-invalid={formErrors.annualInterestRate ? "true" : "false"}
                  aria-describedby={formErrors.annualInterestRate ? "interestRate-error" : ""}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs sm:text-sm">% APR</span>
                </div>
              </div>
              {formErrors.annualInterestRate && (
                <p id="interestRate-error" className="mt-1 text-xs sm:text-sm text-red-600 flex items-center animate-fadeIn">
                  <ExclamationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span>{formErrors.annualInterestRate}</span>
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                {[3.5, 4.0, 4.5, 5.0, 5.5].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setAnnualInterestRate(rate);
                      setFormErrors(prev => ({...prev, annualInterestRate: ""}));
                    }}
                    className="px-2 sm:px-3 py-1 text-xs rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1" htmlFor="monthlyPayment">
                Monthly Payment
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs sm:text-sm">$</span>
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
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={validateAndCalculate} 
                className="btn-primary flex-1 flex items-center justify-center py-2 sm:py-2.5"
                disabled={hasErrors()}
              >
                <CalculatorIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Calculate Payment
              </button>
              <button 
                onClick={clearAllFields} 
                className="btn-danger flex items-center justify-center py-2 sm:py-2.5"
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
          <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center mb-3 sm:mb-4">
            <ChartPieIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 text-primary" />
            Advanced Options
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="form-group">
              <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1" htmlFor="extraPrincipal">
                Extra Principal Payment
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs sm:text-sm">$</span>
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
              <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1" htmlFor="paymentFrequency">
                Payment Frequency
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <select 
                  id="paymentFrequency"
                  value={paymentFrequencyPreference}
                  onChange={(e) => setPaymentFrequencyPreference(e.target.value)}
                  className="pl-8 sm:pl-10 input-field focus:ring-primary focus:border-primary block w-full text-xs sm:text-sm"
                >
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button 
                onClick={generateAmortizationSchedule} 
                className="btn-primary flex items-center justify-center py-2 sm:py-2.5 text-xs sm:text-sm"
              >
                <DocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                View Regular Schedule
              </button>
              <button 
                onClick={generateExtraAmortizationSchedule} 
                className="btn-success flex items-center justify-center py-2 sm:py-2.5 text-xs sm:text-sm"
              >
                <ArrowTrendingDownIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
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