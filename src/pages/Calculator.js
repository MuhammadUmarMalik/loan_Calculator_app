import React, { useState } from 'react';
import LoanInputForm from '../components/inputs/LoanInputForm';
import SummaryCard from '../components/results/SummaryCard';
import LoanComparison from '../components/comparison/LoanComparison';
import { 
  HomeIcon,
  TruckIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';

const Calculator = ({
  loanType,
  setLoanType,
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
  generateExtraAmortizationSchedule,
  totalAmount,
  startDate,
  // Loan-specific props
  downPayment,
  setDownPayment,
  tradeInValue,
  setTradeInValue,
  propertyTax,
  setPropertyTax,
  homeInsurance,
  setHomeInsurance,
  deviceModel,
  setDeviceModel
}) => {
  const [showComparison, setShowComparison] = useState(false);
  // Get calculator title based on loan type
  const getCalculatorTitle = () => {
    switch(loanType) {
      case "car":
        return (
          <div className="flex items-center">
            <TruckIcon className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Car Loan Calculator</h1>
          </div>
        );
      case "mobile":
        return (
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Mobile Phone Loan Calculator</h1>
          </div>
        );
      case "house":
        return (
          <div className="flex items-center">
            <HomeIcon className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Home Loan Calculator</h1>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <BuildingLibraryIcon className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Mortgage Calculator</h1>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getCalculatorTitle()}
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`flex items-center px-3 py-1.5 text-sm rounded-lg ${
            showComparison 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-primary text-white hover:bg-primary-dark'
          } transition-colors`}
        >
          <ChartBarSquareIcon className="h-4 w-4 mr-1.5" />
          {showComparison ? 'Hide Comparison' : 'Compare Loans'}
        </button>
      </div>
      
      {showComparison && (
        <div className="card shadow-lg border border-gray-100 mb-6">
          <LoanComparison
            loanType={loanType}
            loanAmount={loanAmount}
            numMonths={numMonths}
            annualInterestRate={annualInterestRate}
            monthlyPayment={monthlyPayment}
            totalAmount={totalAmount}
            startDate={startDate}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Input form */}
        <div className="lg:col-span-2">
          <LoanInputForm
            loanType={loanType}
            setLoanType={setLoanType}
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            numMonths={numMonths}
            setNumMonths={setNumMonths}
            annualInterestRate={annualInterestRate}
            setAnnualInterestRate={setAnnualInterestRate}
            monthlyPayment={monthlyPayment}
            handleMonthlyPayment={handleMonthlyPayment}
            extraPrincipal={extraPrincipal}
            setExtraPrincipal={setExtraPrincipal}
            paymentFrequencyPreference={paymentFrequencyPreference}
            setPaymentFrequencyPreference={setPaymentFrequencyPreference}
            clearAllFields={clearAllFields}
            generateAmortizationSchedule={generateAmortizationSchedule}
            generateExtraAmortizationSchedule={generateExtraAmortizationSchedule}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            tradeInValue={tradeInValue}
            setTradeInValue={setTradeInValue}
            propertyTax={propertyTax}
            setPropertyTax={setPropertyTax}
            homeInsurance={homeInsurance}
            setHomeInsurance={setHomeInsurance}
            deviceModel={deviceModel}
            setDeviceModel={setDeviceModel}
          />
        </div>
        
        {/* Right column - Summary */}
        <div className="lg:col-span-1">
          <SummaryCard
            loanType={loanType}
            loanAmount={loanAmount}
            annualInterestRate={annualInterestRate}
            numMonths={numMonths}
            monthlyPayment={monthlyPayment}
            totalAmount={totalAmount}
            downPayment={downPayment}
            tradeInValue={tradeInValue}
            propertyTax={propertyTax}
            homeInsurance={homeInsurance}
            deviceModel={deviceModel}
          />
          
          {/* Calculator Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Calculator Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              {loanType === "mortgage" && (
                <>
                  <li>• Lower interest rates can significantly reduce your total payment over time</li>
                  <li>• Adding extra payments can help pay off your mortgage faster</li>
                  <li>• Consider refinancing if interest rates drop by 1% or more</li>
                  <li>• A 15-year mortgage often has lower interest rates than a 30-year mortgage</li>
                </>
              )}
              
              {loanType === "car" && (
                <>
                  <li>• A larger down payment reduces your monthly payments</li>
                  <li>• Trade-in value can offset your loan amount</li>
                  <li>• Consider a shorter loan term to save on interest</li>
                  <li>• Dealership financing rates can often be negotiated</li>
                </>
              )}
              
              {loanType === "house" && (
                <>
                  <li>• A 20% down payment typically avoids private mortgage insurance</li>
                  <li>• Factor in property taxes and insurance for total housing costs</li>
                  <li>• Shorter loan terms mean higher payments but less total interest</li>
                  <li>• Shop around for the best interest rates from multiple lenders</li>
                </>
              )}
              
              {loanType === "mobile" && (
                <>
                  <li>• Carrier financing may offer promotional interest rates</li>
                  <li>• Consider the total cost compared to the device value</li>
                  <li>• Shorter terms often have lower or zero interest rates</li>
                  <li>• Check for hidden fees or penalties for early payoff</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
