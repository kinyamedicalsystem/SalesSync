import axios from "axios";
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
function Login(){
 const API=import.meta.env.VITE_BACKEND_URL;
const[error,setError]=useState('');
const[loading,setLoading]=useState(false)
const[formdata,setFormData]=useState({email:'',password:'',})
const navigate=useNavigate();

useEffect(() => {
  const email = localStorage.getItem("email");

  if (email) {
    navigate("/main"); // already logged in
  }
}, []);


const handleChange=(e)=>{
  setFormData({...formdata,[e.target.name]:e.target.value
     })
     setError('')
}

const handleSubmit= async (e)=>{
  e.preventDefault()
  setError('')
  setLoading(true);

   if(formdata.email==="" || formdata.password===""){
        setError('Please fill in all fields')
        setLoading(false);
        return;
      }

  try{
    const res=await axios.post(`${API}/api/login`,formdata)
    localStorage.setItem("role",res.data.role);
     localStorage.setItem("user",res.data.user);
     localStorage.setItem("email",res.data.email);
    navigate('/main');
  }
  catch(err){
    setError('Invalid Credential')
  }
  finally{
    setLoading(false)
  }
};

return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

      {/* Logo */}
      <div className="text-center">
       <i class="fas fa-project-diagram me-2 text-3xl text-white"></i>
        <h2 className="text-3xl font-bold text-white mt-3">Welcome Back</h2>
        <p className="text-gray-300 text-sm mt-1">Login to continue 🚀</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300">Password</label>
            {/*
            <span className="text-xs text-indigo-400 cursor-pointer hover:underline">
              Forgot?
            </span>*/}
          </div>

          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter password"
          />
        </div>

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
            "Login"
          )}
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-gray-400 text-sm mt-6">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>

    </div>
  </div>
</>
)
}
export default Login