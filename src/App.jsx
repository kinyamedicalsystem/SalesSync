import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage'
import './index.css'
import SignUp from './pages/Authentication/Signup'
import Login from './pages/Authentication/Login';
import Navbar from './components/SalesLayout';
import Dashboard from './pages/SalesPipeLine/SalesDashboard';
import Records from './pages/SalesPipeLine/SalesRecord';
import RevenueForecast from './pages/SalesPipeLine/SalesRevenueForecast';
import ProductForecast from './pages/SalesPipeLine/SalesProductForecast';
import ServiceNav from './components/ServiceNav';
import Service from './pages/Installation&Service/ServiceReport';
import Installation from './pages/Installation&Service/InstallationReport';





function App(){
  return (
    
    <>
    <BrowserRouter>
      <Routes>
        {/*Authentication Routing */}
        <Route path="/main" element={<MainPage/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/" element={<Login/>}/>
        
        {/*Authentication Routing */}
        
    
        {/*SalesPipeline Routing */}
      <Route path="/sales" element={<Navbar/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="pipelinerecords" element={<Records/>}/>
        <Route path="revenueforecast" element={<RevenueForecast/>}/>
        <Route path="productforecast" element={<ProductForecast/>}/>
      </Route>
  
         {/*SalesPipeline Routing */}


        {/*Service&Installation Routing */}
        <Route path="/report" element={<ServiceNav/>}>
        <Route index element={<Service/>}/>
        <Route path="installationReport" element={<Installation/>}/>
 
      </Route>
        {/*Service&Installation Routing */}
      </Routes>
      
    </BrowserRouter>
    </>
  )
}

export default App
