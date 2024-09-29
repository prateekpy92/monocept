import React, { useState } from 'react';

const PaginationComponent = ({ totalItems, itemsPerPageOptions, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber, itemsPerPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
    onPageChange(1, parseInt(event.target.value));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <label htmlFor="itemsPerPage" style={{ marginRight: '10px' }}>
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f8f8f8',
              cursor: 'pointer',
            }}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              style={{
                margin: '0 5px',
                padding: '8px 12px',
                backgroundColor: pageNumber === currentPage ? '#007bff' : '#fff',
                color: pageNumber === currentPage ? '#fff' : '#000',
                border: '1px solid #007bff',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: pageNumber === currentPage ? 'bold' : 'normal',
              }}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
