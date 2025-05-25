export const styles = {
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    padding: "28px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
    border: "1px solid #f0f0f0",
    '&:hover': {
      boxShadow: "0 6px 24px rgba(0,0,0,0.12)"
    }
  },
  title: {
    color: "#2c3e50",
    margin: "0 0 24px 0",
    fontSize: "24px",
    fontWeight: "600",
    position: "relative",
    paddingBottom: "12px",
    '&:after': {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "60px",
      height: "4px",
      background: "linear-gradient(90deg, #7e46d2, #a55eea)",
      borderRadius: "2px"
    }
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backgroundColor: "#f8fafc",
    '&:focus': {
      outline: "none",
      borderColor: "#7e46d2",
      boxShadow: "0 0 0 3px rgba(126, 70, 210, 0.1)",
      backgroundColor: "white"
    },
    '&::placeholder': {
      color: "#a0aec0"
    }
  },
  select: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    backgroundColor: "#f8fafc",
    transition: "all 0.3s ease",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
    '&:focus': {
      outline: "none",
      borderColor: "#7e46d2",
      boxShadow: "0 0 0 3px rgba(126, 70, 210, 0.1)",
      backgroundColor: "white"
    }
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px"
  },
  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  primaryButton: {
    background: "linear-gradient(135deg, #7e46d2, #9b59b6)",
    color: "white",
    boxShadow: "0 2px 6px rgba(126, 70, 210, 0.3)",
    '&:hover': {
      background: "linear-gradient(135deg, #6d3dba, #8e44ad)",
      boxShadow: "0 4px 10px rgba(126, 70, 210, 0.4)",
      transform: "translateY(-1px)"
    },
    '&:active': {
      transform: "translateY(0)"
    },
    '&:disabled': {
      background: "#cbd5e0",
      boxShadow: "none",
      transform: "none",
      cursor: "not-allowed"
    }
  },
  secondaryButton: {
    background: "white",
    color: "#4a5568",
    border: "1px solid #e2e8f0",
    '&:hover': {
      background: "#f7fafc",
      borderColor: "#cbd5e0"
    },
    '&:disabled': {
      background: "#edf2f7",
      color: "#a0aec0",
      cursor: "not-allowed"
    }
  },
  errorMessage: {
    color: "#e53e3e",
    backgroundColor: "#fff5f5",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fed7d7",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px"
  },
  smallText: {
    color: "#718096",
    fontSize: "12px",
    marginTop: "4px"
  }
};