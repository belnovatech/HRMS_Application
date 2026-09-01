import React, { useState } from "react";
import "./Login.css";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  BarChart3,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("password"); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (loginMode === "otp") {
      if (!otpSent) {
        if (!identifier.trim()) {
          setError("Please enter your Email or Mobile number to receive OTP.");
          return;
        }
        setOtpSent(true);
        setError("");
        return;
      }
      if (!otpCode.trim()) {
        setError("Please enter the 6-digit OTP received.");
        return;
      }
    }

    const result = login(identifier, loginMode === "otp" ? "password123" : password);

    if (result.success) {
      if (result.role === "hr") {
        navigate("/hr/dashboard");
      } else if (result.role === "manager") {
        navigate("/manager/dashboard");
      } else if (result.role === "employee") {
        navigate("/employee/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } else {
      setError(result.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      {/* Left Side — Branding & Features */}
      <div className="login-left">
        <div className="brand">
          <img src="/image.png" alt="BELNOVA HRMS" className="brand-logo" />
          <div>
            <h2>BELNOVA HRMS</h2>
            <p>Enterprise HR Management Platform</p>
          </div>
        </div>

        <div className="hero-content">
          <h1>
            Manage your workforce
            <br />
            smarter, faster.
          </h1>

          <div className="feature">
            <Users size={20} />
            <span>Complete employee lifecycle & role-based portals</span>
          </div>

          <div className="feature">
            <BarChart3 size={20} />
            <span>Real-time attendance, leave & payroll analytics</span>
          </div>

          <div className="feature">
            <ShieldCheck size={20} />
            <span>Secure role-based authentication & data protection</span>
          </div>
        </div>

        {/* Dynamic Demo Credentials Hint Box */}
        <div className="demo-credentials-box">
          <small className="demo-title">⚡ QUICK LOGIN DEMO CREDENTIALS</small>
          <div className="demo-credentials-grid">
            <div className="demo-item" onClick={() => { setIdentifier("admin@hr.com"); setPassword("password123"); }}>
              <strong>HR Portal:</strong> admin@hr.com
            </div>
            <div className="demo-item" onClick={() => { setIdentifier("manager@belnova.com"); setPassword("password123"); }}>
              <strong>Manager:</strong> manager@belnova.com
            </div>
            <div className="demo-item" onClick={() => { setIdentifier("EMP001"); setPassword("password123"); }}>
              <strong>Employee ID:</strong> EMP001
            </div>
          </div>
        </div>

        <div className="copyright">
          © 2026 BELNOVA Technologies · Enterprise v3.5
        </div>
      </div>

      {/* Right Side — Single Sign-In Form */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="mobile-brand">
            <img src="/image.png" alt="BELNOVA HRMS" className="mobile-logo" />
            <h2>BELNOVA HRMS</h2>
          </div>

          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to your BELNOVA HRMS account</p>

          {error && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              className={`mode-tab ${loginMode === "password" ? "active" : ""}`}
              onClick={() => { setLoginMode("password"); setError(""); }}
            >
              Password Login
            </button>
            <button
              type="button"
              className={`mode-tab ${loginMode === "otp" ? "active" : ""}`}
              onClick={() => { setLoginMode("otp"); setError(""); }}
            >
              OTP Login
            </button>
          </div>

          <label className="input-label">Email / Username / Employee ID</label>
          <div className="input-box">
            <Mail size={18} className="input-icon" />
            <input
              type="text"
              placeholder="e.g. admin@hr.com or EMP001"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {loginMode === "password" ? (
            <>
              <label className="input-label">Password</label>
              <div className="input-box">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="form-row">
                <label className="remember">
                  <input type="checkbox" defaultChecked />
                  Remember me
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact your HR administrator to reset your password."); }}>
                  Forgot password?
                </a>
              </div>
            </>
          ) : (
            <>
              {otpSent && (
                <>
                  <label className="input-label">Enter 6-Digit OTP</label>
                  <div className="input-box">
                    <Smartphone size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      value={otpCode}
                      maxLength={6}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}

          <button className="login-btn" type="submit">
            <span>{loginMode === "otp" && !otpSent ? "Send OTP" : "Sign In to BELNOVA"}</span>
            <ArrowRight size={18} />
          </button>

          <div className="secure-text">
            Protected by Role-Based Encryption • Enterprise Single Sign-On
          </div>
        </form>
      </div>
    </div>
  );
}