export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-2 small">{message}</p>
    </div>
  );
}