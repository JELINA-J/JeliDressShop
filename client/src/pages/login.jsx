import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState('login');

  // Register states
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ================= REGISTER =================
const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await axios.post(
      'https://jelidressshop-1-1.onrender.com/api/auth/register',
      {
        name: registerUsername,
        email: registerEmail,
        password: registerPassword
      }
    );

    // ✅ Directly use register response
    localStorage.setItem('token', res.data.token);

    const username = res.data.username ?? registerUsername;
    localStorage.setItem('username', username);

    setMessage(`Welcome, ${username}! 🎉`);

    navigate('/home');

  } catch (err) {
    console.error('Register error:', err.response?.data || err.message);
    setMessage(err.response?.data?.message || 'Registration failed.');
  } finally {
    setIsLoading(false);
  }
};
  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        'https://jelidressshop-1-1.onrender.com/api/auth/login',
        {
          identifier: loginIdentifier,
          password: loginPassword
        }
      );

      localStorage.setItem('token', res.data.token);

      const username =
        res.data.username ?? loginIdentifier;

      localStorage.setItem('username', username);

      setMessage(`Welcome back, ${username}! 🎉`);

      navigate('/home');

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="Account-page">
      <div className="row">
        <div className="col-2">
{message && <p style={{ color: 'green' }}>{message}</p>}

          <img src="images/loginimage.png" style={{ width: '115%' }} alt="Login" />
        </div>

        <div className="col-2">
          <div className="form-container">
            <div className="form-btn">
              <span
                onClick={() => setActiveForm('login')}
                style={{ color: activeForm === 'login' ? '#088178' : 'rgb(20, 19, 19)' }}
              >
                Login
              </span>
              <span
                onClick={() => setActiveForm('register')}
                style={{ color: activeForm === 'register' ? '#088178' : 'rgb(20, 19, 19)' }}
              >
                Register
              </span>
              <hr
                id="indicator"
                style={{
                  transform: activeForm === 'login' ? 'translateX(50px)' : 'translateX(150px)',
                  transition: 'transform 0.5s'
                }}
              />
            </div>

            {/* Login form */}
            <form
              onSubmit={handleLogin}
              id="loginform"
              style={{
                transform: activeForm === 'login' ? 'translateX(300px)' : 'translateX(0px)',
                transition: 'transform 0.5s'
              }}
            >
              <input
                type="text"
                name="identifier"
                placeholder="Username or Email"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <button type="submit" className="login-btn">Login</button>
              <a href="#">Forget Password</a>
            </form>

            {/* Register form */}
            <form
              onSubmit={handleRegister}
              id="regform"
              style={{
                transform: activeForm === 'register' ? 'translateX(0px)' : 'translateX(300px)',
                transition: 'transform 0.5s'
              }}
            >
              <input
                type="text"
                name="identifier"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button type="submit" className="login-btn">Register</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
