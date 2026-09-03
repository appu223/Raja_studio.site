export default function ConfirmModal({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmVariant = 'danger' }) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0 text-muted">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
            <button type="button" className={`btn btn-${confirmVariant}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}