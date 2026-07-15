// import React, { useState } from "react";
// import "./Login.css";
// import {
//   Mail,
//   Lock,
//   Eye,
//   Users,
//   BarChart3,
//   ShieldCheck,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";


// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("rajashekar...");
//   const [password, setPassword] = useState("password");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     console.log({ email, password });

//     navigate("/dashboard");
//   };


//   return (
//     <div className="login-page">
//       {/* Left Side */}
//       <div className="login-left">
//         <div className="brand">
//           <div className="logo-circle">B</div>

//           <div>
//             <h2>BELNOVA HRMS</h2>
//             <p>Enterprise HR Management Platform</p>
//           </div>
//         </div>

//         <div className="hero-content">
//           <h1>
//             Manage your workforce
//             <br />
//             smarter, faster.
//           </h1>

//           <div className="feature">
//             <Users size={20} />
//             <span>Complete employee lifecycle management</span>
//           </div>

//           <div className="feature">
//             <BarChart3 size={20} />
//             <span>Real-time analytics & insights</span>
//           </div>

//           <div className="feature">
//             <ShieldCheck size={20} />
//             <span>Role-based access control</span>
//           </div>
//         </div>

//         <div className="copyright">
//           © 2025 BELNOVA Technologies · v3.2.0
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="login-right">
//         <form className="login-form" onSubmit={handleLogin}>
//           <h1>Welcome back</h1>
//           <p>Sign in to your BELNOVA account</p>

//           <label>Email Address</label>

//           <div className="input-box">
//             <Mail size={18} />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <label>Password</label>

//           <div className="input-box">
//             <Lock size={18} />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Eye size={18} />
//           </div>

//           <div className="row">
//             <label className="remember">
//               <input type="checkbox" />
//               Remember me
//             </label>

//             <a href="/">Forgot password?</a>
//           </div>

//           <button className="login-btn">
//             Sign In to BELNOVA
//           </button>

//           <div className="secure-text">
//             Protected by 2FA • Use SSO instead
//           </div>

       
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import "./Login.css";
import {
  Mail,
  Lock,
  Eye,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance"; // adjust path to match your folder depth

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user_id, first_name, last_name, role_id, role_name, permissions } = res.data;

      // Store token separately (interceptor reads this)
      localStorage.setItem("token", token);

      // Store user + permissions together for use across the app
      localStorage.setItem(
        "user",
        JSON.stringify({ user_id, first_name, last_name, role_id, role_name, permissions })
      );

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side */}
      <div className="login-left">
        <div className="brand">
          <div className="logo-circle">B</div>

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
            <span>Complete employee lifecycle management</span>
          </div>

          <div className="feature">
            <BarChart3 size={20} />
            <span>Real-time analytics & insights</span>
          </div>

          <div className="feature">
            <ShieldCheck size={20} />
            <span>Role-based access control</span>
          </div>
        </div>

        <div className="copyright">
          © 2025 BELNOVA Technologies · v3.2.0
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Welcome back</h1>
          <p>Sign in to your BELNOVA account</p>

          {error && <div className="login-error">{error}</div>}

          <label>Email Address</label>

          <div className="input-box">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <Lock size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Eye size={18} />
          </div>

          <div className="row">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="/">Forgot password?</a>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to BELNOVA"}
          </button>

          <div className="secure-text">
            Protected by 2FA • Use SSO instead
          </div>
        </form>
      </div>
    </div>
  );
}