// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { message as antdMessage, Spin } from "antd";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import logo from "../components/assets/Company_logo.png";
// import x_logo from "../components/assets/Dark Logo.png";
// import { userService } from "../hrms/services/Userservice";
// import "./Register.css";

// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState(""); 
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!name || !email || !password || !confirmPassword || !role) {
//       antdMessage.error("Please fill all fields");
//       return;
//     }

//     if (password.length < 6) {
//       antdMessage.error("Password must be at least 6 characters");
//       return;
//     }

//     if (password !== confirmPassword) {
//       antdMessage.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       // ✅ Correct payload for your API
//       const payload = { name, email, password, confirmPassword, role };
//       const res = await userService.register(payload);

//       // Response: { message, user, token }
//       antdMessage.success(res.data.message || "Registration successful!");
//       console.log("Registered user:", res.data.user);
//       console.log("Token:", res.data.token);

//       // Save token if needed
//       localStorage.setItem("token", res.data.token);

//       // Navigate to login page
//       navigate("/");
//     } catch (err) {
//       console.error("Register API Error:", err);
//       antdMessage.error(err.response?.data?.message || "Registration failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <div className="welcome-container">
//           <h3 className="welcome-heading">
//             Welcome to <img src={x_logo} alt="XTOWN" /> town..!
//           </h3>
//           <span className="welcome-tagline">
//             We’re here to turn your ideas into reality.
//           </span>
//         </div>
//       </div>

//       <div className="login-right">
//         <img src={logo} alt="Company Logo" className="logo" />

//         <form className="login-form" onSubmit={handleRegister}>
//           <h3>CREATE AN ACCOUNT</h3>

//          {/* Name */}
// <div className="form-group">
//   <div className="input-wrapper">
//     <input
//       type="text"
//       value={name}
//       onChange={(e) => setName(e.target.value)}
//       className={name ? "filled" : ""}
//       placeholder="Full Name"
//       required  // ✅ This makes it a required field
//     />
//     <label>Name</label>
//   </div>
// </div>
//           {/* Email */}
//           <div className="form-group">
//             <div className="input-wrapper">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className={email ? "filled" : ""}
//                 placeholder="Email"
//                  required
//               />
//               <label>Email</label>
//             </div>
//           </div>

//           {/* Role */}
//           <div className="form-group">
//             <div className="input-wrapper">
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className={role ? "filled" : ""}
//                  required
//               >
//                 <option value="" disabled hidden></option>
//                 <option value="admin">Admin</option>
//                  <option value="admin">User</option>
//               </select>
//               <label>Role</label>
//               <span className="select-arrow">&#9662;</span>
//             </div>
//           </div>

//           {/* Password */}
//           <div className="form-group">
//             <div className="input-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={password ? "filled" : ""}
//                 placeholder="Password"
//                  required
//               />
//               <label>Password</label>
//               {showPassword ? (
//                 <FaEyeSlash
//                   className="input-icon toggle-icon"
//                   onClick={() => setShowPassword(false)}
//                 />
//               ) : (
//                 <FaEye
//                   className="input-icon toggle-icon"
//                   onClick={() => setShowPassword(true)}
//                 />
//               )}
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group">
//             <div className="input-wrapper">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className={confirmPassword ? "filled" : ""}
//                 placeholder="Confirm Password"
//                  required
//               />
//               <label>Confirm Password</label>
//               {showConfirmPassword ? (
//                 <FaEyeSlash
//                   className="input-icon toggle-icon"
//                   onClick={() => setShowConfirmPassword(false)}
//                 />
//               ) : (
//                 <FaEye
//                   className="input-icon toggle-icon"
//                   onClick={() => setShowConfirmPassword(true)}
//                 />
//               )}
//             </div>
//           </div>

//           <button type="submit" className="log-button" disabled={loading}>
//             {loading ? <Spin /> : "REGISTER"}
//           </button>

//           <div style={{ marginTop: "1rem", textAlign: "center" }}>
//             <span>Already have an account?</span>
//             <span
//               style={{ color: "#3d2c8bff", fontWeight: "bold", marginLeft: "4px" }}
//               onClick={() => navigate("/")}
//             >
//               Login here
//             </span>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Spin } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { userService } from "../hrms/services/Userservice";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !role || !phone) {
      antdMessage.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      antdMessage.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const payload = { username, email, phone, password, role };
      const res = await userService.register(payload);

      antdMessage.success(res.data.message || "Registration successful!");
      console.log("Registered user:", res.data.user);

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Register API Error:", err);
      antdMessage.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-800 to-gray-600 text-white flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold mb-2">
          Welcome to <img src={x_logo} alt="XTOWN" className="inline w-28" /> town..!
        </h3>
        <p className="text-gray-300">We’re here to turn your ideas into reality.</p>
      </div>

      {/* Right side */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center p-8">
        <img src={logo} alt="Company Logo" className="w-28 mb-4" />

        <form
          onSubmit={handleRegister}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            CREATE AN ACCOUNT
          </h3>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
               <option value="superadmin">SuperAdmin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter password"
              required
            />
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? <Spin /> : "REGISTER"}
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?
            <span
              className="text-gray-800 font-semibold ml-1 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
