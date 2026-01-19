import { useState } from 'react';

import axios from 'axios';

function Login({ API_BASE, setIsAuth }) {
  const [loginMessage, setLoginMessage] = useState('');
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // login
  const handleInputChange = e => {
    const { id, value } = e.target;
    setLoginData({
      ...loginData,
      [id]: value,
    });
  };

  const loginSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, loginData);
      const { message, token, expired } = response.data;
      setLoginMessage(message);
      document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log(error?.response?.data);
    }
  };
  return (
    <>
      <form className="form-container">
        <div className="form-input">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            name="username"
            id="username"
            value={loginData.username}
            onChange={e => {
              handleInputChange(e);
            }}
            required
          />
        </div>
        <div className="form-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={loginData.password}
            onChange={e => {
              handleInputChange(e);
            }}
            required
          />
        </div>
        <button className="form-button" type="button" onClick={loginSubmit}>
          登入
        </button>
        <p className="form-hint">{loginMessage}</p>
      </form>
    </>
  );
}

export default Login;
