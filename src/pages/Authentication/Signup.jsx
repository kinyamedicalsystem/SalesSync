import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignUp() {
   const API=import.meta.env.VITE_BACKEND_URL;
    const[formData,setFormdata]=useState({
        name:'',
        email:'',
        password:'',
        confirmpassword:'',
        role:'staff'
    })
    const[success,setSuccess]=useState('')
    const[error,setError]=useState('')
    const[loading,setLoading]=useState(false);
    const navigate=useNavigate();
   

   const handleChange=(e)=>{
    setFormdata({...formData,[e.target.name]:e.target.value})
    setError('')
   }

    const handleSubmit=async(e)=>{
      e.preventDefault()
      setError('')
      setSuccess('')
      setLoading(true)
     if(formData.email==="" || formData.password===""){
        setError('Please fill in all fields')
        setLoading(false);
        return;
      }
      if(formData.password!=formData.confirmpassword){
        setError('Password Does not Match')
        setLoading(false);
        return;
      }

      try{
        const res=await axios.post(`${API}/api/signup`,formData);
        setSuccess(res.data);
        setTimeout(()=>{
          navigate("/");
        },2000);
      
      }
      catch(err){
        setError(err.response?.data || 'Signup Failed')
      }
      finally{
        setLoading(false);
      }
    };

    
    return (
        <>
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 ">

      {/* Logo */}
      <div className="text-center">
         <i class="fas fa-project-diagram me-2 text-3xl text-white"></i>
        <h2 className="text-3xl font-bold text-white mt-3">Create Account</h2>
        <p className="text-gray-300 text-sm mt-1">Join us and explore more 🚀</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">

        {/* Name */}
        <div>
          <label className="text-sm text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-sm text-gray-300">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option className="text-black" value="staff">Staff</option>
            <option className="text-black" value="admin">Admin</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-300">Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Confirm password"
          />
        </div>

        {/* Success */}
        {success && (
          <div className="bg-green-500/20 border border-green-400 text-green-300 p-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 p-2 rounded-lg text-sm">
            <i className="fas fa-exclamation-circle mx-3 "></i>
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 transition transform duration-300 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Sign Up"
          )}
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-gray-400 text-sm mt-6">
        Already have an account?{" "}
        <Link to="/" className="text-indigo-400 hover:underline">
          Login
        </Link>
      </p>

    </div>
  </div>

</>
)}
export default SignUp;