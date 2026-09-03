import { useState, useEffect } from 'react';
import { customerPortalService } from '../../services/customerPortalService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pay Modal
  const [payTarget, setPayTarget] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('upi');
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState('');

  const loadFinance = async () => {
    try {
      setLoading(true);
      const res = await customerPortalService.getFinance();
      setInvoices(res.data.data.invoices);
      setPayments(res.data.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const handleOpenPay = (inv) => {
    setPayTarget(inv);
    setPayAmount(inv.balance_amount);
    setPaySuccess('');
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setPaying(true);
    try {
      await customerPortalService.makePayment({
        booking_id: payTarget.booking_id,
        amount: parseFloat(payAmount),
        payment_method: payMethod,
      });
      setPaySuccess('Payment successful! Your receipt has been issued.');
      setTimeout(() => {
        setPayTarget(null);
        loadFinance();
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader message="Loading your billing statements..." />;

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Invoices & Online Payments</h4>
        <p className="text-muted small mb-0">Review billed invoices, settle remaining balances, and download official payment receipts</p>
      </div>

      {/* Invoices */}
      <h6 className="fw-bold mb-3"><i className="bi bi-file-earmark-text text-primary me-2"></i>My Invoices</h6>
      {invoices.length === 0 ? (
        <EmptyState icon="bi-receipt" title="No Invoices" message="No invoices have been billed to your account." />
      ) : (
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Invoice #</th>
                    <th>Booking</th>
                    <th>Total Billed</th>
                    <th>Paid Amount</th>
                    <th>Remaining Due</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Online Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="ps-4"><code>{inv.invoice_number}</code></td>
                      <td>Booking #{inv.booking_number}</td>
                      <td>₹{Number(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="text-success fw-semibold">₹{Number(inv.paid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className={`fw-bold ${Number(inv.balance_amount) > 0 ? 'text-danger' : 'text-muted'}`}>
                        ₹{Number(inv.balance_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${inv.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'} text-uppercase`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        {Number(inv.balance_amount) > 0 ? (
                          <button className="btn btn-sm btn-primary" onClick={() => handleOpenPay(inv)}>
                            <i className="bi bi-credit-card me-1"></i>Pay Now
                          </button>
                        ) : (
                          <span className="badge bg-light text-success border"><i className="bi bi-check-all me-1"></i>Paid in Full</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Receipts */}
      <h6 className="fw-bold mb-3"><i className="bi bi-receipt text-success me-2"></i>My Payment Receipts</h6>
      {payments.length === 0 ? (
        <EmptyState icon="bi-check-circle" title="No Receipts" message="Completed payments will record here." />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Receipt #</th>
                    <th>Booking</th>
                    <th>Amount Paid</th>
                    <th>Payment Method</th>
                    <th>Reference</th>
                    <th className="text-end pe-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4"><code>{p.payment_number}</code></td>
                      <td>Booking #{p.booking_number}</td>
                      <td className="fw-bold text-success">₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td><span className="badge bg-light text-dark border text-uppercase">{p.payment_method}</span></td>
                      <td className="small text-muted">{p.transaction_reference}</td>
                      <td className="text-end pe-4 small text-muted">{new Date(p.paid_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
      {payTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handlePaySubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Settle Invoice: {payTarget.invoice_number}</h5>
                  <button type="button" className="btn-close" onClick={() => setPayTarget(null)}></button>
                </div>
                <div className="modal-body p-4">
                  {paySuccess ? (
                    <div className="alert alert-success text-center py-3">
                      <i className="bi bi-check-circle-fill fs-3 d-block mb-1"></i>
                      {paySuccess}
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-light rounded border mb-3">
                        <span className="text-muted small d-block">Outstanding Balance</span>
                        <h4 className="fw-bold text-danger mb-0">₹{Number(payTarget.balance_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Payment Amount (₹) *</label>
                        <input
                          type="number"
                          step="0.01"
                          max={payTarget.balance_amount}
                          required
                          className="form-control"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                        />
                      </div>

                      <div className="mb-0">
                        <label className="form-label small fw-semibold">Choose Payment Method *</label>
                        <select
                          className="form-select"
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value)}
                        >
                          <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                          <option value="card">Credit / Debit Card</option>
                          <option value="bank_transfer">Net Banking (NEFT/RTGS)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                {!paySuccess && (
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-light" onClick={() => setPayTarget(null)}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={paying}>
                      {paying ? 'Authorizing Payment...' : `Pay ₹${payAmount || 0}`}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}