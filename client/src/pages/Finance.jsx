import { useState, useEffect } from 'react';
import { financeService } from '../services/financeService';
import { bookingService } from '../services/bookingService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'payments' | 'expenses'
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentType, setPaymentType] = useState('advance');
  const [transactionRef, setTransactionRef] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState('Equipment Maintenance');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const [invRes, payRes, expRes] = await Promise.all([
        financeService.getInvoices(),
        financeService.getPayments(),
        financeService.getExpenses(),
      ]);
      setInvoices(invRes.data.data);
      setPayments(payRes.data.data);
      setExpenses(expRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const handleOpenPaymentModal = async () => {
    setPaymentError('');
    try {
      const res = await bookingService.getAll('');
      setBookings(res.data.data);
      setSelectedBooking('');
      setPaymentAmount('');
      setTransactionRef('');
      setShowPaymentModal(true);
    } catch (err) {
      alert('Could not fetch bookings list');
    }
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPayment(true);
    setPaymentError('');
    try {
      await financeService.recordPayment({
        booking_id: parseInt(selectedBooking, 10),
        amount: parseFloat(paymentAmount),
        payment_type: paymentType,
        payment_method: paymentMethod,
        transaction_reference: transactionRef,
      });
      setShowPaymentModal(false);
      loadFinancialData();
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment recording failed');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleRecordExpenseSubmit = async (e) => {
    e.preventDefault();
    setSubmittingExpense(true);
    try {
      await financeService.createExpense({
        category: expenseCategory,
        description: expenseDesc,
        amount: parseFloat(expenseAmount),
        expense_date: expenseDate,
      });
      setShowExpenseModal(false);
      setExpenseDesc('');
      setExpenseAmount('');
      loadFinancialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording expense');
    } finally {
      setSubmittingExpense(false);
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const totalReceivables = invoices.reduce((sum, i) => sum + parseFloat(i.balance_amount), 0);

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Financial Ledgers & Revenue</h4>
          <p className="text-muted small mb-0">Record advance/balance receipts, generate client invoices, and track studio expenses</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={() => setShowExpenseModal(true)}>
            <i className="bi bi-dash-circle me-1"></i>Record Expense
          </button>
          <button className="btn btn-primary" onClick={handleOpenPaymentModal}>
            <i className="bi bi-plus-circle me-1"></i>Collect Payment
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Total Realized Revenue</span>
            <h3 className="fw-bold text-success my-1">
              ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <small className="text-muted">{payments.length} verified transactions</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Outstanding Receivables</span>
            <h3 className="fw-bold text-danger my-1">
              ₹{totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <small className="text-muted">Unpaid client balances</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <span className="text-muted small">Total Operating Expenses</span>
            <h3 className="fw-bold text-dark my-1">
              ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <small className="text-muted">{expenses.length} ledger expense entries</small>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-2 d-flex gap-2">
          <button
            className={`btn btn-sm ${activeTab === 'invoices' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('invoices')}
          >
            <i className="bi bi-file-earmark-text me-1"></i> Invoices ({invoices.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'payments' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="bi bi-receipt me-1"></i> Payment Receipts ({payments.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'expenses' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveTab('expenses')}
          >
            <i className="bi bi-wallet2 me-1"></i> Expenses ({expenses.length})
          </button>
        </div>
      </div>

      {/* Tables based on selected tab */}
      {loading ? (
        <Loader message="Loading financial ledgers..." />
      ) : activeTab === 'invoices' ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {invoices.length === 0 ? (
              <EmptyState icon="bi-file-earmark" title="No Invoices" message="Invoices are automatically created when bookings or payments are generated." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Invoice #</th>
                      <th>Client</th>
                      <th>Total Amount</th>
                      <th>Paid Amount</th>
                      <th>Balance Due</th>
                      <th>Due Date</th>
                      <th className="text-end pe-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="ps-4">
                          <code>{inv.invoice_number}</code>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{inv.customer_name}</div>
                          <small className="text-muted">Booking #{inv.booking_number}</small>
                        </td>
                        <td>₹{Number(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="text-success fw-semibold">₹{Number(inv.paid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className={`fw-bold ${Number(inv.balance_amount) > 0 ? 'text-danger' : 'text-muted'}`}>
                          ₹{Number(inv.balance_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="small text-muted">{new Date(inv.due_date).toLocaleDateString()}</td>
                        <td className="text-end pe-4">
                          <span className={`badge ${inv.status === 'paid' ? 'bg-success' : inv.status === 'partial' ? 'bg-warning text-dark' : 'bg-danger'} text-uppercase`}>
                            {inv.status}
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
      ) : activeTab === 'payments' ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {payments.length === 0 ? (
              <EmptyState icon="bi-receipt" title="No Payments Recorded" message="Record an advance or balance payment to update receivables." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Receipt #</th>
                      <th>Client & Booking</th>
                      <th>Amount Received</th>
                      <th>Type</th>
                      <th>Method</th>
                      <th>Reference</th>
                      <th className="text-end pe-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="ps-4">
                          <span className="badge bg-light text-dark border"><code>{p.payment_number}</code></span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{p.customer_name}</div>
                          <small className="text-muted">Booking #{p.booking_number}</small>
                        </td>
                        <td className="fw-bold text-success fs-6">
                          ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td><span className="badge bg-secondary text-uppercase">{p.payment_type}</span></td>
                        <td>
                          <span className="badge bg-light text-dark border text-uppercase">{p.payment_method}</span>
                        </td>
                        <td className="small text-muted">{p.transaction_reference || '—'}</td>
                        <td className="text-end pe-4 small text-muted">
                          {new Date(p.paid_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {expenses.length === 0 ? (
              <EmptyState icon="bi-wallet" title="No Expenses Logged" message="Log studio expenses to evaluate profit/loss performance." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Expense Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th className="text-end pe-4">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e.id}>
                        <td className="ps-4">
                          <span className="badge bg-info bg-opacity-10 text-dark border">{e.category}</span>
                        </td>
                        <td>{e.description}</td>
                        <td className="fw-bold text-dark">
                          ₹{Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="small text-muted">{new Date(e.expense_date).toLocaleDateString()}</td>
                        <td className="text-end pe-4 small text-muted">{e.recorded_by_name || 'Admin'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleRecordPaymentSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Record Customer Payment</h5>
                  <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {paymentError && <div className="alert alert-danger py-2 small">{paymentError}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Booking *</label>
                    <select
                      className="form-select"
                      required
                      value={selectedBooking}
                      onChange={(e) => setSelectedBooking(e.target.value)}
                    >
                      <option value="">-- Choose Booking --</option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          #{b.booking_number} — {b.customer_name} (Total: ₹{b.total_amount})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Amount Received (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        required
                        placeholder="10000"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Payment Method *</label>
                      <select
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="upi">UPI / GPay / PhonePe</option>
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                        <option value="card">Card (POS Terminal)</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Payment Type</label>
                      <select
                        className="form-select"
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                      >
                        <option value="advance">Advance Payment</option>
                        <option value="milestone">Milestone / Partial</option>
                        <option value="balance">Full & Final Balance</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Reference ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="UPI Ref / Txn ID"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submittingPayment}>
                    {submittingPayment ? 'Processing...' : 'Issue Payment Receipt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <form onSubmit={handleRecordExpenseSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Record Studio Expenditure</h5>
                  <button type="button" className="btn-close" onClick={() => setShowExpenseModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Expense Category *</label>
                    <select
                      className="form-select"
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                    >
                      <option value="Equipment Maintenance">Equipment Maintenance</option>
                      <option value="Studio Operations">Studio Operations & Utilities</option>
                      <option value="Freelance Crew Payments">Freelance Crew Payments</option>
                      <option value="Travel & Logistics">Travel & Logistics</option>
                      <option value="Printing & Framing">Printing, Paper & Framing</option>
                      <option value="Refreshments & Client Hospitality">Refreshments & Hospitality</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Taxi fare for destination pre-wedding shoot"
                      value={expenseDesc}
                      onChange={(e) => setExpenseDesc(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-0">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Amount (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        required
                        placeholder="1500"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Expense Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger" disabled={submittingExpense}>
                    {submittingExpense ? 'Saving...' : 'Save Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}