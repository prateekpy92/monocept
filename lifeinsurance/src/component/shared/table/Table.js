import React from 'react';

function Tab({
    data,
    isUpdateButton,
    isDeleteButton,
    showMoreButton,
    isPayment,
    isDoc,
    isNominee,
    isClaim,
    isPay,
    isAproov,
    isReject,
    nomineeFun,
    claimFun,
    paymentFun,
    docFun,
    deleteFun,
    UpdateFun,
    detailFun,
    payFun,
    aproovFun,
    rejectFun,
}) {
    let headerdata = <></>;

    if (data.length > 0) {
        let key = Object.keys(data[0]);
        if (isUpdateButton) key.push('Update');
        if (isDeleteButton) key.push('Status');
        if (isDoc) key.push('Document');
        if (isPayment) key.push('Payment');
        if (showMoreButton) key.push('Details');
        if (isNominee) key.push('Nominee');
        if (isPay) key.push('Pay');
        if (isClaim) key.push('Claim');
        if (isAproov) key.push('Approve');
        if (isReject) key.push('Reject');

        headerdata = key.map((d) => <th key={d} style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{String(d).toUpperCase()}</th>);
    }

    let rowofusers = <></>;
    if (data.length > 0) {
        rowofusers = data.map((value, ind) => (
            <tr key={value.policyNo || ind}>
                {Object.values(value).map((t, idx) => (
                    <td key={idx} style={{ padding: '0.5rem' }}>{String(t).toUpperCase()}</td>
                ))}
                {isUpdateButton && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => UpdateFun(value)}
                        >
                            Update
                        </button>
                    </td>
                )}
                {isDeleteButton && (
                    <td>
                        <button
                            type="button"
                            className={`btn ${value.status==="Active" ? 'btn-outline-danger btn-sm' : 'btn-outline-success btn-sm'}`}
                            onClick={() => deleteFun(value)}
                        >
                            {value.status==="Active" ? 'Deactivate' : 'Activate'}
                        </button>
                    </td>
                )}
                {isDoc && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => docFun(value)}
                        >
                            Documents
                        </button>
                    </td>
                )}
                {isPayment && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => paymentFun(value)}
                        >
                            Payments
                        </button>
                    </td>
                )}
                {showMoreButton && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => detailFun(value)}
                        >
                            Details
                        </button>
                    </td>
                )}
                {isNominee && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => nomineeFun(value)}
                        >
                            Nominee
                        </button>
                    </td>
                )}
                {isPay && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => payFun(value)}
                        >
                            Pay
                        </button>
                    </td>
                )}
                {isClaim && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => claimFun(value)}
                        >
                            Claim
                        </button>
                    </td>
                )}
                {isAproov && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => aproovFun(value)}
                        >
                            Approve
                        </button>
                    </td>
                )}
                {isReject && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => rejectFun(value)}
                        >
                            Reject
                        </button>
                        
                    </td>
                    
                )}
            </tr>
        ));
    }

    return (
        <div style={{ overflowX: 'auto' }}> {/* Add a wrapper div to make table scrollable */}
            <table className="table table-sm table-bordered shadow-lg table-info" style={{ fontSize: '12px', tableLayout: 'fixed', width: '100%' }}> {/* Added table-sm and reduced font-size */}
                <thead>
                    <tr className="text-center">{headerdata}</tr>
                </thead>
                <tbody className="text-center">{rowofusers}</tbody>
            </table>
        </div>
    );
}

export default Tab;
