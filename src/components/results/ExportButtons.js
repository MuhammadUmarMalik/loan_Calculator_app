import React from 'react';
import { jsPDF } from 'jspdf';
import { DocumentArrowDownIcon, PrinterIcon, ShareIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ExportButtons = ({ 
  loanAmount, 
  annualInterestRate, 
  numMonths, 
  monthlyPayment, 
  totalAmount, 
  amortizationSchedule,
  clearAllFields 
}) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Mortgage Calculator - Loan Summary', 105, 15, { align: 'center' });
    
    // Add loan details
    doc.setFontSize(12);
    doc.text(`Loan Amount: $${loanAmount}`, 20, 30);
    doc.text(`Annual Interest Rate: ${annualInterestRate}%`, 20, 40);
    doc.text(`Loan Term: ${numMonths} months`, 20, 50);
    doc.text(`Monthly Payment: $${monthlyPayment}`, 20, 60);
    doc.text(`Total Payment: $${totalAmount}`, 20, 70);
    doc.text(`Total Interest: $${(totalAmount - loanAmount).toFixed(2)}`, 20, 80);
    
    // Add table header
    let y = 100;
    doc.setFontSize(10);
    const headers = ['#', 'Month', 'Payment', 'Principal', 'Interest', 'Balance'];
    const columnWidths = [10, 30, 30, 30, 30, 40];
    let x = 20;
    
    headers.forEach((header, i) => {
      doc.text(header, x, y);
      x += columnWidths[i];
    });
    
    // Add table rows (first 30 entries to avoid overwhelming the PDF)
    y += 10;
    const maxEntries = Math.min(amortizationSchedule.length, 30);
    
    for (let i = 0; i < maxEntries; i++) {
      const entry = amortizationSchedule[i];
      x = 20;
      
      doc.text(entry.count.toString(), x, y);
      x += columnWidths[0];
      
      doc.text(entry.month.substring(0, 3), x, y);
      x += columnWidths[1];
      
      doc.text(`$${entry.payment}`, x, y);
      x += columnWidths[2];
      
      doc.text(`$${entry.principalPaid}`, x, y);
      x += columnWidths[3];
      
      doc.text(`$${entry.interestPaid}`, x, y);
      x += columnWidths[4];
      
      doc.text(`$${entry.remainingBalance}`, x, y);
      
      y += 6;
      
      // Add a new page if we're running out of space
      if (y > 280 && i < maxEntries - 1) {
        doc.addPage();
        y = 20;
      }
    }
    
    // If we have more entries than shown, add a note
    if (amortizationSchedule.length > maxEntries) {
      doc.text(`Note: Showing ${maxEntries} of ${amortizationSchedule.length} total payments.`, 20, y + 10);
    }
    
    // Save the PDF
    doc.save('mortgage-calculator-results.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: 'Mortgage Calculator Results',
        text: `Loan Amount: $${loanAmount}, Interest Rate: ${annualInterestRate}%, Monthly Payment: $${monthlyPayment}`,
        url: window.location.href
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      const shareText = `Mortgage Calculator Results:
Loan Amount: $${loanAmount}
Interest Rate: ${annualInterestRate}%
Monthly Payment: $${monthlyPayment}
Total Payment: $${totalAmount}`;
      
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Results copied to clipboard'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <button 
        onClick={generatePDF} 
        disabled={!amortizationSchedule || amortizationSchedule.length === 0}
        className="btn-primary flex items-center gap-2"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        Save as PDF
      </button>
      
      <button 
        onClick={handlePrint}
        disabled={!amortizationSchedule || amortizationSchedule.length === 0}
        className="btn-primary flex items-center gap-2"
      >
        <PrinterIcon className="h-5 w-5" />
        Print
      </button>
      
      <button 
        onClick={handleShare}
        disabled={!amortizationSchedule || amortizationSchedule.length === 0}
        className="btn-primary flex items-center gap-2"
      >
        <ShareIcon className="h-5 w-5" />
        Share
      </button>
      
      <button 
        onClick={clearAllFields}
        className="btn-danger flex items-center gap-2"
      >
        <ArrowPathIcon className="h-5 w-5" />
        Reset
      </button>
    </div>
  );
};

export default ExportButtons;