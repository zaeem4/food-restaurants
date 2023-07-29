export const logout = async () => {
    
    sessionStorage.clear();
    localStorage.removeItem('persist:root');
    localStorage.clear();

    window.location.href = `${process.env.REACT_APP_CLIENT_URL}/login`;
  };
  