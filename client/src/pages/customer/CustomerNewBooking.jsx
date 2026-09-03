import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceCatalogService } from '../../services/serviceService';
import { customerPortalService } from '../../services/customerPortalService';
import Loader from '../../components/common/Loader';

export default function CustomerNewBooking() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    serviceCatalogService.getServices(true)
      .then((res) => {
        setServices(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleToggleService = (srv) => {
    const exists = selectedServices.find((s) => s.service_id === srv.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.service_id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, { service_id: srv.id, name: srv.name, base_price: parseFloat(srv.base_price), quantity: 1 }]);
    }
  };

  const estimatedTotal = selectedServices.reduce((sum, s) => sum + s.base_price * s.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one photography service.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await customerPortalService.requestBooking({
        event_date: eventDate,
        event_venue: eventVenue,
        special_requirements: specialRequirements,
        selected_services: selectedServices.map((s) => ({ service_id: s.service_id, quantity: s.quantity })),
      });
      navigate('/customer/bookings');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error requesting booking');
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading service options..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card border-0 shadow-sm p-4">
        <h4 className="fw-bold mb-1">Request a New Photo Session</h4>
        <p className="text-muted small mb-4">Choose your preferred services and date. Our studio team will review and confirm your session.</p>

        {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Event Date *</label>
              <input
                type="date"
                required
                className="form-control"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Venue / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. In-Studio or Hotel Grand Hall"
                className="form-control"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Select Services *</label>
            <div className="p-3 bg-light rounded border" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {services.map((srv) => {
                const isSelected = selectedServices.some((s) => s.service_id === srv.id);
                return (
                  <div key={srv.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div className="form-check mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id={`srv-${srv.id}`}
                        checked={isSelected}
                        onChange={() => handleToggleService(srv)}
                      />
                      <label className="form-check-label fw-semibold" htmlFor={`srv-${srv.id}`}>
                        {srv.name}
                        <small className="text-muted d-block">{srv.description}</small>
                      </label>
                    </div>
                    <span className="fw-bold text-dark">
                      ₹{Number(srv.base_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-white border rounded d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">Estimated Package Rate:</span>
            <h4 className="fw-bold text-primary mb-0">₹{estimatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Special Instructions or Notes</label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="Tell us about your event theme, schedule, or preferred photography style..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={submitting}>
            {submitting ? 'Submitting Request...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}