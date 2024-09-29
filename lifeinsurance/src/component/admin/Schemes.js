import React, { useEffect, useState } from "react";
import Navbar from "../shared/navbar/Navbar";
import Footer from "../shared/footer/Footer";
import {
  allPlans,
  getSchemeByPlanId,
  getSchemedetail,
} from "../../services/admin/AdminServices";
import Table from "../../component/shared/table/Table";
import AddScheme from "../../component/scheme/AddScheme";
import UpdateScheme from "../scheme/UpdateScheme";

const Schemes = () => {
  const [plans, setPlans] = useState([]);
  const [value, setValue] = useState(0);
  const [scheme, setScheme] = useState([]);
  const [detail, setDetail] = useState([]);
  const [id, setId] = useState(0);
  const [docs, setDocs] = useState([]);
  const [schemeShow, setSchemeShow] = useState(false);
  const [update, setUpdate] = useState(null);
  const [action, setAction] = useState(false);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAllPlan = async () => {
    setLoading(true);
    try {
      let response = await allPlans(0, 30);
      setPlans(response.data.content);
    } catch (err) {
      setError('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const getSchemeData = async () => {
    if (!value) return;
    setLoading(true);
    try {
      let response = await getSchemeByPlanId(value);
      setScheme(response.data);
      setShow(true);
      setAction(false);
      setId(0);
    } catch (err) {
      setError('Failed to fetch schemes for the selected plan');
    } finally {
      setLoading(false);
    }
  };

  const showDetail = async (scheme) => {
    setId(scheme.id);
    setLoading(true);
    try {
      let response = await getSchemedetail(scheme.id);
      setImage(response.data.schemeImage);
      setDocs(response.data.requierdDocs);
      setDetail([{
        MinAge: response.data.minAge,
        MaxAge: response.data.maxAge,
        MinAmount: response.data.minAmount,
        MaxAmount: response.data.maxAmount,
        MinDuration: response.data.minDuration,
        MaxDuration: response.data.maxDuration,
      }]);
    } catch (err) {
      setError('Failed to fetch scheme details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (detail) => {
    const selectedScheme = scheme.find(s => s.schemeId === detail.id);
    setUpdate(selectedScheme);
    setAction(true);
    setShow(false);
    setId(0);
  };

  useEffect(() => {
    getAllPlan();
  }, []);

  useEffect(() => {
    getSchemeData();
  }, [value]);

  return (
    <>
      <Navbar />
      <div className="container uniform-layout">
        <div className="row my-5">
          <div className="col-md-6 offset-md-3">
            <select
              className="form-select"
              aria-label="Select a Plan"
              onChange={(e) => {
                setValue(e.target.value);
                setSchemeShow(false);
              }}
            >
              <option selected value="plan">Select A Plan</option>
              {plans.map((plan) => (
                <option key={plan.planId} value={plan.planId}>{plan.planName}</option>
              ))}
            </select>
          </div>
          {!schemeShow && (
            <div className="row mt-4">
              <div className="col text-center">
                <button
                  className="btn btn-lg btn-primary fw-bold rounded-pill"
                  onClick={() => setSchemeShow(true)}
                >
                  Add Scheme
                </button>
              </div>
            </div>
          )}
          {schemeShow && <AddScheme />}
        </div>

        {loading && <div className="text-center my-4 spinner-border text-primary" role="status"></div>}  {/* Updated loading message */}

        {error && <div className="text-danger text-center my-3 fw-bold">{error}</div>}  {/* Error Message */}

        {show && (
          <div>
            <div className="col-12 text-center bg-dark text-white py-2">
              <h2>Schemes</h2>
            </div>
            {value !== 0 ? (
              <Table
                data={scheme}
                isUpdateButton={true}
                isDeleteButton={true}
                showMoreButton={true}
                UpdateFun={handleUpdate}
                detailFun={showDetail}
              />
            ) : (
              <div className="text-danger text-center fw-bold">No Plan Selected</div>
            )}
            {id !== 0 && (
              <div className="row mt-5">
                <div className="col-md-6">
                  <table className="table table-striped shadow-sm">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Required Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map((doc, index) => (
                        <tr key={index}>
                          <td>{doc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6 text-center">
                  <img
                    src={`http://localhost:8081/insuranceapp/download?file=${image}`}
                    alt="scheme"
                    className="img-fluid shadow-lg"
                    style={{ height: "auto", width: "100%" }}
                  />
                </div>
              </div>
            )}
            {id !== 0 && (
              <Table
                data={detail}
                isUpdateButton={false}
                isDeleteButton={false}
                showMoreButton={false}
              />
            )}
          </div>
        )}
        {action && <UpdateScheme data={update} />}
      </div>
      <Footer />

      {/* CSS for Uniform Layout */}
      <style jsx="true">{`
        .uniform-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .form-select {
          padding: 10px;
          border-radius: 25px;
          border: 2px solid #007bff;
          font-size: 16px;
        }

        .form-select:focus {
          border-color: #0056b3;
          outline: none;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        .btn-primary {
          padding: 10px 20px;
          font-size: 18px;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #0056b3;
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
        }

        .table {
          width: 100%;
          background-color: white;
          border-collapse: collapse;
          margin-bottom: 20px;
          border-radius: 5px;
          overflow: hidden;
        }

        .table th,
        .table td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .table th {
          background-color: #007bff;
          color: white;
        }

        .table tbody tr:hover {
          background-color: #f1f1f1;
        }

        .img-fluid {
          max-width: 100%;
          height: auto;
          border-radius: 5px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
      `}</style>
    </>
  );
};

export default Schemes;
