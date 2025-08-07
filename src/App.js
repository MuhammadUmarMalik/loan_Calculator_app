import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";

// Import pages
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Account from "./pages/Account";

function App() {
  // State management
  const [loanAmount, setLoanAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [numMonths, setNumMonths] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState("");
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [startYear, setStartYear] = useState(new Date().getFullYear()); // Default to current year
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [extraAmortizationSchedule, setExtraAmortizationSchedule] = useState([]);
  const [extraPrincipal, setExtraPrincipal] = useState("");
  const [paymentFrequencyPreference, setPaymentFrequencyPreference] = useState("monthly");
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() + index
  );

  // Calculate total interest
  const totalInterest = totalAmount - loanAmount;

  const handleExtraPrincipalChange = (e) => {
    setExtraPrincipal(e.target.value);
  };

  const handleMonthlyPayment = () => {
    if (!loanAmount || !numMonths || !annualInterestRate) {
      return;
    }
    
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

    const monthlyPaymentValue = loanAmount * (numerator / denominator);
    setMonthlyPayment(monthlyPaymentValue.toFixed(2));
  };

  const calculateMonthlyPayment = () => {
    if (!loanAmount || !numMonths || !annualInterestRate) {
      return 0;
    }
    
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    return loanAmount * (numerator / denominator);
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

  // Generate Amortization Schedule
  const generateAmortizationSchedule = () => {
    if (!loanAmount || !numMonths || !annualInterestRate) {
      return;
    }
    
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

    let monthlyPaymentValue = loanAmount * (numerator / denominator);
    const paymentFrequency = handlePaymentFrequencySelect();

    let monthlyPayment = calculateMonthlyPayment();
    setMonthlyPayment(monthlyPayment.toFixed(2));

    const totalAmount = (monthlyPayment * numberOfPayments).toFixed(2);
    setTotalAmount(totalAmount);

    const schedule = [];
    let remainingBalance = loanAmount;
    let count;

    for (let i = 1; i <= numMonths; i++) {
      const interestPaid = remainingBalance * monthlyInterestRate;
      let principalPaid = monthlyPaymentValue - interestPaid;
      if (remainingBalance < principalPaid) {
        principalPaid = remainingBalance;
        monthlyPaymentValue = principalPaid + interestPaid; // Adjust monthly payment
      }
      remainingBalance -= principalPaid;
      if (remainingBalance <= 0) {
        remainingBalance = 0; // Set remaining balance to zero if it becomes negative
      }
      count = i;
      const year = years[Math.floor((startMonth - 1 + i) / 12) % years.length];
      schedule.push({
        count,
        month: months[(startMonth - 1 + i) % 12],
        payment: monthlyPayment.toFixed(2),
        principalPaid: principalPaid.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
    }

    setAmortizationSchedule(schedule);
  };

  // Generate Extra Amortization Schedule
  const generateExtraAmortizationSchedule = () => {
    if (!loanAmount || !numMonths || !annualInterestRate) {
      return;
    }
    
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = numMonths;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    const extraPrincipalValue = parseFloat(extraPrincipal) || 0;
    const paymentFrequency = handlePaymentFrequencySelect();

    let monthlyPaymentValue = loanAmount * (numerator / denominator) + extraPrincipalValue;
    const totalAmount = (monthlyPaymentValue * numberOfPayments).toFixed(2);
    setTotalAmount(totalAmount);

    const schedule = [];
    let remainingBalance = loanAmount;
    let count;

    for (let i = 1; i <= numMonths; i++) {
      const interestPaid = remainingBalance * monthlyInterestRate;
      let principalPaid = monthlyPaymentValue - interestPaid;
      if (remainingBalance < principalPaid) {
        principalPaid = remainingBalance;
        monthlyPaymentValue = principalPaid + interestPaid; // Adjust monthly payment
      }

      remainingBalance -= principalPaid;
      if (remainingBalance <= 0) {
        remainingBalance = 0; // Set remaining balance to zero if it becomes negative
      }
      count = i;
      const year = years[Math.floor((startMonth - 1 + i) / 12) % years.length];
      if (
        monthlyPaymentValue !== 0 ||
        principalPaid !== 0 ||
        interestPaid !== 0 ||
        remainingBalance !== 0
      ) {
        schedule.push({
          count,
          month: months[(startMonth - 1 + i) % 12],
          payment: monthlyPaymentValue.toFixed(2),
          principalPaid: principalPaid.toFixed(2),
          interestPaid: interestPaid.toFixed(2),
          remainingBalance: remainingBalance.toFixed(2),
        });
      }
    }

    setExtraAmortizationSchedule(schedule);
  };
  
  const clearAllFields = () => {
    setLoanAmount("");
    setNumMonths("");
    setAnnualInterestRate("");
    setMonthlyPayment("");
    setPrincipalAmount("");
    setInterestRate("");
    setSelectedMonth();
    setSelectedYear("");
    setStartMonth(new Date().getMonth() + 1);
    setStartYear(new Date().getFullYear());
    setAmortizationSchedule([]);
    setExtraPrincipal("");
    setTotalAmount(0);
  };

  // Common props for all pages
  const pageProps = {
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
    extraAmortizationSchedule
  };

  return (
    <Router>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;