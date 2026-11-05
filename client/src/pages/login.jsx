
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = "https://jelidressshop-1-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

const AuthPage = () => {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "" };

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak" };
    if (score <= 3) return { score, label: "Medium" };

    return { score, label: "Strong" };
  };

  const strength = getPasswordStrength(registerPassword);

  // Error messages
  const getErrorMessage = (err) => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    if (err.response?.status === 404) {
      return "Authentication endpoint not found.";
    }

    if (err.response?.status >= 500) {
      return "Server error. Please try again later.";
    }

    if (!err.response) {
      return "Unable to connect to the server. Please try again.";
    }

    return "Something went wrong. Please try again.";
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerPassword.length < 8) {
      showToast(
        "Password must contain at least 8 characters.",
        "error"
      );
      return;
    }

   

    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/register", {
        name: registerUsername.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      if (!res.data.token) {
        throw new Error("Authentication token was not returned.");
      }

      localStorage.setItem("token", res.data.token);

      const username = res.data.username ?? registerUsername;
      localStorage.setItem("username", username);

      showToast(`Welcome to Jeli, ${username}!`);

      setTimeout(() => navigate("/home"), 700);
    } catch (err) {
      console.error(
        "Register error:",
        err.response?.data || err.message
      );
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });

      if (!res.data.token) {
        throw new Error("Authentication token was not returned.");
      }

      localStorage.setItem("token", res.data.token);

      const username = res.data.username ?? loginIdentifier;
      localStorage.setItem("username", username);

      showToast(`Welcome back, ${username}!`);

      setTimeout(() => navigate("/home"), 700);
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );
      showToast(getErrorMessage(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // SWITCH BETWEEN LOGIN AND REGISTER
  const switchForm = (form) => {
  setActiveForm(form);
  setShowPassword(false);
};

  return (
    <div className="jeli-auth-page">

      {/* TOAST */}
      {toast && (
        <div
          className={`jeli-toast ${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon">
            {toast.type === "error" ? "!" : "✓"}
          </span>

          {toast.message}

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
      <img
    src="/images/logo.png"
    alt="JELI Logo"
    className="page-logo"
  />

      <div className="auth-shell">

        {/* LEFT IMAGE SECTION */}
        <section className="auth-visual">
          <div className="visual-overlay"></div>

          <div className="visual-content">
            <div className="jeli-brand">
              JELI<span>.</span>
            </div>

            <div className="visual-bottom">
              <span className="visual-tag">
                THE NEW COLLECTION
              </span>

              <h1>
                Dress like
                <br />
                <em>you mean it.</em>
              </h1>

              <p>
                Discover timeless pieces, effortless styles
                and fashion that feels uniquely yours.
              </p>

              <div className="visual-line"></div>

              <span className="visual-caption">
                FASHION • STYLE • CONFIDENCE
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT FORM SECTION */}
        <section className="auth-form-section">

          <div className="auth-mobile-brand">
            JELI<span>.</span>
          </div>

          <div className="auth-card">

            <div className="auth-heading">
              <span className="auth-eyebrow">
                {activeForm === "login"
                  ? "WELCOME BACK"
                  : "JOIN THE JELI COMMUNITY"}
              </span>

              <h2>
                {activeForm === "login"
                  ? "Hello again."
                  : "Create account."}
              </h2>

              <p>
                {activeForm === "login"
                  ? "Sign in to continue your style journey."
                  : "Your next favourite outfit starts here."}
              </p>
            </div>

            {/* TABS */}
            <div className="auth-tabs">
              <button
                type="button"
                className={activeForm === "login" ? "active" : ""}
                onClick={() => switchForm("login")}
                disabled={isLoading}
              >
                Sign In
              </button>

              <button
                type="button"
                className={activeForm === "register" ? "active" : ""}
                onClick={() => switchForm("register")}
                disabled={isLoading}
              >
                Create Account
              </button>
            </div>

            {/* LOGIN FORM */}
            {activeForm === "login" && (
              <form
                onSubmit={handleLogin}
                className="auth-form"
              >

                <div className="auth-field">
                  <label htmlFor="loginIdentifier">
                    Username or Email
                  </label>

                  <input
                    id="loginIdentifier"
                    type="text"
                    placeholder="Enter username or email"
                    value={loginIdentifier}
                    onChange={(e) =>
                      setLoginIdentifier(e.target.value)
                    }
                    required
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="loginPassword">
                    Password
                  </label>

                  <div className="password-wrapper">
                    <input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) =>
                        setLoginPassword(e.target.value)
                      }
                      required
                      autoComplete="current-password"
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    "SIGN IN"
                  )}
                </button>

                <p className="auth-switch-text">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchForm("register")}
                  >
                    Create one
                  </button>
                </p>

              </form>
            )}

            {/* REGISTRATION FORM */}
            {activeForm === "register" && (
              <form
                onSubmit={handleRegister}
                className="auth-form"
              >

                <div className="auth-field">
                  <label htmlFor="registerUsername">
                    Username
                  </label>

                  <input
                    id="registerUsername"
                    type="text"
                    placeholder="Choose a username"
                    value={registerUsername}
                    onChange={(e) =>
                      setRegisterUsername(e.target.value)
                    }
                    required
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="registerEmail">
                    Email Address
                  </label>

                  <input
                    id="registerEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) =>
                      setRegisterEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="registerPassword">
                    Password
                  </label>

                  <div className="password-wrapper">
                    <input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) =>
                        setRegisterPassword(e.target.value)
                      }
                      required
                      minLength={8}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* PASSWORD STRENGTH */}
                  {registerPassword && (
                    <div className="strength-container">
                      <div className="strength-bars">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={
                              n <= strength.score
                                ? `filled ${strength.label.toLowerCase()}`
                                : ""
                            }
                          ></span>
                        ))}
                      </div>

                      <small>
                        Password strength:{" "}
                        <strong>{strength.label}</strong>
                      </small>
                    </div>
                  )}
                </div>

                

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Creating account...
                    </>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>

                <p className="auth-switch-text">
                  Already a member?{" "}
                  <button
                    type="button"
                    onClick={() => switchForm("login")}
                  >
                    Sign in
                  </button>
                </p>

              </form>
            )}

            <div className="auth-footer">
              <span>JELI DRESS SHOP</span>
              <p>Made for your everyday style.</p>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
