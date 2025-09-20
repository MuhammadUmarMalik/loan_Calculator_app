import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #EEEEEE',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#1A73E8',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1A73E8',
    color: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 5,
    fontSize: 9,
    borderBottom: '1pt solid #EEEEEE',
  },
  col10: { width: '10%' },
  col15: { width: '15%' },
  col20: { width: '20%' },
  col25: { width: '25%' },
  col30: { width: '30%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: '#666666',
  },
});

// PDF Document Component
const AmortizationPDF = ({ loanAmount, interestRate, numMonths, monthlyPayment, totalCost, schedule }) => {
  const formatCurrency = (value) => {
    const n = Number(value || 0);
    return `$${n.toFixed(2)}`;
  };
  const formatNumber = (value) => {
    const n = Number(value || 0);
    return `${n.toFixed(2)}`;
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Loan Amortization Schedule</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Loan Amount:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(loanAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Interest Rate:</Text>
            <Text style={styles.summaryValue}>{interestRate}% APR</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Term:</Text>
            <Text style={styles.summaryValue}>{Math.floor(numMonths / 12)} years {numMonths % 12 > 0 ? `${numMonths % 12} months` : ''}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Payment:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(monthlyPayment)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalCost)}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.col10}>#</Text>
          <Text style={styles.col15}>Date</Text>
          <Text style={styles.col20}>Payment</Text>
          <Text style={styles.col20}>Principal</Text>
          <Text style={styles.col20}>Interest</Text>
          <Text style={styles.col15}>Balance</Text>
        </View>

        {/* Table Rows - First 30 payments or all if less than 30 */}
        {schedule && schedule.slice(0, Math.min(30, schedule.length)).map((entry, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? { backgroundColor: '#F9FAFB' } : {}]}>
            <Text style={styles.col10}>{entry.count}</Text>
            <Text style={styles.col15}>{entry.month}</Text>
            <Text style={styles.col20}>{formatCurrency(entry.payment)}</Text>
            <Text style={styles.col20}>{formatCurrency(entry.principalPaid)}</Text>
            <Text style={styles.col20}>{formatCurrency(entry.interestPaid)}</Text>
            <Text style={styles.col15}>{formatCurrency(entry.remainingBalance)}</Text>
          </View>
        ))}

        {schedule && schedule.length > 30 && (
          <Text style={{ fontSize: 9, marginTop: 10, fontStyle: 'italic', textAlign: 'center' }}>
            Note: This is a summary showing the first 30 payments. The full schedule contains {schedule.length} payments.
          </Text>
        )}

        <Text style={styles.footer}>
          This amortization schedule is for educational purposes only and is not financial advice.
        </Text>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

// Component for viewing/downloading the PDF
const AmortizationSchedule = ({ 
  loanAmount, 
  annualInterestRate, 
  numMonths, 
  monthlyPayment, 
  totalAmount, 
  amortizationSchedule 
}) => {
  // Check if we have data to render
  const hasValidData = 
    loanAmount && 
    annualInterestRate && 
    numMonths && 
    monthlyPayment && 
    amortizationSchedule && 
    amortizationSchedule.length > 0;

  if (!hasValidData) {
    return (
      <button 
        disabled
        className="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm font-medium cursor-not-allowed"
        title="Calculate a loan first to enable PDF download"
      >
        Download PDF
      </button>
    );
  }

  // Safely create PDF document (prevents rendering issues)
  const PdfDocument = () => (
    <AmortizationPDF 
      loanAmount={loanAmount || 0} 
      interestRate={annualInterestRate || 0} 
      numMonths={numMonths || 0} 
      monthlyPayment={monthlyPayment || 0} 
      totalCost={totalAmount || 0} 
      schedule={amortizationSchedule || []}
    />
  );

  return (
    <div>
      <PDFDownloadLink 
        document={<PdfDocument />} 
        fileName="loan_amortization_schedule.pdf"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#1A73E8',
          color: '#FFFFFF',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'medium',
          cursor: 'pointer'
        }}
      >
        {({ blob, url, loading, error }) => {
          if (loading) {
            return (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </div>
            );
          }
          
          if (error) {
            console.error("PDF generation error:", error);
            return 'Error creating PDF';
          }
          
          return (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Download Amortization PDF
            </div>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
};

export default AmortizationSchedule;
