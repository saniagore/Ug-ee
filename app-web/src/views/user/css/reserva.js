export const styles = {
  container: {
    maxWidth: '500px',
    margin: '20px auto',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
    position: 'relative',
    minHeight: '150px'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '24px',
    marginTop: '30px'
  },
  backButton: {
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'transparent',
    color: '#7e46d2',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#f0e6ff'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#34495e',
    fontWeight: '600'
  },
  icon: {
    color: '#7e46d2',
    fontSize: '16px'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'all 0.3s',
    outline: 'none',
    ':focus': {
      borderColor: '#7e46d2',
      boxShadow: '0 0 0 2px rgba(126, 70, 210, 0.2)'
    }
  },
  error: {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '4px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px'
  },
  submitButton: {
    backgroundColor: '#7e46d2',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#6d3ac2',
      transform: 'translateY(-2px)'
    }
  }
};