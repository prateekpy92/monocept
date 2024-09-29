import React, { useState, useEffect } from "react";
import { getAllCustomer } from "../../services/customer/CustomerService";
import Table from "../../component/shared/table/Table";
import PageSizeSetter from "../shared/page/PageSizeSetter";
import PaginationApp from "../shared/page/PaginationApp";
import Navbar from "../shared/navbar/Navbar"; // Import Navbar component
import Footer from "../shared/footer/Footer"; // Import Footer component

const GetAllCustomers = () => {
  const [actionData, setActionData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalpage, setTotalpage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const GetAll = async () => {
    try {
      let response = await getAllCustomer(pageNumber, pageSize);
      setActionData(response.data.content);
      setTotalpage(Math.ceil(parseInt(response.headers["customer-count"]) / pageSize));
      setTotalElements(Math.ceil(parseInt(response.headers["customer-count"]) / pageSize));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetAll();
  }, [pageNumber, pageSize]);

  // Filter data based on search term
  const filteredData = actionData.filter(
    (customer) =>
      (customer.username && customer.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.id && customer.id.toString().includes(searchTerm))
  );

  return (
    <>
      {/* Header - Navbar */}
      <Navbar /> 

      {/* Main Content */}
      <div className="container my-5">
        <div className="background2 text-center display-3 py-3 text-white fw-bold">
          All Customers
        </div>
        <div className="row mb-3 align-items-center">
          <div className="col-md-4 offset-md-1">
            <PaginationApp
              totalpage={totalpage}
              setpage={setPageNumber}
              pageNumber={pageNumber}
            />
          </div>

          <div className="col-md-4 text-center">
            <input
              className="rounded-pill p-2 w-100 text-primary fw-bold"
              placeholder="Search by ID or Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
            />
          </div>

          <div className="col-md-2">
            <PageSizeSetter
              setPageSize={setPageSize}
              setTotalpage={setTotalpage}
              totalrecord={totalElements}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Table
              data={filteredData} // Use filtered data for displaying
              isDeleteButton={true}
              isUpdateButton={false}
              deleteFun={""}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default GetAllCustomers;
