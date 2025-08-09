import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Import pages
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Accessibility from "./pages/Accessibility";

// Import SEO component
import DynamicSEO from "./components/SEO/DynamicSEO";

function App() {
  // State management
  const [loanType, setLoanType] = useState("mortgage"); // New state for loan type
  const [loanAmount, setLoanAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [numMonths, setNumMonths] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  // Removed unused state variables



  const [startDate, setStartDate] = useState(new Date()); // Default to current date


  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [extraAmortizationSchedule, setExtraAmortizationSchedule] = useState([]);
  const [extraPrincipal, setExtraPrincipal] = useState("");
  const [paymentFrequencyPreference, setPaymentFrequencyPreference] = useState("monthly");
  
  // Loan-type specific states
  const [downPayment, setDownPayment] = useState(""); // For car and house loans
  const [tradeInValue, setTradeInValue] = useState(""); // For car loans
  const [propertyTax, setPropertyTax] = useState(""); // For house loans
  const [homeInsurance, setHomeInsurance] = useState(""); // For house loans
  const [deviceModel, setDeviceModel] = useState(""); // For mobile loans
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Removed unused years array

  // Calculate total interest
  const totalInterest = totalAmount - loanAmount;

  // Removed unused function handleExtraPrincipalChange

  /**
   * Calculate monthly payment amount
   * @param {number} amount - Loan amount
   * @param {number} months - Number of months
   * @param {number} rate - Annual interest rate
   * @returns {number} Monthly payment amount
   */
  const calculateMonthlyPayment = (amount = loanAmount, months = numMonths, rate = annualInterestRate) => {
    if (!amount || !months || !rate) {
      return 0;
    }
    
    const monthlyInterestRate = rate / 100 / 12;
    const numberOfPayments = months;
    
    // Avoid recalculation by storing intermediate values
    const rateFactorPowered = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const numerator = monthlyInterestRate * rateFactorPowered;
    const denominator = rateFactorPowered - 1;
    
    return amount * (numerator / denominator);
  };

  /**
   * Handle monthly payment calculation and update state
   */
  const handleMonthlyPayment = () => {
    if (!loanAmount || !numMonths || !annualInterestRate) {
      return;
    }
    
    const payment = calculateMonthlyPayment();
    setMonthlyPayment(payment.toFixed(2));
  };

  const handlePaymentFrequencySelect = () => {
    switch (paymentFrequencyPreference) {
      case "quarterly":
        return 3;
      case "semi-annually":
        return 6;
      case "annually":
        return 12;
      default:
        return 1; // Monthly as default
    }
  };

  /**
   * Generate an amortization schedule based on given parameters
   * @param {Object} options - Configuration options
   * @param {boolean} options.includeExtra - Whether to include extra principal payments
   * @returns {Array} Amortization schedule
   */
  const generateSchedule = (options = {}) => {
    const { includeExtra = false } = options;
    
    if (!loanAmount || !numMonths || !annualInterestRate) {
      return [];
    }
    
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const extraPrincipalValue = includeExtra ? (parseFloat(extraPrincipal) || 0) : 0;
    handlePaymentFrequencySelect(); // Call function but not using its result

    // Calculate base monthly payment
    const regularPayment = calculateMonthlyPayment();
    
    // For display in the UI
    setMonthlyPayment(regularPayment.toFixed(2));
    
    // Calculate total with or without extra payments
    let monthlyPaymentValue = regularPayment + (includeExtra ? extraPrincipalValue : 0);
    const estimatedTotal = (monthlyPaymentValue * numberOfPayments).toFixed(2);
    
    // Only update total amount if we're calculating the primary schedule
    if (!includeExtra) {
      setTotalAmount(estimatedTotal);
    }

    const schedule = [];
    let remainingBalance = loanAmount;
    
    // Use startDate to calculate payment dates
    const paymentStartDate = new Date(startDate);
    
    // Performance optimization - calculate dates outside the loop where possible
    const startMonth = paymentStartDate.getMonth();
    const startYear = paymentStartDate.getFullYear();
    
    for (let i = 1; i <= numMonths; i++) {
      const interestPaid = remainingBalance * monthlyInterestRate;
      let principalPaid = monthlyPaymentValue - interestPaid;
      
      // Handle final payment adjustment
      if (remainingBalance < principalPaid) {
        principalPaid = remainingBalance;
        monthlyPaymentValue = principalPaid + interestPaid;
      }
      
      remainingBalance -= principalPaid;
      
      // Ensure balance doesn't go below zero
      if (remainingBalance <= 0) {
        remainingBalance = 0;
      }
      
      // Skip empty entries for extra payment schedule
      if (includeExtra && 
          monthlyPaymentValue === 0 && 
          principalPaid === 0 && 
          interestPaid === 0 && 
          remainingBalance === 0) {
        continue;
      }
      
      // Calculate payment date efficiently
      const paymentDate = new Date(startYear, startMonth + i - 1, paymentStartDate.getDate());
      const year = paymentDate.getFullYear();
      const monthIndex = paymentDate.getMonth();
      
      schedule.push({
        count: i,
        date: paymentDate,
        month: months[monthIndex],
        year,
        payment: (includeExtra ? monthlyPaymentValue : regularPayment).toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
      
      // Early termination if loan is paid off
      if (remainingBalance === 0) {
        break;
      }
    }

    return schedule;
  };

  /**
   * Generate standard amortization schedule
   */
  const generateAmortizationSchedule = () => {
    const schedule = generateSchedule({ includeExtra: false });
    setAmortizationSchedule(schedule);
  };

  /**
   * Generate amortization schedule with extra payments
   */
  const generateExtraAmortizationSchedule = () => {
    const schedule = generateSchedule({ includeExtra: true });
    setExtraAmortizationSchedule(schedule);
  };
  
  const clearAllFields = () => {
    setLoanAmount("");
    setNumMonths("");
    setAnnualInterestRate("");
    setMonthlyPayment("");




    setStartDate(new Date());


    setAmortizationSchedule([]);
    setExtraPrincipal("");
    setTotalAmount(0);
    
    // Clear loan-specific fields
    setDownPayment("");
    setTradeInValue("");
    setPropertyTax("");
    setHomeInsurance("");
    setDeviceModel("");
  };

  // Common props for all pages
  const pageProps = {
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
    totalAmount,
    totalInterest,
    extraPrincipal,
    setExtraPrincipal,
    paymentFrequencyPreference,
    setPaymentFrequencyPreference,
    clearAllFields,
    generateAmortizationSchedule,
    generateExtraAmortizationSchedule,
    amortizationSchedule,
    extraAmortizationSchedule,
    startDate,
    setStartDate,
    
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
  };

  return (
    <Router>
      <HelmetProvider>
        <Helmet>
          <html lang="en" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#1A73E8" />
        </Helmet>
        <DynamicSEO loanType={loanType} />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard {...pageProps} />} />
              <Route path="calculator" element={<Calculator {...pageProps} />} />
              <Route path="schedule" element={<Schedule {...pageProps} />} />
              <Route path="reports" element={<Reports {...pageProps} />} />
              <Route path="profile" element={<Profile />} />
              <Route path="account" element={<Account />} />
              <Route path="settings" element={<Profile />} />
              <Route path="accessibility" element={<Accessibility />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;