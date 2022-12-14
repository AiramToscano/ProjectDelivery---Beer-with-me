import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin, findGetusersCostumer } from '../services/api';
import { saveStorage } from '../services/storage';

function Login() {
  const MIN_LENGTH_PASSWORD = 6;
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function loginClick(event) {
    prop.enviaEmail(email);
    event.preventDefault();
    navigate('/home');
  }

  function registerClick() {
    navigate('/register');
  }

  const getUserId = async () => {
    const userId = window.localStorage.getItem('user');
    if (userId) {
      navigate('/customer/products');
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const userLogin = await apiLogin(email, password);
    if (userLogin) {
      setError(false);
      saveStorage(userLogin);
      navigate('/customer/products');
    }
    if (userLogin.role === 'administrator') {
      navigate('/admin/manage');
    }
    if (userLogin.role === 'seller') {
      const sellerId = window.localStorage.getItem('user');
      const objUser = JSON.parse(sellerId);
      const [user] = await findGetusersCostumer(objUser.email);
      window.localStorage.setItem('sellerId', JSON.stringify(user.id));
      navigate('/seller/orders');
    }
    setError(true);
  }

  return (
    <form data-testid="container" onSubmit={ loginClick }>
      <div className="inputs">
        <input
          data-testid="common_login__input-email"
          type="email"
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
        />

        <input
          data-testid="common_login__input-password"
          type="password"
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          minLength="6"
        />
      </div>
      <div className="btn">
        <button
          data-testid="common_login__button-login"
          type="submit"
          disabled={ password.length < MIN_LENGTH_PASSWORD || !email.match(regex) }
          onClick={ handleSubmit }
        >
          LOGIN
        </button>

        <button
          data-testid="common_login__button-register"
          type="button"
          onClick={ registerClick }
        >
          Ainda n??o tenho conta
        </button>
      </div>
      {error && (
        <div className="error-message">
          <p data-testid="common_login__element-invalid-email">
            N??o foi poss??vel fazer login.
          </p>
        </div>
      )}
    </form>
  );
}

export default Login;
