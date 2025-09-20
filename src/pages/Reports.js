import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import LoanPieChart from '../components/charts/LoanPieChart';
import LoanBalanceChart from '../components/charts/LoanBalanceChart';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ExportButtons from '../components/results/ExportButtons';
import AmortizationSchedule from '../AmortizationSchedule';

const Reports = ({
  loanAmount,
  annualInterestRate,
  numMonths,
  monthlyPayment,
  totalAmount,
  totalInterest,
  amortizationSchedule,
  extraAmortizationSchedule,
  clearAllFields
}) => {
  const [selectedChart, setSelectedChart] = useState('breakdown');
  
  // Function to calculate interest savings with extra payments
  const calculateInterestSavings = () => {
    if (!amortizationSchedule || !extraAmortizationSchedule || 
        amortizationSchedule.length === 0 || extraAmortizationSchedule.length === 0) {
      return 0;
    }
    
    const regularTotalInterest = amortizationSchedule.reduce(
      (total, item) => total + parseFloat(item.interestPaid), 0
    );
    
    const extraTotalInterest = extraAmortizationSchedule.reduce(
      (total, item) => total + parseFloat(item.interestPaid), 0
    );
    
    return regularTotalInterest - extraTotalInterest;
  };
  
  // Function to calculate time savings with extra payments
  const calculateTimeSavings = () => {
    if (!amortizationSchedule || !extraAmortizationSchedule || 
        amortizationSchedule.length === 0 || extraAmortizationSchedule.length === 0) {
      return 0;
    }
    
    return amortizationSchedule.length - extraAmortizationSchedule.length;
  };
  
  const interestSavings = calculateInterestSavings();
  const timeSavings = calculateTimeSavings();
  
  // Download handlers for summary and comparison PDFs
  const downloadLoanSummaryPDF = () => {
    if (!loanAmount || !annualInterestRate || !numMonths || !monthlyPayment) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const primary = [26, 115, 232]; // #1A73E8
    const gray600 = [75, 85, 99];
    const gray300 = [209, 213, 219];
    const text = [17, 24, 39];

    const pageWidth = doc.internal.pageSize.getWidth();

    const formatCurrency = (n) => `$${parseFloat(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Header bar
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Loan Summary Report', pageWidth / 2, 14, { align: 'center' });

    // Meta line
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 20, { align: 'center' });

    // Card helper
    const drawCard = (x, y, w, h, title, rows) => {
      doc.setDrawColor(gray300[0], gray300[1], gray300[2]);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, w, h, 2, 2, 'FD');
      doc.setTextColor(text[0], text[1], text[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, x + 6, y + 8);
      doc.setDrawColor(gray300[0], gray300[1], gray300[2]);
      doc.line(x + 6, y + 10, x + w - 6, y + 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      let cy = y + 18;
      rows.forEach(([label, value]) => {
        doc.setTextColor(gray600[0], gray600[1], gray600[2]);
        doc.text(label, x + 6, cy);
        doc.setTextColor(text[0], text[1], text[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x + w - 6, cy, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        cy += 8;
      });
    };

    // Summary card
    const margin = 15;
    drawCard(
      margin,
      30,
      pageWidth - margin * 2,
      60,
      'Loan Details',
      [
        ['Loan Amount', formatCurrency(loanAmount)],
        ['Interest Rate', `${annualInterestRate}% APR`],
        ['Term', `${numMonths} months`],
        ['Monthly Payment', formatCurrency(monthlyPayment)],
        ['Total Payment', formatCurrency(totalAmount)],
        ['Total Interest', formatCurrency(parseFloat(totalAmount || 0) - parseFloat(loanAmount || 0))],
      ]
    );

    // Footer note + contact
    doc.setFontSize(9);
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.text('This report is for informational purposes only.', pageWidth / 2, 288, { align: 'center' });
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Website: www.umarmalik-dev.com   |   LinkedIn: umarmalik-dev   |   GitHub: muhammadumarmalik   |   Email: umarmalik.cs711@gmail.com', pageWidth / 2, 295, { align: 'center' });

    doc.save('loan-summary.pdf');
  };

  const downloadComparisonPDF = () => {
    if (!amortizationSchedule || amortizationSchedule.length === 0) return;
    if (!extraAmortizationSchedule || extraAmortizationSchedule.length === 0) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const primary = [26, 115, 232];
    const gray600 = [75, 85, 99];
    const gray300 = [209, 213, 219];
    const text = [17, 24, 39];
    const pageWidth = doc.internal.pageSize.getWidth();

    const currency = (n) => `$${parseFloat(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Header bar
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Loan Comparison Report', pageWidth / 2, 14, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 20, { align: 'center' });

    // Cards side-by-side
    const margin = 12;
    const cardW = (pageWidth - margin * 3) / 2;
    const cardH = 60;

    const totalInterestRegular = amortizationSchedule.reduce((t, i) => t + parseFloat(i.interestPaid), 0);
    const totalInterestExtra = extraAmortizationSchedule.reduce((t, i) => t + parseFloat(i.interestPaid), 0);

    const drawCard = (x, title, rows) => {
      doc.setDrawColor(gray300[0], gray300[1], gray300[2]);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, 30, cardW, cardH, 2, 2, 'FD');
      doc.setTextColor(text[0], text[1], text[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, x + 6, 38);
      doc.setDrawColor(gray300[0], gray300[1], gray300[2]);
      doc.line(x + 6, 40, x + cardW - 6, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      let cy = 48;
      rows.forEach(([label, value]) => {
        doc.setTextColor(gray600[0], gray600[1], gray600[2]);
        doc.text(label, x + 6, cy);
        doc.setTextColor(text[0], text[1], text[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x + cardW - 6, cy, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        cy += 8;
      });
    };

    drawCard(margin, 'Regular Payments', [
      ['Number of Payments', `${amortizationSchedule.length}`],
      ['Total Interest', currency(totalInterestRegular)],
      ['Avg Payment', currency(amortizationSchedule.reduce((t, i) => t + parseFloat(i.payment), 0) / amortizationSchedule.length)],
    ]);

    drawCard(margin * 2 + cardW, 'With Extra Payments', [
      ['Number of Payments', `${extraAmortizationSchedule.length}`],
      ['Total Interest', currency(totalInterestExtra)],
      ['Avg Payment', currency(extraAmortizationSchedule.reduce((t, i) => t + parseFloat(i.payment), 0) / extraAmortizationSchedule.length)],
    ]);

    // Savings strip
    const stripY = 30 + cardH + 12;
    doc.setDrawColor(primary[0], primary[1], primary[2]);
    doc.setFillColor(242, 248, 255);
    doc.roundedRect(margin, stripY, pageWidth - margin * 2, 18, 2, 2, 'FD');
    doc.setFontSize(12);
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Interest Savings: ${currency(interestSavings)}    •    Time Savings: ${Math.floor(timeSavings / 12)} years, ${timeSavings % 12} months`, pageWidth / 2, stripY + 12, { align: 'center' });

    // Footer + contact
    doc.setFontSize(9);
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.text('This report is for informational purposes only.', pageWidth / 2, 288, { align: 'center' });
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Website: www.umarmalik-dev.com   |   LinkedIn: umarmalik-dev   |   GitHub: muhammadumarmalik   |   Email: umarmalik.cs711@gmail.com', pageWidth / 2, 295, { align: 'center' });

    doc.save('loan-comparison.pdf');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loan Reports</h1>
        
        <ExportButtons
          loanAmount={loanAmount}
          annualInterestRate={annualInterestRate}
          numMonths={numMonths}
          monthlyPayment={monthlyPayment}
          totalAmount={totalAmount}
          amortizationSchedule={amortizationSchedule}
          clearAllFields={clearAllFields}
        />
      </div>
      
      {/* Chart Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedChart('breakdown')}
            className={`px-4 py-2 rounded-md ${selectedChart === 'breakdown' ? 
              'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Payment Breakdown
          </button>
          <button
            onClick={() => setSelectedChart('balance')}
            className={`px-4 py-2 rounded-md ${selectedChart === 'balance' ? 
              'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Balance Over Time
          </button>
          {extraAmortizationSchedule && extraAmortizationSchedule.length > 0 && (
            <button
              onClick={() => setSelectedChart('comparison')}
              className={`px-4 py-2 rounded-md ${selectedChart === 'comparison' ? 
                'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Payment Comparison
            </button>
          )}
        </div>
      </div>
      
      {/* Chart Display */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-[400px]">
          {selectedChart === 'breakdown' && (
            <LoanPieChart loanAmount={loanAmount} totalInterest={totalInterest} />
          )}
          
          {selectedChart === 'balance' && (
            <LoanBalanceChart amortizationSchedule={amortizationSchedule} />
          )}
          
          {selectedChart === 'comparison' && (
            <div className="grid grid-cols-2 gap-4 h-full">
              <div>
                <h3 className="text-lg font-semibold text-center mb-2">Regular Payments</h3>
                <LoanBalanceChart amortizationSchedule={amortizationSchedule} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-center mb-2">With Extra Payments</h3>
                <LoanBalanceChart amortizationSchedule={extraAmortizationSchedule} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Loan Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-primary mb-4">Loan Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Principal</h3>
            <p className="text-xl font-semibold">${parseFloat(loanAmount || 0).toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Interest</h3>
            <p className="text-xl font-semibold">${parseFloat(totalInterest || 0).toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Interest-to-Principal Ratio</h3>
            <p className="text-xl font-semibold">
              {loanAmount && totalInterest ? 
                `${((parseFloat(totalInterest) / parseFloat(loanAmount)) * 100).toFixed(1)}%` : 
                '0%'
              }
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Loan Term</h3>
            <p className="text-xl font-semibold">
              {Math.floor(numMonths / 12) > 0 ? `${Math.floor(numMonths / 12)} years` : ''} 
              {numMonths % 12 > 0 ? ` ${numMonths % 12} months` : ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Extra Payment Impact */}
      {extraAmortizationSchedule && extraAmortizationSchedule.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-600 mb-4">Extra Payment Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-100 rounded-lg p-6 bg-green-50">
              <h3 className="text-lg font-medium text-green-700">Interest Savings</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">${interestSavings.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                {((interestSavings / parseFloat(totalInterest || 1)) * 100).toFixed(1)}% saved on total interest
              </p>
            </div>
            <div className="border border-blue-100 rounded-lg p-6 bg-blue-50">
              <h3 className="text-lg font-medium text-blue-700">Time Savings</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {Math.floor(timeSavings / 12)} years, {timeSavings % 12} months
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {((timeSavings / numMonths) * 100).toFixed(1)}% reduction in loan term
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Download Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-primary mb-4">Download Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={downloadLoanSummaryPDF}
            disabled={!loanAmount || !annualInterestRate || !numMonths || !monthlyPayment}
            className={`border border-gray-200 rounded-lg p-4 flex items-center transition-colors ${(!loanAmount || !annualInterestRate || !numMonths || !monthlyPayment) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            aria-disabled={!loanAmount || !annualInterestRate || !numMonths || !monthlyPayment}
          >
            <DocumentTextIcon className="h-8 w-8 text-primary mr-3" />
            <div>
              <h3 className="text-sm font-medium">Loan Summary Report</h3>
              <p className="text-xs text-gray-500">PDF format</p>
            </div>
            <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 ml-auto" />
          </button>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center hover:bg-gray-50 transition-colors">
            <DocumentTextIcon className="h-8 w-8 text-primary mr-3" />
            <div className="flex-grow">
              <h3 className="text-sm font-medium">Full Amortization Schedule</h3>
              <p className="text-xs text-gray-500">PDF format</p>
            </div>
            {amortizationSchedule && amortizationSchedule.length > 0 ? (
              <div className="flex items-center">
                <div className="hidden md:block">
                  <AmortizationSchedule
                    loanAmount={loanAmount}
                    annualInterestRate={annualInterestRate}
                    numMonths={numMonths}
                    monthlyPayment={monthlyPayment}
                    totalAmount={totalAmount}
                    amortizationSchedule={amortizationSchedule}
                  />
                </div>
                <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 md:hidden ml-auto" />
              </div>
            ) : (
              <ArrowDownTrayIcon className="h-5 w-5 text-gray-300 ml-auto" />
            )}
          </div>
          <button 
            onClick={downloadComparisonPDF}
            disabled={!extraAmortizationSchedule || extraAmortizationSchedule.length === 0 || !amortizationSchedule || amortizationSchedule.length === 0}
            className={`border border-gray-200 rounded-lg p-4 flex items-center transition-colors ${(!extraAmortizationSchedule || extraAmortizationSchedule.length === 0 || !amortizationSchedule || amortizationSchedule.length === 0) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            aria-disabled={!extraAmortizationSchedule || extraAmortizationSchedule.length === 0 || !amortizationSchedule || amortizationSchedule.length === 0}
          >
            <DocumentTextIcon className="h-8 w-8 text-primary mr-3" />
            <div>
              <h3 className="text-sm font-medium">Comparison Report</h3>
              <p className="text-xs text-gray-500">PDF format</p>
            </div>
            <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
