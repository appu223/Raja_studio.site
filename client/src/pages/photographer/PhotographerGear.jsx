import { useState, useEffect } from 'react';
import { staffPortalService } from '../../services/staffPortalService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function PhotographerGear() {
  const [gear, setGear] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffPortalService.getPhotographerGear()
      .then((res) => {
        setGear(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader message="Checking equipment custody..." />;

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Equipment in My Custody</h4>
        <p className="text-muted small mb-0">Lenses, camera bodies, and lighting gear currently checked out under your responsibility</p>
      </div>

      {gear.length === 0 ? (
        <EmptyState icon="bi-box" title="No Gear Checked Out" message="All studio equipment has been returned to the studio locker." />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Asset Tag</th>
                    <th>Equipment Name</th>
                    <th>Category</th>
                    <th>Checked Out At</th>
                    <th className="text-end pe-4">Condition on Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {gear.map((g) => (
                    <tr key={g.id}>
                      <td className="ps-4"><code>{g.asset_tag}</code></td>
                      <td className="fw-semibold text-dark">{g.equipment_name}</td>
                      <td><span className="badge bg-light text-dark border">{g.category}</span></td>
                      <td className="small text-muted">{new Date(g.checkout_time).toLocaleString()}</td>
                      <td className="text-end pe-4 small text-muted">{g.condition_on_checkout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}