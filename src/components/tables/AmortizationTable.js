import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const AmortizationTable = ({ schedule, title, isExtra = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'asc' });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!schedule || schedule.length === 0) return [];
    
    let sortableItems = [...schedule];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Handle date values
        if (sortConfig.key === 'date') {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle numeric values
        if (!isNaN(parseFloat(a[sortConfig.key])) && !isNaN(parseFloat(b[sortConfig.key]))) {
          return sortConfig.direction === 'asc' 
            ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
            : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
        }
        
        // Handle string values
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [schedule, sortConfig]);

  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((schedule?.length || 0) / itemsPerPage);

  // Sort request handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!schedule || schedule.length === 0) return { principal: 0, interest: 0, payment: 0 };
    
    return schedule.reduce((totals, entry) => {
      return {
        principal: totals.principal + parseFloat(entry.principalPaid),
        interest: totals.interest + parseFloat(entry.interestPaid),
        payment: totals.payment + parseFloat(entry.payment),
      };
    }, { principal: 0, interest: 0, payment: 0 });
  };

  const totals = calculateTotals();

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' 
        ? <ArrowUpIcon className="h-3 w-3 inline ml-1" />
        : <ArrowDownIcon className="h-3 w-3 inline ml-1" />;
    }
    return null;
  };

  return (
    <div className="card overflow-hidden">
      <h2 className="section-title">{title || "Amortization Schedule"}</h2>
      
      {schedule && schedule.length > 0 ? (
        <>
          <div className="overflow-x-auto -mx-4 sm:-mx-5 md:-mx-6 px-4 sm:px-5 md:px-6">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="table-header">
                <tr>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm cursor-pointer"
                    onClick={() => requestSort('count')}
                  >
                    # {getSortIcon('count')}
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm cursor-pointer"
                    onClick={() => requestSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm cursor-pointer"
                    onClick={() => requestSort('payment')}
                  >
                    Payment {getSortIcon('payment')}
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm cursor-pointer"
                    onClick={() => requestSort('principalPaid')}
                  >
                    Principal {getSortIcon('principalPaid')}
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm cursor-pointer"
                    onClick={() => requestSort('interestPaid')}
                  >
                    Interest {getSortIcon('interestPaid')}
                  </th>
                  <th 
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm cursor-pointer"
                    onClick={() => requestSort('remainingBalance')}
                  >
                    Balance {getSortIcon('remainingBalance')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((entry, index) => (
                  <tr 
                    key={`${entry.count}-${index}`} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-secondary transition-colors text-xs sm:text-sm`}
                  >
                    <td className="px-2 sm:px-4 py-1.5 sm:py-2">{entry.count}</td>
                    <td className="px-2 sm:px-4 py-1.5 sm:py-2">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : `${entry.month}`}
                    </td>
                    <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${entry.payment}</td>
                    <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${entry.principalPaid}</td>
                    <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${entry.interestPaid}</td>
                    <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${entry.remainingBalance}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold text-xs sm:text-sm">
                <tr>
                  <td colSpan={2} className="px-2 sm:px-4 py-1.5 sm:py-2 text-left">Totals</td>
                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${totals.payment.toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${totals.principal.toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">${totals.interest.toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 px-2 sm:px-4 gap-2">
              <div>
                <span className="text-xs sm:text-sm text-text-secondary">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, schedule.length)} of {schedule.length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center text-text-secondary">
          No data available. Generate an amortization schedule to view details.
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;