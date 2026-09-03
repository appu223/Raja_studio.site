export default function StatusBadge({ status }) {
  const map = {
    draft: 'bg-secondary',
    confirmed: 'bg-primary',
    staff_assigned: 'bg-info text-dark',
    shoot_scheduled: 'bg-warning text-dark',
    shoot_completed: 'bg-primary',
    editing: 'bg-indigo text-white',
    gallery_ready: 'bg-success',
    delivered: 'bg-success',
    closed: 'bg-dark',
    cancelled: 'bg-danger',
    connected: 'bg-success',
    disconnected: 'bg-danger',
  };

  const badgeClass = map[status?.toLowerCase()] || 'bg-secondary';
  return (
    <span className={`badge ${badgeClass} text-uppercase px-2 py-1`} style={{ letterSpacing: '0.5px' }}>
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
}