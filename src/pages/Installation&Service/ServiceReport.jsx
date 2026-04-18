import axios from "axios";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server"
import ServicePrint from "./ServicePrint";

export default function Service() {
    const API=import.meta.env.VITE_BACKEND_URL
    const inputStyle = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 focus:border-blue-500 my-3 "
    const linkStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all bg-indigo-500/30 duration-300 text-gray-300 hover:text-white hover:bg-indigo-500/10";
    const Detail = ({ label, value }) => (
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
            <div className="text-gray-400 text-xs">{label}</div>
            <div className="text-white text-wrap">{value || "N/A"}</div>
        </div>
    );
    const [activeTab, setActiveTab] = useState(localStorage.getItem("Servicetab") || "newRepo");
    const[loading,setLoading]=useState(true)
    const UserName = localStorage.getItem("user");
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [editMode, setEditMode] = useState(false);
    const [editRecord, setEditRecord] = useState(null)
    const [filteredRecords, setFilteredRecords] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [records, setRecords] = useState([])
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const[formError,setFormError]=useState({});
    const [addloading, setAddLoading] = useState(false);
    useEffect(() => {localStorage.setItem("Servicetab", activeTab)}, [activeTab])
    useEffect(()=>{fetchRecords()},[])
    useEffect(()=>{const today=new Date().toISOString().split("T")[0]
        setForm(prev=>({...prev,date:today}))
    },[])

      const formatDateTime=(dateTime)=>{
        if(!dateTime) return "";
        return new Date(dateTime).toLocaleString("en-IN",{
            day:"2-digit",
            month:"short",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit",
            hour12:true

        })
    }


    const fetchRecords=async() => {
        setLoading(true)
        try{
            const res=await axios.get(`${API}/api/services`)
                setRecords(res.data)
                setFilteredRecords(res.data)
                setSearchTerm("")
        }
         catch(err){console.log(err)}
         finally{
            setLoading(false)
         }
    }
    
    const [form, setForm] = useState({
        date: "",
        csrNo: "",
        customerName: "",
        address: "",
        city: "",
        customerContact: "",
        equipmentName: "",
        serialNo: "",
        manufacturer: "",
        model: "",
        customerProblem: "",
        diagnosis: "",
        rectification: "",
        serviceType: "",
        event: "",
        startOfService: "",
        endOfService: "",
        rootCause: "",
        correctiveAction: "",
        preventiveAction: "",
        expectedClosedDate: "",
        closedDate: "",
        engineerName: "",
    })
    const [spares, setSpares] = useState([{ spare: "", qty: 1, price: "" }])
    const addspare = () => {
        setSpares(prev => [...prev, { spare: "", qty: 1, price: "" }])
    }
    const deletespare = (index) => {
        setSpares(prev => prev.filter((_, i) => i !== index))
    }

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.id.replace("add", "")]: e.target.value
        })
    }

    const handleSearch = () => {
        const filter = records.filter(r =>
            r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.csrNo?.toString().includes(searchTerm) ||
            r.engineerName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredRecords(filter)
    }

    const handleClear = () => {
        setSearchTerm("");
        setFilteredRecords(records);
    }

    const handleSpareChange = (index, field, value) => {
        const update = [...spares]
        update[index][field] = value;
        setSpares(update)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()){
            setError("Please fill all required fields")
            setTimeout(()=>{
                setError("")
            },1000)
            return;
        }

        setAddLoading(true)

        const payload = {
            ...form, 
            spares: spares,
            status: form.closedDate ? "CLOSED" : "OPEN"
        }
        delete payload.csrNo;

        try {
            if (editMode) {
                const res = await axios.put(`${API}/api/services/${editRecord.id}`, payload);
                setRecords(prev => prev.map(r => r.id === editRecord.id ? res.data : r))
                 setFilteredRecords(prev => prev.map(r => r.id === editRecord.id ? res.data : r))
                setSuccess("Updated Successfully");
                setTimeout(() => { setActiveTab("viewRepo") }, 700)
            }
            else {
                const res = await axios.post(`${API}/api/services`, payload);
                setRecords(prev => [res.data,...prev]);
                setFilteredRecords(prev => [res.data,...prev]);
                setSuccess("Record Added Successfully");
                resetForm();
            }
            await fetchRecords();
            setTimeout(() => setSuccess(''), 1500)
            resetForm();
            setEditMode(false);
            setEditRecord(null)
        }
        catch (err) {
            console.log(err.response?.data)
            setError('Error Saving Data')
            setTimeout(() => setError(''), 1500)

        }
        finally {
            setAddLoading(false)
        }
    }

    const resetForm = () => {
        const today=new Date().toISOString().split("T")[0];
        setForm({
            date:today,
            csrNo: "",
            customerName: "",
            address: "",
            city: "",
            customerContact: "",
            equipmentName: "",
            serialNo: "",
            manufacturer: "",
            model: "",
            customerProblem: "",
            diagnosis: "",
            rectification: "",
            serviceType: "",
            event: "",
            startOfService: "",
            endOfService: "",
            rootCause: "",
            correctiveAction: "",
            preventiveAction: "",
            expectedClosedDate: "",
            closedDate: "",
            engineerName: ""
        }),
            setSpares([{ spare: "", qty: 1, price: "" }])
            setFormError({})
            setEditMode(false)
            

    }
    const totalReports = records.length;
    const totalCustomer = new Set(records.map(r => r.customerName)).size;
    const totalItems = records.reduce((sum, r) => { return sum + (r.spares?.reduce((s, item) => s + (item.qty || 0), 0) || 0) }, 0)
    const totalEngineer = new Set(records.map(r => r.engineerName)).size;

    const handleEdit = (record) => {
        setEditRecord(record);
        setForm({
            date:record.date || "",
            csrNo:record.csrNo || "",
            customerName:record.customerName   || "",
            address:record.address   || "",
            city: record.city  || "",
            customerContact: record.customerContact  || "",
            equipmentName: record.equipmentName || "",
            serialNo: record.serialNo || "",
            manufacturer: record.manufacturer || "",
            model: record.model || "",
            customerProblem: record.customerProblem  || "",
            diagnosis: record.diagnosis|| "",
            rectification: record.rectification  || "",
            serviceType: record.serviceType || "",
            event: record.event  || "",
            startOfService: record.startOfService  || "",
            endOfService:record.endOfService || "",
            rootCause: record.rootCause  || "",
            correctiveAction:record.correctiveAction || "",
            preventiveAction: record.preventiveAction  || "",
            expectedClosedDate:record.expectedClosedDate || "",
            closedDate:record.closedDate || "",
            engineerName:record.engineerName || "",
      
        })
        setSpares(record.spares || []);
        setEditMode(true);
        setActiveTab("newRepo");
    }


    
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure to delete this record?")) return;

  try {
    await axios.delete(`${API}/api/services/${id}`);

    setRecords(prev => prev.filter(r => r.id !== id));
    setFilteredRecords(prev => prev.filter(r => r.id !== id));
     await fetchRecords();
     setSuccess("Deleted Successfully");
    setTimeout(() => setSuccess(""), 1500);

  } catch (err) {
    console.log(err);
    setError("Delete failed");
    setTimeout(() => setError(""), 1500);
  }
};


    const validateForm = () => {
        let newErrors = {};

        if (!form.customerName.trim()) {
            newErrors.customerName = "Customer Name is required";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!form.customerContact.trim()) {
            newErrors.customerContact = "Contact is required";
        } 

        if (!form.engineerName.trim()) {
            newErrors.engineerName = "Engineer Name required";
        }
         
         if (!form.address.trim()) {
            newErrors.address = "Address is required";
        }
         



        setFormError(newErrors);
        console.log(newErrors);
        return Object.keys(newErrors).length === 0;
    };

const handlePrint = (record) => {
  const printContent = ReactDOMServer.renderToString(
    <ServicePrint record={record} format={formatDateTime} />
  );

  const originalContent = document.body.innerHTML;

  document.body.innerHTML = `
    <html>
      <head>
        <title>Print</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style="background:white;">
        ${printContent}
      </body>
    </html>
  `;

  window.print();

  document.body.innerHTML = originalContent;
  window.location.reload();
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin items-center justify-center text-xl text-purple-500  flex backdrop-blur-xs"><i className='fas fa-tools'></i></div>
    </div>
}
            {/*HEADING*/}
            <div className="mb-8 px-4 md:px-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="my-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        <i class="fas fa-file-alt"></i> SERVICE REPORT SYSTEM
                    </h1>
                    <p className="text-gray-400 mt-2">Create, manage and track service reports</p>
                </div>
                <div className="flex gap-4 me-3 my-4">
                    <button className={`${linkStyle} border border-indigo-500/40`} onClick={() => setActiveTab('newRepo')}><i class="fas fa-plus-circle"></i> New Service Report</button>
                    <button className={`${linkStyle} border border-indigo-500/40`} onClick={() => setActiveTab('viewRepo')}><i class="fas fa-list"></i> View Service Reports</button>
                </div>
            </div>


            {error && (
                <div className=" fixed top-20 right-5  flex items-center gap-2 border border-red-300/40 bg-red-500/20 text-red-300
       px-4 py-3 rounded-lg shadow-lg
       transform transition-all duration-500 ease-out z-50  translate-x-0 opacity-100">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

            {success && (
                <div className=" fixed top-20 right-5 flex items-center gap-2 border border-teal-300/40 bg-teal-500/20 text-green-300
       px-4 py-3 rounded-lg shadow-lg
       transform transition-all duration-500 ease-out z-50  translate-x-0 opacity-100
     ">
                    <i className="fas fa-check-circle"></i>
                    {success}
                </div>
            )}

            {/*Add Form Data*/}
            {activeTab === 'newRepo' && (
                <div className="mt-6 px-4">

                    <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

                        <form className="space-y-8" onSubmit={handleSubmit} >

                            {/* CUSTOMER */}
                            <div>
                                <h3 className="text-lg font-semibold text-cyan-400 mb-6 flex items-center gap-2">
                                    <i className="fas fa-info-circle"></i> Basic Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar-alt me-1"></i> Date <span className="text-red-400">*</span></label>
                                        <input type="date" id="adddate" value={form.date} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-hashtag me-1"></i> CSR NO <span className="text-red-400">*</span></label>
                                        <input type="text" id="addcsrNo" value={editMode ? form.csrNo :"AUTO GENERATED"} readOnly className={inputStyle} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-user me-1"></i> Customer Name <span className="text-red-400">*</span></label>
                                        <input type="text" id="addcustomerName" value={form.customerName} onChange={handleChange} className={`${inputStyle} ${formError.customerName ? "border-red-500" :""}`} />
                                         {formError.customerName && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.customerName}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-map-marker me-1"></i> Address<span className="text-red-400">*</span></label>
                                        <textarea type="text" id="addaddress" value={form.address} onChange={handleChange} className={`${inputStyle} ${formError.address ? "border-red-500":""}`} />
                                         {formError.address && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.address}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-city me-1"></i> City <span className="text-red-400">*</span></label>
                                        <input type="text" id="addcity" value={form.city} onChange={handleChange} className={`${inputStyle} ${formError.city ?"border-red-500":""}`} />
                                         {formError.city && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.city}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-phone me-1"></i> Customer Contact<span className="text-red-400">*</span></label>
                                        <input type="text" id="addcustomerContact" value={form.customerContact} onChange={handleChange} className={`${inputStyle} ${formError.customerContact ?"border-red-500":""}`} />
                                         {formError.customerContact && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.customerContact}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* EQUIPMENT */}
                            <div>
                                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                    <i className="fas fa-toolbox"></i> Equipment Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-tools me-1"></i> Equipment Name</label>
                                        <input type="text" id="addequipmentName" value={form.equipmentName} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-barcode me-1"></i> Serial No</label>
                                        <input type="text" id="addserialNo" value={form.serialNo} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-industry me-1"></i> Manufacturer</label>
                                        <input type="text" id="addmanufacturer" value={form.manufacturer} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-cube me-1"></i> Model</label>
                                        <input type="text" id="addmodel" value={form.model} onChange={handleChange} className={inputStyle} />
                                    </div>
                                </div>
                            </div>


                            {/* SERVICE DETAILS */}
                            <div>
                                <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                                    <i className="fas fa-tools"></i> Service Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-exclamation-triangle me-1"></i> Customer Problem</label>
                                        <textarea type="text" id="addcustomerProblem" value={form.customerProblem} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-stethoscope me-1"></i> Diagnosis & Findings</label>
                                        <textarea type="text" id="adddiagnosis" value={form.diagnosis} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-wrench me-1"></i> Rectification</label>
                                        <textarea type="text" id="addrectification" value={form.rectification} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-cog me-1"></i> Service Type</label>
                                        <select id="addserviceType" className={inputStyle} value={form.serviceType} onChange={handleChange}>
                                            <option value="">Select Service Type</option>
                                            <option value="warranty Service">WARRANTY SERVICE</option>
                                            <option value="outofservice">OUT OF SERVICE</option>
                                            <option value="payableservice">PAYABLE SERVICE</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* PARTS TABLE */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg text-green-400 font-semibold flex items-center gap-2">
                                        <i className="fas fa-boxes"></i>Spares Replaced
                                    </h3>

                                    <button type="button" className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition" onClick={addspare}>
                                        <i className="fas fa-plus mr-2"></i> Add Item
                                    </button>
                                </div>

                                <div className="w-full overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full min-w-[800px] text-sm text-gray-300">
                                        <thead className="bg-white/5 text-gray-400">
                                            <tr>
                                                <th className="p-3 w-[60px]">S.No</th>
                                                <th className="p-3 w-[200px]">SPARES</th>
                                                <th className="p-3 w-[40px]">QUANTITY</th>
                                                <th className="p-3 w-[150px]">COST</th>
                                                <th className="p-3 w-[80px]">Action</th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {spares.map((row, index) => (
                                                <tr className="border-t border-white/10 hover:bg-white/5 " key={index}>

                                                    <td className="text-center">{index + 1}</td>
                                                    <td className="p-3"><input type="text"
                                                        value={row.spare}
                                                        onChange={(e) => handleSpareChange(index, "spare", e.target.value)}
                                                        className={`${inputStyle} min-w-[120px]`} />
                                                    </td>
                                                    <td className="p-3 text-center"><input type="number"
                                                        min={0}
                                                        value={row.qty}
                                                        onChange={(e) => handleSpareChange(index, "qty", Number(e.target.value))}
                                                        className={`${inputStyle} min-w-[120px] `} /></td>
                                                    <td className="text-center"><input type="text"
                                                        value={row.price}
                                                        onChange={(e) => handleSpareChange(index, "price", e.target.value)}
                                                        className={`${inputStyle} min-w-[120px]`} /></td>

                                                    <td className="text-center ">
                                                        <button type="button" onClick={() => deletespare(index)} className="text-red-400 hover:text-red-500">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>

                            {/* EVENT HANDLING */}
                            <div >
                                <h3 className="text-lg text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                                    <i className="fas fa-calendar-alt"></i> Event Handling
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar me-1"></i> Event</label>
                                        <input type="date" id="addevent" value={form.event} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-play-circle me-1"></i> Start Of Service</label>
                                        <input type="datetime-local" id="addstartOfService" value={form.startOfService} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-stop-circle me-1"></i> End Of Service</label>
                                        <input type="datetime-local" id="addendOfService" value={form.endOfService} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-search me-1"></i> Root Cause</label>
                                        <textarea type="text" id="addrootCause" value={form.rootCause} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-tools me-1"></i> Corrective Action</label>
                                        <textarea type="text" id="addcorrectiveAction" value={form.correctiveAction} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-shield-alt me-1"></i> Preventive Action</label>
                                        <textarea type="text" id="addpreventiveAction" value={form.preventiveAction} onChange={handleChange} className={inputStyle} />
                                    </div>
                                </div>

                            </div>

                            {/* CONFIRMATION */}
                            <div>
                                <h3 className="text-lg text-orange-400 font-semibold mb-4 flex items-center gap-2">
                                    <i className="fas fa-check-circle"></i> Additional Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar-check me-1"></i> Expected Closed Date</label>
                                        <input type="date" id="addexpectedClosedDate" value={form.expectedClosedDate} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar-times me-1"></i> Closed Date</label>
                                        <input type="date" id="addclosedDate" value={form.closedDate} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-user-cog me-1"></i> Engineer Name<span className="text-red-400">*</span></label>
                                        <input type="text" id="addengineerName" value={form.engineerName} onChange={handleChange} className={`${inputStyle} ${formError.engineerName ? "border-red-500":""}`} />
                                         {formError.engineerName && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.engineerName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition "
                                >
                                    <i className="fas fa-redo mr-2"></i> Reset
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition flex items-center justify-center"
                                    disabled={addloading}
                                >
                                    {addloading ? <><div className="w-4 h-4 me-2 border-2 border-white border-b-transparent rounded-full animate-spin"></div> {editMode ? "Updating.." : "Saving.."}</> : <span><i className="fas fa-save mr-2"  ></i>{editMode ? "UpdateData" : "SaveData"}</span>}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/*VIEW FORM DETAILS*/}
            {activeTab === 'viewRepo' && (
                <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                            <i className="fas fa-database"></i> View Reports
                        </h3>

                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center hover:scale-105 transition">
                            <i className="fas fa-file-alt text-cyan-400 text-2xl mb-2"></i>
                            <div className="text-2xl  text-cyan-400 font-bold">{totalReports}</div>
                            <div className="text-cyan-500 text-sm">Total Reports</div>
                        </div>

                        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center hover:scale-105 transition">
                            <i className="fas fa-users text-green-400 text-2xl mb-2"></i>
                            <div className="text-2xl font-bold text-green-400">{totalCustomer}</div>
                            <div className="text-green-500 text-sm">Customers</div>
                        </div>

                        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center hover:scale-105 transition">
                            <i className="fas fa-cube text-purple-400 text-2xl mb-2"></i>
                            <div className="text-2xl text-purple-400 font-bold">{totalItems}</div>
                            <div className="text-purple-500 text-sm">Items Installed</div>
                        </div>

                        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center hover:scale-105 transition">
                            <i className="fas fa-user-cog text-orange-400 text-2xl mb-2"></i>
                            <div className="text-2xl text-orange-400 font-bold">{totalEngineer}</div>
                            <div className="text-orange-500 text-sm">Engineers</div>
                        </div>

                    </div>

                    {/* SEARCH */}
                    <form className="flex flex-col sm:flex-row gap-3 mb-6" onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }
                    }>
                        <input
                            type="text"
                            placeholder="Search by customer, invoice, engineer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:ring-2 focus:ring-cyan-500"
                        />

                        <button className="px-4 py-2 rounded-lg bg-blue-600 text-blue-200 hover:bg-blue-700" onClick={handleSearch}>
                            <i className="fas fa-search"></i>
                        </button>

                        <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={handleClear}>
                            <i className="fas fa-times"></i>
                        </button>
                    </form>

                    {/* NO DATA */}
                    {filteredRecords.length === 0 ? (
                        <div className="text-center py-11 text-gray-400">
                            <i className="fas fa-inbox text-4xl mb-3"></i>
                            <h3>No Reports Found</h3>
                        </div>
                    ) : (
                        filteredRecords.map((r, index) => (
                            <div
                                key={r.id || index}
                                id={`record-${r.id}`}
                                className="mt-6 bg-slate-900/60 border border-white/10 rounded-xl p-5 hover:scale-[1.01] transition"
                            >

                                {/* TOP */}
                                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">

                                    <h4 className="text-lg font-semibold text-white">
                                        {r.customerName}
                                    </h4>
                                    <span className={`px-3 py-2 text-center sm:flex items-center rounded-lg text-xs font-bold  ${r.status === "OPEN"
                                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                            : "bg-red-500/20 text-red-400 border border-red-500/50"
                                        }`}>
                                     <span class="relative inline-flex size-2 rounded-full animate-ping border border-white bg-white/30 me-2"></span>{r.status}
                                    </span>
                                    <div className="flex flex-wrap gap-2">

                                        {/* VIEW */}
                                        <button
                                            onClick={() => setSelectedRecord(r)}
                                            className="px-3 py-1 text-sm rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>

                                        {/* EDIT */}
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="px-3 py-1 text-sm rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>

                                        {/* PDF */}
                                        <button
                                            onClick={() => handlePrint(r)}
                                            className="px-3 py-1 text-sm rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                                        >
                                            <i className="fas fa-file-pdf"></i>
                                        </button>


                                        {/* DELETE */}
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="px-3 py-1 text-sm rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>

                                    </div>
                                </div>

                                {/* DETAILS */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm ">

                                    <div>
                                        <div className="text-gray-400 mb-2">Date</div>
                                        <div className="text-white ">{r.date}</div>
                                    </div>

                                    <div>
                                        <div className="text-gray-400 mb-2">CSR NO</div>
                                        <div className="text-white">{r.csrNo}</div>
                                    </div>

                                    <div>
                                        <div className="text-gray-400 mb-2">Engineer</div>
                                        {UserName.toLowerCase().trim() === r.engineerName?.toLowerCase().trim() ?
                                            (<div className="text-purple-200 bg-purple-500/50 border border-purple-500 rounded-full inline-block px-2 py-1 ">{r.engineerName}</div>) : (<div className="text-white">{r.engineerName}</div>)}
                                    </div>

                                    <div>
                                        <div className="text-gray-400 mb-2">City</div>
                                        <div className="text-white">{r.city}</div>
                                    </div>

                                </div>

                            </div>
                        ))
                    )}
                </div>
            )}
            {selectedRecord && (
                <div className="fixed inset-0 bg-black/60  backdrop-blur-sm flex items-center justify-center z-50 p-4">

                    <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/10 p-6 relative">

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setSelectedRecord(null)}
                            className="absolute top-4 right-4 text-white hover:text-white text-xl"
                        >
                            ×
                        </button>

                        {/* TITLE */}
                        <h3 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-6 flex items-center gap-2">
                            <i className="fas fa-eye"></i> View Installation Report
                        </h3>

                        {/* CUSTOMER */}
                        <div className="mb-6">
                            <h4 className="text-lg text-blue-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-user"></i> Customer Information
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                                <Detail label="Date" value={selectedRecord.date} />
                                <Detail label="Csr No" value={selectedRecord.csrNo} />
                                <Detail label="Customer Name" value={selectedRecord.customerName} />
                                <Detail label="Address" value={selectedRecord.address} />
                                <Detail label="City" value={selectedRecord.city} />
                                <Detail label="Contact" value={selectedRecord.customerContact} />

                            </div>
                        </div>

                        {/* Equipment Details */}
                        <div className="mb-6">
                            <h4 className="text-lg text-purple-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-user-cog"></i> Equipment Details
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                                <Detail label="Equipment Name" value={selectedRecord.equipmentName} />
                                <Detail label="Serial No" value={selectedRecord.serialNo} />
                                <Detail label="Manufacturer" value={selectedRecord.manufacturer} />
                                <Detail label="Model" value={selectedRecord.model} />

                            </div>
                        </div>
                        {/* Service Details */}
                        <div className="mb-6">
                            <h4 className="text-lg text-teal-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-tools"></i> Service Details
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                                <Detail label="Customer Problem" value={selectedRecord.customerProblem} />
                                <Detail label="Diagnosis & Finding" value={selectedRecord.diagnosis} />
                                <Detail label="Retofication" value={selectedRecord.rectification} />
                                <Detail label="Service Type" value={selectedRecord.serviceType} />

                            </div>
                        </div>

                        {/* Spares TABLE */}
                        <div className="mb-6">
                            <h4 className="text-lg text-green-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-boxes"></i> Spares Details
                            </h4>

                            <div className="overflow-x-auto rounded-lg border border-white/10">

                                <table className="w-full min-w-[700px] text-sm text-gray-300">

                                    <thead className="bg-white/5 text-gray-400">
                                        <tr>
                                            <th className="p-2 text-left">S.No</th>
                                            <th className="p-2 text-left">Spares</th>
                                            <th className="p-2 text-left">Qty</th>
                                            <th className="p-2 text-left">Price</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedRecord?.spares?.length > 0 ? (
                                            selectedRecord.spares.map((spare, index) => (
                                                <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                                                    <td className="p-2">{index + 1}</td>
                                                    <td className="p-2">{spare.spare}</td>
                                                    <td className="p-2">{spare.qty}</td>
                                                    <td className="p-2">{spare.price}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-gray-400">
                                                    No Items Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>

                            </div>
                        </div>

                        {/* Event Handling */}
                        <div className="mb-6">
                            <h4 className="text-lg text-blue-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-calendar"></i> Event Handling
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <Detail label="Event" value={selectedRecord.event} />
                                <Detail label="Start Of Service" value={formatDateTime(selectedRecord.startOfService)} />
                                <Detail label="End Of Service" value={formatDateTime(selectedRecord.endOfService)} />
                                <Detail label="Root Causes" value={selectedRecord.rootCause} />
                                <Detail label="Corrective Action" value={selectedRecord.correctiveAction} />
                                <Detail label="Preventive Action" value={selectedRecord.preventiveAction} />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mb-6">
                            <h4 className="text-lg text-orange-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-check-circle"></i> Additional Information
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <Detail label="Expected Closed Date" value={selectedRecord.expectedClosedDate} />
                                <Detail label="Closed Date" value={selectedRecord.closedDate} />
                                <Detail label="Engineer Name" value={selectedRecord.engineerName} />
                            </div>
                        </div>



                        {/* ACTIONS */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3">

                            <button className="px-4 py-2 rounded-lg bg-purple-600  text-white hover:bg-purple-700">
                                <i className="fas fa-file-pdf mr-2"></i> PDF
                            </button>

                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="px-4 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600"
                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            )}


        </div>
    )
}