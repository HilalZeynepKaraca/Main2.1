import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, LabelList } from "recharts";
import { useNavigate } from "react-router-dom";
import hastalar from "./hastalar";

const DoktorGirisPage = () => {
  const [hastaSayisi, setHastaSayisi] = useState(0);
  const [tc, setTc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setHastaSayisi(hastalar.length); // Gerçek hasta sayısını ayarla
  }, []);

  const handleSearch = () => {
    const hasta = hastalar.find((h) => h.tc === tc.trim());

    if (hasta) {
      navigate("/hasta-gecmis", {
        state: {
          tc: hasta.tc,
          adSoyad: hasta.ad,
        },
      });
    } else {
      alert("TC bulunamadı!");
    }
  };

  // EVRELERİN DİNAMİK HESABI (sıfır olan evreler filtreleniyor)
  const evreler = ["F0", "F1", "F2", "F3", "F4"];

  const rawData = evreler
    .map((evre) => ({
      name: evre,
      value: hastalar.filter((h) => h.evre === evre).length,
    }))
    .filter((item) => item.value > 0);

  const total = rawData.reduce((sum, item) => sum + item.value, 0);

  const data = rawData.map((item) => ({
    ...item,
    percent: total === 0 ? 0 : ((item.value / total) * 100).toFixed(1),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AB47BC"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "white",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <p>{`${payload[0].name}: ${payload[0].value} hasta (%${payload[0].payload.percent})`}</p>
        </div>
      );
    }
    return null;
  };

  const renderOuterLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "13px" }}
      >
        {`${name} (${value})`}
      </text>
    );
  };

  const renderInnerPercentage = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "13px", fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>Doktor Paneli</h2>
      </div>

      <div style={styles.gridTop}>
        <div style={styles.squareCard}>
          <div style={styles.centeredContent}>
            <div style={styles.sayac}>{hastaSayisi}</div>
            <h3 style={{ ...styles.centeredTitle, marginTop: "10px" }}>
              Kayıtlı Hasta
            </h3>
            <button
              style={styles.hastaButton}
              onClick={() => navigate("/hasta-listesi")}
            >
              Tüm Hastaları Gör
            </button>
          </div>
        </div>

        <div style={styles.squareCard}>
          <h3 style={styles.centeredTitle}>Hasta Arama</h3>
          <div style={styles.centeredContent}>
            <div style={styles.centeredSearchBox}>
              <input
                type="text"
                placeholder="TC Kimlik Numarası"
                value={tc}
                onChange={(e) => setTc(e.target.value)}
                style={styles.tcInput}
              />
              <button onClick={handleSearch} style={styles.tcButton}>
                Ara
              </button>
            </div>
          </div>
        </div>

        <div style={styles.squareCard}>
          <h3 style={styles.centeredTitle2}>Evrelere Göre Dağılım</h3>
          <div style={styles.graphContainer}>
            <PieChart width={300} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={90}
                labelLine={false}
                label={renderOuterLabel}
                dataKey="value"
                onClick={(data) => {
                  navigate("/evre-detay", {
                    state: { evre: data.name },
                  });
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList content={renderInnerPercentage} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>

            <div style={styles.legendList}>
              {data.map((entry, index) => (
                <div key={index} style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendColor,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></span>
                  {`${entry.name} (%${entry.percent})`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.gridBottom}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📝 Notlar</h3>
          <p>- Hastaların raporları güncellenmeli</p>
          <p>- Takım toplantısı: 15:00</p>
          <p>- F1 evresi için analiz bekleniyor</p>
          <p>- Yeni veri seti eklenecek</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🧾 Konsültasyon</h3>
          <p>- Bekleyen hastalar: 5</p>
          <p>- Son konsültasyon: 14:30</p>
          <p>- Uzman onayı bekleniyor</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    width: "100vw",
    overflowX: "hidden",
  },
  navbar: {
    backgroundColor: "#213448",
    padding: "20px",
    color: "white",
    textAlign: "center",
  },
  navTitle: {
    margin: 0,
    fontSize: "26px",
  },
  gridTop: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    padding: "20px",
  },
  gridBottom: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    padding: "20px",
  },
  centeredTitle2: {
    textAlign: "center",
    color: "#213448",
    fontSize: "25px",
    marginBottom: "12px",
    marginTop: "20px",
  },
  squareCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    height: "300px",
    display: "flex",
    flexDirection: "column",
  },
  centeredTitle: {
    textAlign: "center",
    color: "#213448",
    fontSize: "25px",
    marginBottom: "12px",
    marginTop: "80px",
  },
  chartTitle: {
    fontSize: "25px",
    color: "#213448",
    textAlign: "center",
    marginBottom: "10px",
    marginTop: "80px",
  },
  centeredContent: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  centeredSearchBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  sayac: {
    fontSize: "42px",
    fontWeight: "bold",
    color: "#213448",
  },
  tcInput: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "200px",
  },
  tcButton: {
    padding: "10px 20px",
    backgroundColor: "#213448",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  graphContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  legendList: {
    display: "flex",
    flexDirection: "column",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    marginBottom: "6px",
  },
  legendColor: {
    width: "14px",
    height: "14px",
    marginRight: "8px",
    borderRadius: "3px",
    display: "inline-block",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    color: "#213448",
    fontSize: "20px",
    marginBottom: "12px",
  },
  hastaButton: {
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#213448",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default DoktorGirisPage;
