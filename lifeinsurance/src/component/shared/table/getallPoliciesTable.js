import React from 'react';

function CustomTable({
  data,
  isDoc,
  isPayment,  // This keeps the Payments button functionality
  showMoreButton,
  isNominee,
  docFun,
  paymentFun,
  detailFun,
  nomineeFun,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-sm table-bordered shadow-lg table-info" style={{ fontSize: '12px', tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr className="text-center">
            <th scope="col">POLICYNO</th>
            <th scope="col">USERNAME</th>
            <th scope="col">SCHEMENAME</th>
            <th scope="col">STATUS</th>
            {/* Payments column removed */}
            {isDoc && <th scope="col">DOCUMENT</th>}
            {showMoreButton && <th scope="col">DETAILS</th>}
            {isNominee && <th scope="col">NOMINEE</th>}
            {isPayment && <th scope="col">PAYMENT</th>} {/* Payments button only */}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.policyNo}</td>
              <td>{item.Username}</td>
              <td>{item.SchemeName}</td>
              <td>{item.Status}</td>
              {isDoc && (
                <td>
                  <button className="btn btn-outline-success btn-sm" onClick={() => docFun(item)}>
                    Documents
                  </button>
                </td>
              )}
              {showMoreButton && (
                <td>
                  <button className="btn btn-outline-success btn-sm" onClick={() => detailFun(item)}>
                    Details
                  </button>
                </td>
              )}
              {isNominee && (
                <td>
                  <button className="btn btn-outline-success btn-sm" onClick={() => nomineeFun(item)}>
                    Nominee
                  </button>
                </td>
              )}
              {isPayment && (
                <td>
                  <button className="btn btn-outline-success btn-sm" onClick={() => paymentFun(item)}>
                    Payments
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
