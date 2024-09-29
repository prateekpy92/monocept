import React, { useState, useEffect } from 'react';

function GetAllPolicies() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [data, setData] = useState([]);

  const GetPolicies = async () => {
    try {
      let response = await AllPolicies(pageNumber, pageSize);
      console.log("policies are ------------>", response);
      console.log("Response data content:", response.data.content);
      setData(response.data.content || []); 
      
    } catch (error) {
      console.error("Failed to fetch policies:", error);
      setData([]); 
    }
  };

  useEffect(() => {
    GetPolicies();
  }, [pageNumber, pageSize]);

  return (
    <div>get all policies</div>
  );
}

export default GetAllPolicies;
