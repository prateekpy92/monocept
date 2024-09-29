import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationApp = ({ totalpage, setpage, pageNumber }) => {
  const [active, setActive] = useState(pageNumber + 1); // Keep track of the active page, 1-based

  // Creating pagination items
  let items = [];

  // Previous button
  items.push(
    <Pagination.Prev
      key="prev"
      disabled={active === 1} // Disable when on the first page
      onClick={() => {
        if (active > 1) {
          setpage(pageNumber - 1);
          setActive(active - 1);
        }
      }}
    />
  );

  // Page numbers
  for (let number = 1; number <= totalpage; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active} // Correct active state
        onClick={() => {
          setpage(number - 1); // Update page number
          setActive(number); // Update active page
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Next button
  items.push(
    <Pagination.Next
      key="next"
      disabled={active === totalpage} // Disable when on the last page
      onClick={() => {
        if (active < totalpage) {
          setpage(pageNumber + 1);
          setActive(active + 1);
        }
      }}
    />
  );

  return (
    <div className="d-flex justify-content-center">
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default PaginationApp;
