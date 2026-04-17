import { useState, useEffect, useRef, useCallback } from "react";
import "./Whole.css";
import axios from "axios";

export default function Records() {
  const [success, setSuccess] = useState('')
  const[formError,setFormError]=useState({})
  const[loading,setLoading]=useState(false)
  const [addloading,setaddLoading]=useState(false);
 const [editloading,seteditLoading]=useState(false);
  const [error, setError] = useState('')
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    stage: [],
    hospital: [],
    product: [],
    distributor: [],
    salesPerson: [],
  });
function formatMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
 
  {/*CheckBox inside Serach Filter*/ }
  const [search, setSearch] = useState({
    hospital: "",
    distributor: "",
    salesPerson: "",
    stage: "",
    product: ""
  });
  const handleSearchChange = (type, value) => {
    setSearch(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getFilteredList = (list, type) => {
    return list.filter(item =>
      item.toLowerCase().includes(search[type].toLowerCase())
    );
  };
  {/*CheckBox inside Serach Filter*/ }
  // Filter options state
  const [hospitals, setHospitals] = useState([]);
  const [products, setProducts] = useState(['HOPE 10K', 'PHACO', 'ANT6000', 'ANT5000', 'A/B SCAN', 'A/B/P SCAN', 'B SCAN']);
  const [distributors, setDistributors] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  {/*End CheckBox inside Serach Filter*/ }

  {/*Checkbox inside unique name prevent Duplication*/ }
  // Extract unique filter options from records
  const extractFilterOptions = (data) => {
    const uniqueHospitals = [...new Set(data.map((r) => r.hospitalName.toUpperCase()).filter(Boolean))];
    const uniqueProducts = [...new Set(data.map((r) => r.productName.toUpperCase()).filter(Boolean))];
    const uniqueDistributors = [...new Set(data.map((r) => r.distributorName.toUpperCase()).filter(Boolean))];
    const uniqueSalesPersons = [...new Set(data.map((r) => r.salesPerson.toUpperCase()).filter(Boolean))];
    setHospitals(uniqueHospitals);
    setProducts(prev => [
      ...new Set([
        ...prev,           // keep default products
        ...uniqueProducts  // add backend products
      ])
    ]);
    setDistributors(uniqueDistributors);
    setSalesPersons(uniqueSalesPersons);
  };
  {/*End Checkbox inside unique name prevent Duplication*/ }
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState("");

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);

  const today=()=> new Date().toISOString().split("T")[0];

  // Form states
  const [addForm, setAddForm] = useState({
    date: today(),
    drName: "",
    hospitalName: "",
    productName: "",
    currentUnit: "",
    place: "",
    state: "",
    phone: "",
    email: "",
    distributorName: "",
    salesPerson: "",
    pipelineStage: "",
    potentialValue: "",
    winningPercentage: "",
    buyingPercentage: "",
    forecastMonth: "",
    closedMonth: "",
    notes: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    date: "",
    drName: "",
    hospitalName: "",
    productName: "",
    currentUnit: "",
    place: "",
    state: "",
    phone: "",
    email: "",
    distributorName: "",
    salesPerson: "",
    pipelineStage: "",
    potentialValue: "",
    winningPercentage: "",
    buyingPercentage: "",
    forecastMonth: "",
    closedMonth: "",
    notes: "",
    lastUpdated: "",
  });

  // Stage options
  const stageOptions = [
    "Prospecting",
    "DemoRequest",
    "DemoOn",
    "DemoCompleted",
    "Quoted",
    "Quote",
    "Negotiation",
    "Ordered",
    "Delivered",
    "Lost",
  ];

  // Load data from localStorage on mount
  const fetchRecords=async()=>{
    setLoading(true);
    try{
       const res=await axios.get("http://localhost:8085/api/records")       // ✅ actual backend data
        setRecords(res.data);
        setFilteredRecords(res.data);
        extractFilterOptions(res.data);
      }
      catch(err){
        console.log("API failed, using sample data",err);

        // fallback sample data
        const sampleData = [
          {
            id: Date.now(),
            date: "2024-03-15",
            drName: "Dr. Smith Johnson",
            hospitalName: "City Hospital",
            productName: "MediScan Pro",
            distributorName: "MediDistributors Inc",
            salesPerson: "John Carter",
            pipelineStage: "Negotiation",
            potentialValue: 50000,
            winningPercentage: 70,
            buyingPercentage: 80,
          }
        ];

        setRecords(sampleData);
        setFilteredRecords(sampleData);
        extractFilterOptions(sampleData);
      }
      finally{
        setLoading(false)
      }
  }
  
    useEffect(() => {
      fetchRecords();
      }, []);

 const validateForm = () => {
        let newErrors = {};

        if (!addForm.drName.trim()) {
            newErrors.drName = "Drname is required";
        }
         if (!addForm.currentUnit.trim()) {
            newErrors.currentUnit = "Currentunit is required";
        }

        if (!addForm.hospitalName.trim()) {
            newErrors.hospitalName = "Hospitalname is required";
        }

        if (!addForm.productName.trim()) {
            newErrors.productName= "Product is required";
        } 

        if (!addForm.distributorName.trim()) {
            newErrors.distributorName = "Distributor Name required";
        }
        if (!addForm.pipelineStage.trim()) {
            newErrors.pipelineStage= "Pipelinestage is required";
        }


         
         if (!addForm.salesPerson.trim()) {
            newErrors.salesPerson = "SalesPerson is required";
        }
         



        setFormError(newErrors);
        console.log(newErrors);
        return Object.keys(newErrors).length === 0;
    };


  // Calculate total percentage
  const calculateTotalPercentage = (winning, buying) => {
    const win = parseFloat(winning) || 0;
    const buy = parseFloat(buying) || 0;
    return (win + buy) / 2;
  };

  // Calculate weighted forecast
  const calculateWeightedForecast = (potential, totalPercentage) => {
    const pot = parseFloat(potential) || 0;
    const total = parseFloat(totalPercentage) || 0;
    return (pot * total) / 100;
  };

  // Handle form changes
  const handleAddFormChange = (e) => {
    const { id, value } = e.target;
    setAddForm((prev) => {
      const updated = { ...prev, [id.replace("add", "").charAt(0).toLowerCase() + id.slice(4)]: value };

      if (id === "addWinningPercentage" || id === "addBuyingPercentage" || id === "addPotentialValue") {
        const total = calculateTotalPercentage(
          id === "addWinningPercentage" ? value : updated.winningPercentage,
          id === "addBuyingPercentage" ? value : updated.buyingPercentage
        );
        updated.totalPercentage = total.toFixed(2);
        updated.weightedForecast = calculateWeightedForecast(
          id === "addPotentialValue" ? value : updated.potentialValue,
          total
        ).toFixed(2);
      }
      return updated;
    });
  };

  const handleEditFormChange = (e) => {
    const { id, value } = e.target;
    setEditForm((prev) => {

      const updated = { ...prev, [id.replace("edit", "").charAt(0).toLowerCase() + id.slice(5)]: value };

      if (id === "editWinningPercentage" || id === "editBuyingPercentage" || id === "editPotentialValue") {
        const total = calculateTotalPercentage(
          id === "editWinningPercentage" ? value : updated.winningPercentage,
          id === "editBuyingPercentage" ? value : updated.buyingPercentage
        );
        updated.totalPercentage = total.toFixed(2);
        updated.weightedForecast = calculateWeightedForecast(
          id === "editPotentialValue" ? value : updated.potentialValue,
          total
        ).toFixed(2);
      }
      return updated;
    });
  };

  // Add new record
  const addRecord = async () => {
    
    if (!validateForm()) {
      setError("Please fill all required fields");
      setTimeout(()=>{setError("")},1000)
      return;
    }

    const totalPercentage = calculateTotalPercentage(addForm.winningPercentage, addForm.buyingPercentage);
    const weightedForecast = calculateWeightedForecast(addForm.potentialValue, totalPercentage);

    const newRecord = {
      date: addForm.date,
      drName: addForm.drName,
      hospitalName: addForm.hospitalName,
      productName: addForm.productName,
      currentUnit: addForm.currentUnit,
      place: addForm.place,
      state: addForm.state,
      phone: addForm.phone,
      email: addForm.email,
      distributorName: addForm.distributorName,
      salesPerson: addForm.salesPerson,
      pipelineStage: addForm.pipelineStage,
      potentialValue: parseFloat(addForm.potentialValue) || 0,
      winningPercentage: parseFloat(addForm.winningPercentage) || 0,
      buyingPercentage: parseFloat(addForm.buyingPercentage) || 0,
      totalPercentage: totalPercentage.toFixed(2),
      weightedForecast: weightedForecast.toFixed(2),
      forecastMonth: addForm.forecastMonth,
      closedMonth: addForm.closedMonth,
      notes: addForm.notes,
      lastUpdated: new Date().toISOString(),
    };
    try {
      setaddLoading(true)
      const res = await axios.post("http://localhost:8085/api/records", newRecord)
      setSuccess('Record added successfully!')
      setTimeout(() => {
        setSuccess('')
      }, 3000)
      setRecords(prev => [res.data, ...prev]);
      setFilteredRecords(prev => [...prev, res.data]);
      extractFilterOptions([...records, res.data]);
      setShowAddModal(false);
       resetAddForm();
      await fetchRecords();
     

    }
    catch (err) {
      console.log(err.response?.data || 'Signup Failed')
      setError('Error adding record. Please try again.')
      setTimeout(() => {
        setError('')
      }, 3000)
    }
   finally{
    setaddLoading(false)
   }
  };



  // Edit record
  const editRecord = async () => {
    try {
      seteditLoading(true)
      const totalPercentage = calculateTotalPercentage(
        editForm.winningPercentage,
        editForm.buyingPercentage
      );
      
      const weightedForecast = calculateWeightedForecast(
        editForm.potentialValue,
        totalPercentage
      );

      const updatedData = {
        ...editForm,
        totalPercentage: totalPercentage.toFixed(2),
        weightedForecast: weightedForecast.toFixed(2),
        lastUpdated: new Date().toISOString(),
      };

      const res = await axios.put(
        `http://localhost:8085/api/records/${editForm.id}`,
        updatedData
      );

      const updatedList = records.map((r) =>
        r.id === editForm.id ? res.data : r
      );
      setSuccess('Record Updated Successfully ')
      setTimeout(() => {
        setSuccess('')
      }, 3000)
      setRecords(updatedList);
      setFilteredRecords(updatedList);
      extractFilterOptions(updatedList);
      setShowEditModal(false);
      await fetchRecords();

    } catch (err) {
      console.log(err.response?.data || "Update Failed");
      setError('Error Updating record. Please try again.')
      setTimeout(() => {
        setError('')
      }, 3000)
    }
    finally{
      seteditLoading(false)
    }
  };


  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:8085/api/records/${id}`);

      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      setFilteredRecords(updated);
      extractFilterOptions(updated);
      await fetchRecords();

    } catch (err) {
      console.log(err || "Delete Failed");
    }
  };
  // Add new product
  const addNewProduct = () => {
    if (newProduct.trim()) {
      setProducts(prev => [...prev, newProduct.trim()]);
      setNewProduct("");
      setShowProductModal(false);
      alert("Product added successfully!");
    }
  };

  // Filter and search
  useEffect(() => {
    let filtered = [...records];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.drName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.stage.length) {
      filtered = filtered.filter((record) =>
        filters.stage.some(
          (s) => s.toLowerCase() === record.pipelineStage?.toLowerCase()
        )
      );
    }

    if (filters.hospital.length) {
      filtered = filtered.filter((record) =>
        filters.hospital.some(
          (h) => h.toLowerCase() === record.hospitalName?.toLowerCase()
        )
      );
    }

    if (filters.product.length) {
      filtered = filtered.filter((record) =>
        filters.product.some(
          (p) => p.toLowerCase() === record.productName?.toLowerCase()
        )
      );
    }

    if (filters.distributor.length) {
      filtered = filtered.filter((record) =>
        filters.distributor.some(
          (d) => d.toLowerCase() === record.distributorName?.toLowerCase()
        )
      );
    }

    if (filters.salesPerson.length) {
      filtered = filtered.filter((record) =>
        filters.salesPerson.some(
          (sp) => sp.toLowerCase() === record.salesPerson?.toLowerCase()
        )
      );
    }
    setFilteredRecords(filtered);
  }, [searchTerm, filters, records]);

  const resetAddForm = () => {
    setAddForm({
      date: "",
      drName: "",
      hospitalName: "",
      productName: "",
      currentUnit: "",
      place: "",
      state: "",
      phone: "",
      email: "",
      distributorName: "",
      salesPerson: "",
      pipelineStage: "",
      potentialValue: "",
      winningPercentage: "",
      buyingPercentage: "",
      forecastMonth: "",
      closedMonth: "",
      notes: "",
    });
  };

  const openEditModal = (record) => {
    setEditForm({
      id: record.id,
      date: record.date || "",
      drName: record.drName || "",
      hospitalName: record.hospitalName || "",
      productName: record.productName || "",
      currentUnit: record.currentUnit || "",
      place: record.place || "",
      state: record.state || "",
      phone: record.phone || "",
      email: record.email || "",
      distributorName: record.distributorName || "",
      salesPerson: record.salesPerson || "",
      pipelineStage: record.pipelineStage || "",
      potentialValue: record.potentialValue || "",
      winningPercentage: record.winningPercentage || "",
      buyingPercentage: record.buyingPercentage || "",
      totalPercentage: record.totalPercentage || "",
      weightedForecast: record.weightedForecast || "",
      forecastMonth: record.forecastMonth || "",
      closedMonth: record.closedMonth || "",
      notes: record.notes || "",
      lastUpdated: record.lastUpdated ? new Date(record.lastUpdated).toLocaleString() : "",
    });
    setShowEditModal(true);
  };

  const clearAllFilters = () => {
    setFilters({
      stage: [],
      hospital: [],
      product: [],
      distributor: [],
      salesPerson: [],
    });
    setSearchTerm("");
  };

  const handleCheckboxFilter = (filterType, value, checked) => {
    setFilters((prev) => {
      const current = prev[filterType];
      if (checked) {
        return { ...prev, [filterType]: [...current, value] };
      } else {
        return { ...prev, [filterType]: current.filter((v) => v !== value) };
      }
    });
  };

  const getStageColor = (stage) => {
    const colors = {
      Prospecting: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
      DemoRequest: "bg-teal-500/20 text-teal-400 border border-teal-500/40",
      DemoOn: "bg-purple-500/20 text-purple-400 border border-purple-500/40",
      DemoCompleted: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40",
      Quoted: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
      Quote: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
      Negotiation: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
      Ordered: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
      Delivered: "bg-green-500/20 text-green-400 border border-green-500/40",
      Lost: "bg-red-500/20 text-red-400 border border-red-500/40",
    };
    return colors[stage] || "bg-gray-700 text-gray-300";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
  const handlePrint = () => {

    const printwindow = window.open('', '_blank');
    const printDate = new Date().toLocaleDateString();

    const content = (`
    <!DOCTYPE html>
<html>
<head>
  <title>Sales Pipeline Report - ${printDate}</title>

  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 30px;
      color: #2d3748;
      background: #fff;
    }

    .container {
      max-width: 1000px;
      margin: auto;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }

    .company {
      font-size: 22px;
      font-weight: bold;
      color: #4f46e5;
    }

    .report-title {
      font-size: 18px;
      color: #555;
    }

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin: 10px 0 20px;
      color: #666;
    }

    /* TABLE */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      border-radius: 8px;
      overflow: hidden;
    }

    th {
      background: linear-gradient(90deg, #4f46e5, #6366f1);
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    tr:nth-child(even) {
      background-color: #f9fafb;
    }

    tr:hover {
      background-color: #eef2ff;
    }

    /* STATUS BADGE */
    .badge {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 500;
      background: #e0e7ff;
      color: #3730a3;
    }

    /* TOTAL ROW */
    .total-row {
      background: #eef2ff;
      font-weight: bold;
      font-size: 15px;
    }

    /* FOOTER */
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #888;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }

    @media print {
      body {
        margin: 10px;
      }
    }
  </style>
</head>

<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="company">KINYA MEDICAL SYSTEMS</div>
        <div class="report-title">Sales Pipeline Report</div>
      </div>
      <div style="text-align: right; font-size: 12px;">
        <div><strong>Date:</strong> ${printDate}</div>
        <div><strong>Records:</strong> ${filteredRecords.length}</div>
      </div>
    </div>

    <!-- TABLE -->
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Doctor</th>
          <th>Hospital</th>
          <th>Product</th>
          <th>Stage</th>
          <th>Value (₹)</th>
        </tr>
      </thead>

      <tbody>
        ${filteredRecords.map(record => {
      const recordDate = new Date(record.date);

      const formattedDate = recordDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const stageText = record.pipelineStage
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return `
            <tr>
              <td>${formattedDate}</td>
              <td>${record.drName}</td>
              <td>${record.hospitalName}</td>
              <td>${record.productName || '-'}</td>
              <td><span class="badge">${stageText}</span></td>
              <td>${formatCurrency(record.potentialValue)}</td>
            </tr>
          `;
    }).join('')}

        <!-- TOTAL -->
        <tr class="total-row">
          <td colspan="5" style="text-align:right;">Total Value:</td>
          <td>
            ${formatCurrency(
      filteredRecords.reduce(
        (sum, record) => sum + record.potentialValue,
        0
      )
    )}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="footer">
      Generated by Kinya Analytics System
    </div>

  </div>
</body>
</html>
  `);
    printwindow.document.write(content)
    printwindow.document.close();
    printwindow.print();
  };
  const currentUser = localStorage.getItem("user");
  return (


    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-12 h-12 border-2 border-sky-500 border-t-transparent rounded-full animate-spin items-center justify-center text-xl text-sky-500  flex backdrop-blur-xs"><i className='fas fa-user-doctor'></i></div>
    </div>
}

      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Sales Pipeline Management
          </h1>
          <p className="text-gray-400 mt-2">Track and manage your sales records efficiently</p>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Stage Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-filter mr-2 text-blue-400"></i>Pipeline Stage
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "stage" ? null : "stage")}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-left text-gray-300 flex justify-between items-center hover:border-gray-600 transition-colors"
                >
                  <span>{filters.stage.length ? `${filters.stage.length} selected` : "All Stages"}</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                {openDropdown === "stage" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 sticky top-0 bg-gray-900 border-b border-gray-700">
                      <input
                        type="text"
                        value={search.stage}
                        onChange={(e) => handleSearchChange("stage", e.target.value)}
                        placeholder="Search stages..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                      />
                    </div>
                    <div className="p-2">
                      {getFilteredList(stageOptions, "stage").map((stage) => (
                        <label key={stage} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.stage.includes(stage)}
                            onChange={(e) => handleCheckboxFilter("stage", stage, e.target.checked)}
                            className="rounded border-gray-600 bg-gray-800 text-blue-500"
                          />
                          <span className="text-gray-300">{stage}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Hospital Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-hospital mr-2 text-blue-400"></i>Hospital
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "hospital" ? null : "hospital")}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-left text-gray-300 flex justify-between items-center hover:border-gray-600"
                >
                  <span>{filters.hospital.length ? `${filters.hospital.length} selected` : "All Hospitals"}</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                {openDropdown === "hospital" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 sticky top-0 bg-gray-900 border-b border-gray-700">
                      <input
                        type="text"
                        value={search.hospital}
                        onChange={(e) => handleSearchChange("hospital", e.target.value)}
                        placeholder="Search hospitals..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                      />
                    </div>
                    <div className="p-2">
                      {getFilteredList(hospitals, "hospital").map((hospital) => (
                        <label key={hospital} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.hospital.includes(hospital)}
                            onChange={(e) => handleCheckboxFilter("hospital", hospital, e.target.checked)}
                            className="rounded border-gray-600 bg-gray-800 text-blue-500"
                          />
                          <span className="text-gray-300">{hospital}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Distributor Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-hospital mr-2 text-blue-400"></i>Distributor
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "distributor" ? null : "distributor")}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-left text-gray-300 flex justify-between items-center hover:border-gray-600"
                >
                  <span>{filters.distributor.length ? `${filters.distributor.length} selected` : "All Distributor"}</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                {openDropdown === "distributor" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 sticky top-0 bg-gray-900 border-b border-gray-700">
                      <input
                        type="text"
                        value={search.distributor}
                        onChange={(e) => handleSearchChange("distributor", e.target.value)}
                        placeholder="Search Distributor.."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                      />
                    </div>
                    <div className="p-2">
                      {getFilteredList(distributors, "distributor").map((Distributor) => (
                        <label key={Distributor} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.distributor.includes(Distributor)}
                            onChange={(e) => handleCheckboxFilter("distributor", Distributor, e.target.checked)}
                            className="rounded border-gray-600 bg-gray-800 text-blue-500"
                          />
                          <span className="text-gray-300">{Distributor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SalesPerson Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-hospital mr-2 text-blue-400"></i>Sales Person
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "salesPerson" ? null : "salesPerson")}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-left text-gray-300 flex justify-between items-center hover:border-gray-600"
                >
                  <span>{filters.salesPerson.length ? `${filters.salesPerson.length} selected` : "All SalesPerson"}</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                {openDropdown === "salesPerson" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 sticky top-0 bg-gray-900 border-b border-gray-700">
                      <input
                        type="text"
                        value={search.salesPerson}
                        onChange={(e) => handleSearchChange("salesPerson", e.target.value)}
                        placeholder="Search SalesPerson.."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                      />
                    </div>
                    <div className="p-2">
                      {getFilteredList(salesPersons, "salesPerson").map((salesPerson) => (
                        <label key={salesPerson} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.salesPerson.includes(salesPerson)}
                            onChange={(e) => handleCheckboxFilter("salesPerson", salesPerson, e.target.checked)}
                            className="rounded border-gray-600 bg-gray-800 text-blue-500"
                          />
                          <span className="text-gray-300">{salesPerson}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Product Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-cube mr-2 text-blue-400"></i>Product
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "product" ? null : "product")}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-left text-gray-300 flex justify-between items-center hover:border-gray-600"
                >
                  <span>{filters.product.length ? `${filters.product.length} selected` : "All Products"}</span>
                  <i className="fas fa-chevron-down text-gray-500"></i>
                </button>
                {openDropdown === "product" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 sticky top-0 bg-gray-900 border-b border-gray-700">
                      <input
                        type="text"
                        value={search.product}
                        onChange={(e) => handleSearchChange("product", e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                      />
                    </div>
                    <div className="p-2">
                      {getFilteredList(products, "product").map((product) => (
                        <label key={product} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.product.includes(product)}
                            onChange={(e) => handleCheckboxFilter("product", product, e.target.checked)}
                            className="rounded border-gray-600 bg-gray-800 text-blue-500"
                          />
                          <span className="text-gray-300">{product}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                <i className="fas fa-times"></i>
                Clear All
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-4">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search by doctor, hospital, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            
            <i className="fas fa-plus-circle"></i>
            Add New Record
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <i className="fas fa-print"></i>
            Print Records
          </button>
        </div>

        {/* Records Table */}
        <div id="print-section">
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    {["Date", "Doctor", "Hospital", "Product", "currentUnit", "Email", "Notes", "Distributor", "Sales Person", "Stage", "Potential (₹)", "Winning %", "Buying %", "Total %", "Forecast (₹)", "Forecast Month", "Closed Month", "Actions"].map((header) => (
                      <th key={header} className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="text-center py-12">
                        <i className="fas fa-inbox text-5xl text-gray-600 mb-3 block"></i>
                        <p className="text-gray-400">No records found. Add your first record to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-700/50 text-center hover:bg-gray-800/50 transition-colors">
                        <td className="px-6  py-3   text-gray-300">{record.date}</td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-200">{record.drName}</div>
                          <div className="text-sm text-cyan-400">{record.phone}</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-gray-300">{record.hospitalName}</div>
                          <div className="text-sm text-cyan-400">{record.place}, {record.state}</div>
                        </td>
                        <td className="px-6 py-3 text-gray-300">{record.productName}</td>
                        <td className="px-6 py-3 text-gray-300">{record.currentUnit}</td>
                        <td className="px-6 py-3 text-gray-300">{record.email}</td>
                        <td className="px-6 py-3 text-gray-300">{record.notes}</td>
                        <td className="px-6 py-3 text-gray-300">{record.distributorName}</td>
                        <td className="px-6 py-3 text-gray-300">
                          {record.salesPerson?.toLowerCase() === currentUser?.toLowerCase() ? (
                            <span className="bg-green-600/20 border border-green-400/40 text-white text-xs px-2 py-1 rounded-full">
                              {record.salesPerson}
                            </span>) : (<span >{record.salesPerson}</span>)}

                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-4 flex justify-center  py-1 rounded-full text-xs font-medium ${getStageColor(record.pipelineStage)}`}>
                            {record.pipelineStage}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-300">{formatCurrency(record.potentialValue)}</td>
                        <td className="px-6 py-3 text-gray-300">{record.winningPercentage}%</td>
                        <td className="px-6 py-3 text-gray-300">{record.buyingPercentage}%</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${record.totalPercentage || 0}%` }}></div>
                            </div>
                            <span className="text-gray-300">{record.totalPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-green-400">{formatCurrency(record.weightedForecast)}</td>
                        <td className="px-6 py-3 text-gray-300">{formatMonth(record.forecastMonth)}</td>
                        <td className="px-6 py-3 text-gray-300">{formatMonth(record.closedMonth)}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(record)}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => deleteRecord(record.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1"
                              title="Delete"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <i className="fas fa-plus-circle text-blue-400"></i>
                Add New Record
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-200 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date <span className="text-red-400">*</span></label>
                    <input type="date" id="addDate" onChange={handleAddFormChange} value={addForm.date} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Doctor Name <span className="text-red-400">*</span></label>
                    <input type="text" id="addDrName" onChange={handleAddFormChange} value={addForm.drName} placeholder="Enter Doctor's Name" className={`${"w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 "} ${formError.drName ? "border-red-500":"" }`} />
                       {formError.drName && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.drName}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hospital Name <span className="text-red-400">*</span></label>
                    <input type="text" id="addHospitalName" onChange={handleAddFormChange} value={addForm.hospitalName} placeholder="Enter Hospital Name" className={`${"w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"} ${formError.hospitalName ? "border-red-500":""}`} />
                        {formError.hospitalName && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.hospitalName}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact No</label>
                    <input type="text" id="addPhone" onChange={handleAddFormChange} value={addForm.phone} placeholder="Enter Contact Number" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Product Name <span className="text-red-400">*</span></label>
                    <div className="flex gap-2">
                      <select id="addProductName" onChange={handleAddFormChange} value={addForm.productName} className={`${"flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"} ${formError.productName ? "border-red-500":""}`}>
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
              
                      <button type="button" onClick={() => setShowProductModal(true)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 rounded-lg">
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                           {formError.productName && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.productName}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Unit <span className="text-red-400">*</span></label>
                    <input type="text" id="addCurrentUnit" onChange={handleAddFormChange} value={addForm.currentUnit} placeholder="Enter Current Unit" className={`${"w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"} ${formError.currentUnit ? "border-red-500":""}`} />
                           {formError.currentUnit && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.currentUnit}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email </label>
                    <input type="text" id="addEmail" onChange={handleAddFormChange}  value={addForm.email} placeholder="Enter Email Id" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Place</label>
                    <input type="text" id="addPlace" onChange={handleAddFormChange} value={addForm.place} placeholder="Enter Place " className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                    <input type="text" id="addState" onChange={handleAddFormChange} value={addForm.state} placeholder="Enter State" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Distributor Name <span className="text-red-400">*</span></label>
                    <input type="text" id="addDistributorName" onChange={handleAddFormChange} value={addForm.distributorName} placeholder="Enter Distributor Name" className={`${"w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"} ${formError.distributorName ? "border-red-500":""}`} />
                           {formError.distributorName && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.distributorName}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sales Person <span className="text-red-400">*</span></label>
                    <input type="text" id="addSalesPerson" onChange={handleAddFormChange} value={addForm.salesPerson} placeholder="Enter SalesPerson Namer" className={`${"w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"} ${formError.salesPerson ?"border-red-500":"" }`} />
                           {formError.salesPerson && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.salesPerson}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Pipeline Stage<span className="text-red-400">*</span></label>
                    <select id="addPipelineStage" onChange={handleAddFormChange} value={addForm.pipelineStage} className={`${"w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"} ${formError.pipelineStage ?"border-red-500":""}`}>
                      <option value="">Select Stage</option>
                      {stageOptions.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                           {formError.pipelineStage && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {formError.pipelineStage}
                                            </p>
                                        )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Potential Value (₹)</label>
                    <input type="number" id="addPotentialValue" onChange={handleAddFormChange} value={addForm.potentialValue} placeholder="Enter Potential Value" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Winning %</label>
                    <input type="number" id="addWinningPercentage" onChange={handleAddFormChange} value={addForm.winningPercentage} placeholder="Winning %" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Buying %</label>
                    <input type="number" id="addBuyingPercentage" onChange={handleAddFormChange} value={addForm.buyingPercentage} placeholder="Buying %" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Total %</label>
                    <input type="text" id="addTotalPercentage" value={addForm.totalPercentage || ""} readOnly className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Weighted Forecast (₹)</label>
                    <input type="text" id="addWeightedForecast" value={addForm.weightedForecast || ""} readOnly className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-green-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Forecast Month</label>
                    <input type="month" id="addForecastMonth" onChange={handleAddFormChange} value={addForm.forecastMonth} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Closed Month</label>
                    <input type="month" id="addClosedMonth" onChange={handleAddFormChange} value={addForm.closedMonth}  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                    <textarea id="addNotes" rows="3" onChange={handleAddFormChange} value={addForm.notes} placeholder="Additional notes..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">Cancel</button>
              <button onClick={addRecord} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors flex gap-2" disabled={addloading}>
                {addloading? <><div className="w-4 h-4 p-2 border-2 border-white border-b-transparent rounded-full animate-spin"></div>Saving..</>:"SaveRecord"}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <i className="fas fa-edit text-blue-400"></i>
                Edit Record
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-200 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1"><i class="fas fa-calendar"></i> Date</label>
                    <input type="date" id="editDate" value={editForm.date} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1"><i class="fas fa-user-md"></i> Doctor Name</label>
                    <input type="text" id="editDrName" value={editForm.drName} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hospital Name</label>
                    <input type="text" id="editHospitalName" value={editForm.hospitalName} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Conctact No</label>
                    <input type="text" id="editPhone" value={editForm.phone} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                    <div className="flex gap-2">
                      <select id="editProductName" value={editForm.productName} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300">
                        {products.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setShowProductModal(true)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 rounded-lg">
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Current unit</label>
                    <input type="text" id="editCurrentUnit" value={editForm.currentUnit} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input type="email" id="editEmail" value={editForm.email} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Place</label>
                    <input type="text" id="editPlace" value={editForm.place} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input type="text" id="editState" value={editForm.state} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Distributor Name</label>
                    <input type="text" id="editDistributorName" value={editForm.distributorName} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sales Person</label>
                    <input type="text" id="editSalesPerson" value={editForm.salesPerson} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Pipeline Stage</label>
                    <select id="editPipelineStage" value={editForm.pipelineStage} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300">
                       <option value="">Select Stage</option>
                      {stageOptions.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Potential Value (₹)</label>
                    <input type="number" id="editPotentialValue" value={editForm.potentialValue} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Winning %</label>
                    <input type="number" id="editWinningPercentage" value={editForm.winningPercentage} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Buying %</label>
                    <input type="number" id="editBuyingPercentage" value={editForm.buyingPercentage} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Total %</label>
                    <input type="text" id="editTotalPercentage" value={editForm.totalPercentage} readOnly className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Weighted Forecast (₹)</label>
                    <input type="text" id="editWeightedForecast" value={formatCurrency(editForm.weightedForecast)} readOnly className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-green-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Forecast Month</label>
                    <input type="month" id="editForecastMonth" value={editForm.forecastMonth} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Closed Month</label>
                    <input type="month" id="editClosedMonth" value={editForm.closedMonth} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                    <textarea id="editNotes" rows="3" value={editForm.notes} onChange={handleEditFormChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg">Cancel</button>
              <button onClick={editRecord} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg flex gap-2" disabled={editloading}>
                 {editloading ? <><div className="w-4 h-4 p-2 border-2 border-white border-b-transparent rounded-full animate-spin"></div>Updating..</>:"Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100">Add New Product</h2>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-200 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                placeholder="Enter product name"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300"
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
              <button onClick={() => setShowProductModal(false)} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg">Cancel</button>
              <button onClick={addNewProduct} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg">Add Product</button>
            </div>
          </div>
        </div>

      )}

      {error && (
        <div className=" fixed top-20 right-5  flex items-center gap-2 border border-red-300/40 bg-red-500/20 text-red-300
       px-4 py-3 rounded-lg shadow-lg
       transform transition-all duration-500 ease-out z-50  translate-x-0 opacity-100">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {success && (
        <div className=" fixed top-20 right-5 flex items-center gap-2 border border-green-300/40 bg-green-500/20 text-green-300
       px-4 py-3 rounded-lg shadow-lg
       transform transition-all duration-500 ease-out z-50  translate-x-0 opacity-100
     ">
          <i className="fas fa-check-circle"></i>
          {success}
        </div>
      )}
    </div>

  );
}