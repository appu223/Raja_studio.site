export default function EmptyState({ icon = 'bi-inbox', title = 'No data found', message = 'There are no records to display at this time.' }) {
  return (
    <div className="text-center p-5 bg-white rounded border">
      <i className={`bi ${icon} text-muted`} style={{ fontSize: '3rem' }}></i>
      <h6 className="mt-3 fw-bold">{title}</h6>
      <p className="text-muted small mb-0">{message}</p>
    </div>
  );
}