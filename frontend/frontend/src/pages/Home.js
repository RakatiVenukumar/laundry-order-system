export default function Home() {
  return (
    <div className="card" style={{maxWidth:700,margin:'2.5rem auto'}}>
      <h1 style={{color:'#312e81',fontWeight:800,marginBottom:8}}>Laundry System Home</h1>
      <p style={{fontSize:'1.18rem',marginBottom:18}}>Welcome! Start building your laundry system frontend here.</p>
      <ul style={{fontSize:'1.08rem',lineHeight:2}}>
        <li>Place and manage laundry orders</li>
        <li>Search orders by garment type</li>
        <li>Track estimated delivery dates</li>
        <li>View dashboard analytics</li>
      </ul>
    </div>
  );
}