import React from 'react';
import PropTypes from 'prop-types'; // For prop validation

function PageSizeSetter({ setPageSize, totalRecord, pageSize, setPageNumber }) {
  return (
    <select
      className="form-select"
      id="floatingSelect"
      aria-label="Select page size"
      onChange={(e) => {
        const newSize = Number(e.target.value); // Ensure value is treated as a number
        setPageSize(newSize); // Update the page size
        if (typeof setPageNumber === 'function') { // Ensure setPageNumber is a function
          setPageNumber(0); // Reset to the first page when page size changes
        } else {
          console.error('setPageNumber is not a function');
        }
        console.log('Total records:', totalRecord);
      }}
      value={pageSize} // Ensure the selected value matches pageSize
    >
      <option value="" disabled>Select Page Size</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
    </select>
  );
}

// PropTypes to validate prop types
PageSizeSetter.propTypes = {
  setPageSize: PropTypes.func.isRequired,
  totalRecord: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired, // Ensure setPageNumber is a function
};

export default PageSizeSetter;
