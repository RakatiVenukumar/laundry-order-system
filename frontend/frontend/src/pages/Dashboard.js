export default function Dashboard() {
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Summary and estimated delivery date features coming soon.</p>
        <ul>
          <li>Total Orders: <strong>12</strong></li>
          <li>Orders in Progress: <strong>3</strong></li>
          <li>Delivered Today: <strong>2</strong></li>
          <li>Next Estimated Delivery: <strong>2026-04-21</strong></li>
        </ul>
        <p style={{marginTop: '1rem'}}>Summary and analytics coming soon.</p>
    </div>
  );
}