import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Reports() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getRevenueReport()
      .then((res) => {
        setRevenueData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Business Analytics & Financial Audits</h4>
          <p className="text-muted small mb-0">Monthly cash flow trends, transaction volumes, and receivables breakdown</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => window.print()}>
          <i className="bi bi-printer me-1"></i>Print Audit Summary
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-bold">
          <i className="bi bi-calendar3 text-primary me-2"></i>Monthly Revenue & Collection History
        </div>
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Compiling financial report..." />
          ) : revenueData.length === 0 ? (
            <EmptyState icon="bi-graph-down" title="No Revenue Records" message="Verified payments will appear here grouped by month." />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Billing Month</th>
                    <th>Transactions Processed</th>
                    <th>Net Collected Volume</th>
                    <th className="text-end pe-4">Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="ps-4 fw-bold text-dark">
                        <i className="bi bi-calendar2-check text-primary me-2"></i>
                        {row.month}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {row.transactions} receipts
                        </span>
                      </td>
                      <td className="fw-bold text-success fs-6">
                        ₹{Number(row.revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-end pe-4">
                        <span className="badge bg-success bg-opacity-10 text-success border">
                          Reconciled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}