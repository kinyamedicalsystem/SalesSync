import axios from "axios";
import { useEffect, useState } from "react";
import InstallationPrint from "./InstallationPrint";
import ReactDOMServer from "react-dom/server"

export default function Intallation() {
    const API=import.meta.env.VITE_BACKEND_URL;

    const inputStyle = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 focus:border-blue-500 my-3"
    const linkStyle = "px-4 py-2 rounded-lg text-sm font-medium transition-all bg-teal-500/30 duration-300 text-gray-300 hover:text-white hover:bg-teal-500/10 ";
    const Detail = ({ label, value }) => (
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3">
            <div className="text-gray-400 text-xs">{label}</div>
            <div className="text-white text-wrap">{value || "N/A"}</div>
        </div>
    );
  const UserName = localStorage.getItem("user")
  const[loading,setLoading]=useState(false)
    const [addloading, setaddLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(localStorage.getItem("tab") || "new");
    useEffect(() => { fetchRecords() }, [])
    useEffect(() => {
        localStorage.setItem("tab", activeTab);
    }, [activeTab]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formError, setFormError] = useState({});
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredRecords, setFilteredRecords] = useState([])
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [editRecord, setEditRecord] = useState(null)
    const [editmode, setEditMode] = useState(false);
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

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]
        setForm(prev => ({ ...prev, date: today }))
    }, [])
    const [form, setForm] = useState({
        date: "",
        customerName: "",
        city: "",
        customerContact: "",
        address: "",
        invoiceNo: "",
        invoiceDate: "",
        installationDate: "",
        engineerName: "",
        engineerContact: "",
        warranty: "",
        demoGiven: "",
        trainingGiven: "",
        eventStart: "",
        eventEnd: ""
    })
    const [items, setItems] = useState([{ item: "", manufacturer: "", serial: "", model: "", qty: 1 }])

    const fetchRecords= async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API}/api/installations`)
            setRecords(res.data)
            setFilteredRecords(res.data)
            setSearchTerm("")
        }
        catch (err) { console.log(err) }
        finally{setLoading(false)}
    }



    const handleItemChange = (index, field, value) => {
        const update = [...items]
        update[index][field] = value;
        setItems(update)
    }

    const addItem = () => {
        setItems(prev => [...prev, { item: "", manufacturer: "", serial: "", model: "", qty: 1 }])
    }
    const deleteItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    const handleChange = (e) => {

        setForm({
            ...form, [e.target.id.replace("add", "")]: e.target.value
        })
    }
    const handleEdit = (record) => {
        setEditRecord(record);
        setForm({
            date: record.date || "",
            customerName: record.customerName || "",
            city: record.city || "",
            customerContact: record.customerContact || "",
            address: record.address || "",
            invoiceNo: record.invoiceNo || "",
            invoiceDate: record.invoiceDate || "",
            installationDate: record.installationDate || "",
            engineerName: record.engineerName || "",
            engineerContact: record.engineerContact || "",
            warranty: record.warranty || "",
            demoGiven: record.demoGiven || "",
            trainingGiven: record.trainingGiven || "",
            eventStart: record.eventStart || "",
            eventEnd: record.eventEnd || ""
        })
        setItems(record.items || []);
        setEditMode(true);
        setActiveTab("new");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
          if (!validateForm()) {
            setError("Please fill all required fields")
            setTimeout(()=>{
                setError("")
            },1000)
            return;
        }

        setaddLoading(true);
      
        const payload = {
            ...form, items: items
        };
        try {
            if (editmode) {
                const res = await axios.put(`${API}/api/installations/${editRecord.id}`, payload);
                setRecords(prev => prev.map(r => r.id === editRecord.id ? res.data : r))
                setFilteredRecords(prev => prev.map(r => r.id === editRecord.id ? res.data : r))
                setSuccess("Updated Successfully");
                setTimeout(() => { setActiveTab("view") }, 700)
            }
            else {
                const res = await axios.post(`${API}/api/installations`, payload)
                setRecords(prev => [res.data, ...prev]);
                setFilteredRecords(prev => [res.data, ...prev]);
                setSuccess("Saved Succesfully")
            }
            await fetchRecords();
            setTimeout(() => setSuccess(""), 1500);
            resetForm();
            setEditMode(false);
            setEditRecord(null)
        }
        catch (err) {
            console.log(err.response?.data);
            setError("Error Saving Data");
            setTimeout(() => setError(""), 1500);
        }
        finally {
            setaddLoading(false);
        }
    }

    const resetForm = () => {
        const today=new Date().toISOString().split("T")[0];
        setForm({
            date: today,
            customerName: "",
            city: "",
            customerContact: "",
            address: "",
            invoiceNo: "",
            invoiceDate: "",
            installationDate: "",
            engineerName: "",
            engineerContact: "",
            warranty: "",
            demoGiven: "",
            trainingGiven: "",
            eventStart: "",
            eventEnd: ""
        })
        setItems([{ item: "", manufacturer: "", serial: "", model: "", qty: 1 }]);
        setEditMode(false);
        setFormError({});
    }



    const handleSearch = () => {
        const filter = records.filter(r =>
            r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.engineerName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredRecords(filter)
    }

    const handleClear = () => {
        setSearchTerm("");
        setFilteredRecords(records);
    }
    const totalReports = records.length;
    const totalCustomer = new Set(records.map(r => r.customerName)).size;
    const totalItems = records.reduce((sum, r) => { return sum + (r.items?.reduce((s, item) => s + (item.qty || 0), 0) || 0) }, 0)
    const totalEngineer = new Set(records.map(r => r.engineerName)).size;

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this record?")) return;

        try {
            await axios.delete(`${API}/api/installations/${id}`);

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
          if (!form.engineerContact.trim()) {
            newErrors.engineerContact = "EngineerContact is required";
        }
          if (!form.warranty) {
            newErrors.warranty= "warranty is required";
        }


        setFormError(newErrors);
        console.log(newErrors);
        return Object.keys(newErrors).length === 0;
    };


   const handlePrint = (record) => {

  const printContent = ReactDOMServer.renderToString(
    <InstallationPrint record={record} format={formatDateTime}/>
  );

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>Installation Report</title>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
        <script src="https://cdn.tailwindcss.com"></script>

        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #f3f4f6;
          }

          .print-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2563eb;
            color: white;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            z-index: 999;
          }

          @media print {
            .print-btn {
              display: none;
            }
            body {
              padding: 0;
              background: white;
            }
          }
        </style>
      </head>

      <body>

        <button class="print-btn" onclick="window.print()">
              <i class="fa-solid fa-file-invoice "></i> Print PDF
        </button>

        ${printContent}

      </body>
    </html>
  `);

  printWindow.document.close();
};
   return (

        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-12 h-12 border-2 border-teal-500 border-t-transparent rounded-full animate-spin items-center justify-center text-xl text-teal-500  flex backdrop-blur-xs"><i className='fas fa-cog'></i></div>
    </div>
}
            {/*HEADING*/}
            <div className="mb-8 px-4 md:px-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="my-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        <i class="fas fa-file-alt"></i> INSTALLATION REPORT SYSTEM
                    </h1>
                    <p className="text-gray-400 mt-2">Create, manage and track installation reports</p>
                </div>
                <div className="flex gap-4 me-3 my-4">
                    <button className={`${linkStyle} border border-teal-500/40`} onClick={() => setActiveTab('new')}><i class="fas fa-plus-circle"></i> New Report</button>
                    <button className={`${linkStyle} border border-teal-500/40`} onClick={() => setActiveTab('view')}><i class="fas fa-list"></i> View Reports</button>
                </div>
            </div>
            {/*HEADING*/}

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
            {activeTab === 'new' && (
                <div className="mt-6 px-4">

                    <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

                        <form className="space-y-8" onSubmit={handleSubmit}  >

                            {/* CUSTOMER */}
                            <div>
                                <h3 className="text-lg font-semibold text-cyan-400 mb-6 flex items-center gap-2">
                                    <i className="fas fa-user"></i> Customer Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar-alt me-1"></i> Date <span className="text-red-400">*</span></label>
                                        <input type="date" id="adddate" onChange={handleChange} value={form.date} className={inputStyle} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-user me-1"></i> Customer Name <span className="text-red-400">*</span></label>
                                        <input type="text" id="addcustomerName" onChange={handleChange} value={form.customerName} className={`${inputStyle} ${formError.customerName ? "border-red-500":""}`}/>
                                        {formError.customerName && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.customerName}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-city me-1"></i> City <span className="text-red-400">*</span></label>
                                        <input type="text" id="addcity" onChange={handleChange} value={form.city} className={`${inputStyle} ${formError.city ? "border-red-500":""}`} />
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-map-marker-alt me-1"></i> Address<span className="text-red-400">*</span></label>
                                        <textarea type="text" id="addaddress" onChange={handleChange} value={form.address} className={`${inputStyle} ${formError.address ? "border-red-500" :""}`} />
                                     {formError.address && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ENGINEER */}
                            <div>
                                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                    <i className="fas fa-user-cog"></i> Engineer Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-file-invoice me-1"></i> Invoice No</label>
                                        <input type="text" id="addinvoiceNo" onChange={handleChange} value={form.invoiceNo} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar me-1"></i> Invoice Date</label>
                                        <input type="date" id="addinvoiceDate" onChange={handleChange} value={form.invoiceDate} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-calendar-check"></i> Installation Date</label>
                                        <input type="date" id="addinstallationDate" onChange={handleChange} value={form.installationDate} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-user-cog me-1"></i> Engineer Name<span className="text-red-400">*</span></label>
                                        <input type="text" id="addengineerName" onChange={handleChange} value={form.engineerName} className={`${inputStyle} ${formError.engineerName ?"border-red-500":"" }`} />
                                        {formError.engineerName && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.engineerName}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-phone me-1"></i> Engineer Contact<span className="text-red-400">*</span></label>
                                        <input type="text" id="addengineerContact" onChange={handleChange} value={form.engineerContact} className={`${inputStyle} ${formError.engineerContact ?"border-red-500":""}`} />
                                         {formError.engineerContact && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.engineerContact}
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* ITEM TABLE */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg text-green-400 font-semibold flex items-center gap-2">
                                        <i className="fas fa-boxes"></i> Item Details
                                    </h3>

                                    <button type="button" className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition" onClick={addItem}>
                                        <i className="fas fa-plus mr-2"></i> Add Item
                                    </button>
                                </div>

                                <div className="w-full overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full min-w-[900px] text-sm text-gray-300">
                                        <thead className="bg-white/5 text-gray-400">
                                            <tr>
                                                <th className="p-3">S.No</th>
                                                <th className="p-3 w-[300px]">Item</th>
                                                <th className="p-3 w-[250px]">Manufacturer</th>
                                                <th className="p-3">Serial</th>
                                                <th className="p-3">Model</th>
                                                <th className="p-3 w-[80px]">Qty</th>
                                                <th className="p-3">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {items.map((row, index) => (
                                                <tr className="border-t border-white/10 hover:bg-white/5 " key={index}>

                                                    <td className="p-5">{index + 1}</td>
                                                    <td className="p-3"><input type="text"
                                                        value={row.item}
                                                        onChange={(e) => handleItemChange(index, "item", e.target.value)}
                                                        className={`${inputStyle} min-w-[120px]`} />
                                                    </td >
                                                    <td className="p-3"><input type="text"
                                                        value={row.manufacturer}
                                                        onChange={(e) => handleItemChange(index, "manufacturer", e.target.value)}
                                                        className={`${inputStyle} min-w-[120px]`} />
                                                    </td >
                                                    <td className="p-3"><input type="text"
                                                        value={row.serial}
                                                        onChange={(e) => handleItemChange(index, "serial", e.target.value)}
                                                        className={`${inputStyle} min-w-[120px]`} /></td>
                                                    <td className="p-3"><input type="text"
                                                        value={row.model}
                                                        onChange={(e) => handleItemChange(index, "model", e.target.value)}
                                                        className={`${inputStyle} min-w-[120px]`} /></td>
                                                    <td><input type="number"
                                                        min={0}
                                                        value={row.qty}
                                                        onChange={(e) => handleItemChange(index, "qty", Number(e.target.value))}
                                                        className={`${inputStyle} min-w-[120px]`} /></td>
                                                    <td className="text-center">
                                                        <button type="button" onClick={() => deleteItem(index)} className="text-red-400 hover:text-red-500">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>

                            {/* CONFIRMATION */}
                            <div>
                                <h3 className="text-lg text-orange-400 font-semibold mb-4 flex items-center gap-2">
                                    <i className="fas fa-check-circle"></i> Confirmation Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-shield-alt me-1"></i> Warranty Period(Years)<span className="text-red-400">*</span></label>
                                        <input type="number" id="addwarranty" value={form.warranty} onChange={handleChange} placeholder="Warranty (Years)" className={`${inputStyle} ${formError.warranty?"border-red-500":""}`} />
                                         {formError.warranty && (
                                            <p className="text-red-400 text-sm ">
                                                {formError.warranty}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1"><i className="fas fa-desktop me-1"></i> Demo Given</label>

                                        <div className="flex gap-8 mt-2">

                                            <label className="flex items-center gap-2 cursor-pointer text-white">
                                                <input
                                                    type="radio"
                                                    name="demoGiven"
                                                    value="Yes"
                                                    checked={form.demoGiven === "Yes"}
                                                    onChange={(e) => setForm({ ...form, demoGiven: e.target.value })}
                                                    className="accent-cyan-500"
                                                />
                                                Yes
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer text-white">
                                                <input
                                                    type="radio"
                                                    name="demoGiven"
                                                    value="No"
                                                    checked={form.demoGiven === "No"}
                                                    onChange={(e) => setForm({ ...form, demoGiven: e.target.value })}
                                                    className="accent-red-500"
                                                />
                                                No
                                            </label>

                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1"><i className="fas fa-chalkboard-teacher me-1"></i> Training Given</label>

                                        <div className="flex gap-8 mt-2">

                                            <label className="flex items-center gap-2 cursor-pointer text-white">
                                                <input
                                                    type="radio"
                                                    name="trainingGiven"
                                                    value="Yes"
                                                    checked={form.trainingGiven === "Yes"}
                                                    onChange={(e) => setForm({ ...form, trainingGiven: e.target.value })}
                                                    className="accent-cyan-500"
                                                />
                                                Yes
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer text-white">
                                                <input
                                                    type="radio"
                                                    name="trainingGiven"
                                                    value="No"
                                                    checked={form.trainingGiven === "No"}
                                                    onChange={(e) => setForm({ ...form, trainingGiven: e.target.value })}
                                                    className="accent-red-500"
                                                />
                                                No
                                            </label>

                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-play-circle me-1"></i> Event Start</label>
                                        <input type="datetime-local" id="addeventStart" value={form.eventStart} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1"><i className="fas fa-stop-circle me-1"></i> Event End</label>
                                        <input type="datetime-local" id="addeventEnd" value={form.eventEnd} onChange={handleChange} className={inputStyle} />
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
                                    {addloading ? <><div className="w-4 h-4 me-2 border-2 border-white border-b-transparent rounded-full animate-spin"></div> {editmode ? "Updating.." : "Saving.."}</> : <span><i className="fas fa-save mr-2"  ></i>{editmode ? "UpdateData" : "SaveData"}</span>}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}


            {/*VIEW FORM DETAILS*/}
            {activeTab === 'view' && (
                <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
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
                                        <div className="text-gray-400 mb-2">Invoice No</div>
                                        <div className="text-white">{r.invoiceNo}</div>
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
                                <Detail label="Customer Name" value={selectedRecord.customerName} />
                                <Detail label="Address" value={selectedRecord.address} />
                                <Detail label="City" value={selectedRecord.city} />
                                <Detail label="Contact" value={selectedRecord.customerContact} />

                            </div>
                        </div>

                        {/* ENGINEER */}
                        <div className="mb-6">
                            <h4 className="text-lg text-purple-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-user-cog"></i> Engineer Information
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                                <Detail label="Invoice No" value={selectedRecord.invoiceNo} />
                                <Detail label="Invoice Date" value={selectedRecord.invoiceDate} />
                                <Detail label="Installation Date" value={selectedRecord.installationDate} />
                                <Detail label="Engineer Name" value={selectedRecord.engineerName} />
                                <Detail label="Engineer Contact" value={selectedRecord.engineerContact} />

                            </div>
                        </div>

                        {/* ITEM TABLE */}
                        <div className="mb-6">
                            <h4 className="text-lg text-green-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-boxes"></i> Item Details
                            </h4>

                            <div className="overflow-x-auto rounded-lg border border-white/10">

                                <table className="w-full min-w-[700px] text-sm text-gray-300">

                                    <thead className="bg-white/5 text-gray-400">
                                        <tr>
                                            <th className="p-2 text-left">S.No</th>
                                            <th className="p-2 text-left">Item</th>
                                            <th className="p-2 text-left">Manufacturer</th>
                                            <th className="p-2 text-left">Serial</th>
                                            <th className="p-2 text-left">Model</th>
                                            <th className="p-2 text-left">Qty</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedRecord?.items?.length > 0 ? (
                                            selectedRecord.items.map((item, index) => (
                                                <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                                                    <td className="p-2">{index + 1}</td>
                                                    <td className="p-2">{item.item}</td>
                                                    <td className="p-2">{item.manufacturer}</td>
                                                    <td className="p-2">{item.serial}</td>
                                                    <td className="p-2">{item.model}</td>
                                                    <td className="p-2">{item.qty}</td>
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

                        {/* CONFIRMATION */}
                        <div className="mb-6">
                            <h4 className="text-lg text-orange-400 mb-3 flex items-center gap-2">
                                <i className="fas fa-check-circle"></i> Confirmation Details
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                                <Detail label="Warranty" value={selectedRecord.warranty} />
                                <Detail label="Demo Given" value={selectedRecord.demoGiven} />
                                <Detail label="Training Given" value={selectedRecord.trainingGiven} />
                                <Detail label="Event Start" value={formatDateTime(selectedRecord.eventStart)} />
                                <Detail label="Event End" value={formatDateTime(selectedRecord.eventEnd)} />
                                

                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3">

                            <button className="px-4 py-2 rounded-lg bg-purple-600  text-white hover:bg-purple-700" onClick={()=>handlePrint(selectedRecord)}>
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