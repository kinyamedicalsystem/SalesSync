import './MainPage.css';
import Example from '../components/profile';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function MainPage() {
  const role=localStorage.getItem("role");
  const[loading,setLoading]=useState(true)
  const userName=localStorage.getItem("user");
  const navigate=useNavigate();

useEffect(() => {
  const email = localStorage.getItem("email");
  if (!email) {
    navigate("/");
     // already logged in
  }
    setTimeout(() => {
      setLoading(false);
    }, 800);

},[]);

  return (
    <>
   {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin items-center justify-center text-xl text-cyan-400  flex backdrop-blur-xs"><i className='fas fa-arrows-rotate'></i></div>
    </div>
}
      <header className="main-header">
        <div className=" logo "><i className="fas fa-project-diagram me-2 text-cyan-400"></i>SalesSync <span className='max-w-md bg-cyan-500/20 animat backdrop-blur-lg border-2 border-cyan-500/20 rounded-lg text-sm px-1'>  Pro</span></div>
        <div className="Profile ">
           <Example/>
           </div>
      </header>

      <div className="main-container">
       <div className="title">
            <h1 className="text-4xl font-bold text-indigo-300 ">Welcome back ! <span className='mx-2 text-green-400 font-normal font-sans'>{userName}</span>👋 </h1>
            <h5 className="text-gray-400 mt-3  font-sans"> Manage your system efficiently from here</h5>
        </div>

        <div className="select-section">
         {role === 'admin' &&
         
        <div className="card sales w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <i className="fa-solid fa-chart-pie text-4xl mb-3 text-stone-400"></i>
            <h2 className="text-2xl   text-orange-400">Sales Pipeline</h2>
            <p className="text-stone-50 my-5 font-light font-sans"> Manage records and track potential leads, monitor deal progress,and forecast revenue. </p>
            <button className="bg-sky-700 px-4 py-2 text-white rounded-full hover:bg-sky-800 sm:px-8 sm:py-3 mt-5" onClick={()=>navigate("/sales")}>Open</button>
          </div>
          
        }
          
          <div className="card service w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <i className="fa-solid fa-wrench text-4xl mb-3 text-stone-400"></i>
            <h2 className=" text-2xl text-purple-400">Service & Installation</h2>
            <p className="text-stone-50 my-4 font-sans font-light">Schedule and manage product installations, track service requests,
          and maintain customer support records. </p>
            <button className="bg-sky-700 px-4 py-2 text-white rounded-full hover:bg-sky-800 sm:px-8 sm:py-3 mt-5"onClick={()=>navigate("/report")} >Open</button>
          </div>
   
        </div>
        

      </div>
    </>
  );
}