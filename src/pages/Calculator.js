import React from 'react';
import LoanInputForm from '../components/inputs/LoanInputForm';
import SummaryCard from '../components/results/SummaryCard';

const Calculator = ({
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
  totalAmount
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loan Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Input form */}
        <div className="lg:col-span-2">
          <LoanInputForm
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
          />
        </div>
        
        {/* Right column - Summary */}
        <div className="lg:col-span-1">
          <SummaryCard
            loanAmount={loanAmount}
            annualInterestRate={annualInterestRate}
            numMonths={numMonths}
            monthlyPayment={monthlyPayment}
            totalAmount={totalAmount}
          />
          
          {/* Calculator Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Calculator Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Lower interest rates can significantly reduce your total payment over time</li>
              <li>• Adding extra payments can help pay off your loan faster</li>
              <li>• Consider refinancing if interest rates drop by 1% or more</li>
              <li>• A 15-year loan often has lower interest rates than a 30-year loan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
