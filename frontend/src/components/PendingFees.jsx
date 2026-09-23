import "../styles/WidgetCards.css";

const fees = [
  { name: "Areeba Ansari", info: "1-A · Examination Fee — Half Yearly · Aug 2026", amount: "₹800" },
  { name: "Ayesha Siddiqui", info: "1-A · Examination Fee — Half Yearly · Aug 2026", amount: "₹800" },
  { name: "Aditi Sharma", info: "1-B · Examination Fee — Half Yearly · Aug 2026", amount: "₹800" },
  { name: "Danish Rastogi", info: "1-A · Examination Fee — Half Yearly · Aug 2026", amount: "₹800" },
  { name: "Anas Kashyap", info: "1-A · Examination Fee — Half Yearly · Aug 2026", amount: "₹800" },
];

export default function PendingFees() {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3 className="widget-title">Pending Fees</h3>
        <span className="pending-badge">10 pending</span>
      </div>
      <div className="fee-list">
        {fees.map((fee, i) => (
          <div key={i} className="fee-item">
            <div className="fee-avatar">
              {fee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="fee-info">
              <span className="fee-name">{fee.name}</span>
              <span className="fee-meta">{fee.info}</span>
            </div>
            <div className="fee-right">
              <span className="fee-status">pending</span>
              <span className="fee-amount">{fee.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
