import { useState, useEffect } from "react";
import api from "../../services/api.js";
import styles from "./AdminPayments.module.css";
import {
  FaWallet,
  FaHistory,
  FaSearch,
  FaFileInvoice,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

function AdminPaymentManagement() {
  const [allPayments, setAllPayments] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/payments");
        setAllPayments(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedPropertyId(res.data.data[0].Rental?.Property?.id);
        }
        setLoading(false);
      } catch (err) {
        console.error("Ödemeler yüklenemedi:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Benzersiz mülkleri ayıkla
  const uniqueProperties = Array.from(
    new Map(
      allPayments.map((p) => [p.Rental?.Property?.id, p.Rental?.Property])
    ).values()
  ).filter((prop) =>
    prop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = allPayments.filter(
    (p) => p.Rental?.Property?.id === selectedPropertyId
  );

  const getStatusInfo = (status) => {
    const s = status ? status.toLowerCase().trim() : ""; // Boşlukları da temizle
    switch (s) {
      case "paid":
        return { icon: <FaCheckCircle />, text: "Ödendi", class: styles.paid };
      case "waiting_approval":
        return {
          icon: <FaClock />,
          text: "Onay Bekliyor",
          class: styles.waiting,
        };
      case "overdue":
      case "delayed":
        return {
          icon: <FaExclamationTriangle />,
          text: "Gecikti",
          class: styles.delayed,
        };
      default:
        return { icon: <FaClock />, text: "Beklemede", class: styles.pending };
    }
  };

  if (loading)
    return <div className={styles.loader}>Finansal veriler yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <FaWallet /> Global Ödeme Denetimi
        </h1>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="Mülk ismine göre filtrele..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.propertySidebar}>
          <h3>Mülkler</h3>
          <div className={styles.propertyList}>
            {uniqueProperties.map((prop) => (
              <div
                key={prop.id}
                className={`${styles.propItem} ${
                  selectedPropertyId === prop.id ? styles.activeProp : ""
                }`}
                onClick={() => setSelectedPropertyId(prop.id)}
              >
                <strong>{prop.title}</strong>
                <small>Danışman: {prop.Agent?.first_name}</small>
              </div>
            ))}
          </div>
        </aside>

        <main className={styles.detailArea}>
          {selectedPropertyId ? (
            <>
              <div className={styles.detailHeader}>
                <h2>
                  <FaHistory /> Kira Ödeme Geçmişi
                </h2>
                <div className={styles.statsRow}>
                  <div className={styles.miniStat}>
                    <span>Toplam Kira:</span>
                    <strong>{filteredPayments.length} Ay</strong>
                  </div>
                  <div className={styles.miniStat}>
                    <span>Tahsil Edilen:</span>
                    <strong className={styles.greenText}>
                      {filteredPayments
                        .filter((p) => p.status?.toLowerCase() === "paid")
                        .reduce((sum, p) => sum + Number(p.amount || 0), 0)
                        .toLocaleString("tr-TR")}{" "}
                      TL
                    </strong>
                  </div>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Vade Tarihi</th>
                    <th>Kiracı</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>Dekont</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => {
                    const status = getStatusInfo(p.status);
                    return (
                      <tr key={p.id}>
                        <td data-label="Vade Tarihi">
                          {new Date(p.due_date).toLocaleDateString("tr-TR")}
                        </td>
                        <td data-label="Kiracı">
                          {p.Rental?.Tenant?.first_name}{" "}
                          {p.Rental?.Tenant?.last_name}
                        </td>
                        <td data-label="Tutar">
                          <strong>
                            {Number(p.amount).toLocaleString()} TL
                          </strong>
                        </td>
                        <td data-label="Durum">
                          <div
                            className={`${styles.statusBadge} ${status.class}`}
                          >
                            {status.icon} <span>{status.text}</span>
                          </div>
                        </td>
                        <td data-label="Dekont">
                          {p.receipt_url ? (
                            <a
                              href={`http://localhost:5001/uploads/receipts/${p.receipt_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.viewLink}
                            >
                              <FaFileInvoice /> Görüntüle
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div className={styles.noSelection}>
              Lütfen detaylarını görmek istediğiniz bir mülk seçin.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminPaymentManagement;
