export const styles = {
    container: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      borderBottom: "1px solid #eaeaea",
      paddingBottom: "16px"
    },
    title: {
      color: "#2c3e50",
      margin: "0",
      fontSize: "28px"
    },
    card: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      padding: "20px",
      marginBottom: "20px"
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.3s ease"
    },
    primaryButton: {
      background: "#7e46d2",
      color: "white",
      "&:hover": {
        background: "#2980b9"
      }
    },
    dangerButton: {
      background: "#e74c3c",
      color: "white",
      "&:hover": {
        background: "#c0392b"
      }
    },
    secondaryButton: {
      background: "#ecf0f1",
      color: "#2c3e50",
      "&:hover": {
        background: "#bdc3c7"
      }
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "16px"
    },
    tableHeader: {
      background: "#7e46d2",
      color: "white",
      padding: "12px",
      textAlign: "left",
      fontWeight: "500"
    },
    tableCell: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "1px solid #ecf0f1"
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #bdc3c7",
      marginBottom: "16px",
      fontSize: "14px"
    },
    tabContainer: {
      display: "flex",
      marginBottom: "20px",
      borderBottom: "1px solid #bdc3c7"
    },
    tab: {
      padding: "10px 20px",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      fontWeight: "500",
      color: "#7f8c8d",
      transition: "all 0.3s ease"
    },
    activeTab: {
      color: "#7e46d2",
      borderBottom: "3px solid #7e46d2"
    },
    loading: {
      textAlign: "center",
      padding: "20px",
      color: "#7f8c8d"
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#7f8c8d",
      fontSize: "16px"
    },
    detailItem: {
      background: "#f8f9fa",
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "8px"
    },
    detailLabel: {
      fontSize: "12px",
      color: "#7f8c8d",
      marginBottom: "4px"
    },
    detailValue: {
      fontWeight: "500",
      color: "#2c3e50"
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "16px",
      marginTop: "16px"
    }
  };