import { useState } from "react";
import axios from "axios";


const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [edit, setEdit] =useState(false);

  const [form, setForm] = useState({
    name: localStorage.getItem("user"),
    email: localStorage.getItem("email"),
  });

  const [loading, setLoading]=useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Update API call
  const handleUpdate = async () => {
    setLoading(true);

    try {
      await axios.put("http://localhost:8085/api/update", form);

      // update localStorage
      localStorage.setItem("user", form.name);
      localStorage.setItem("email", form.email);
      window.location.reload();
      setEdit(false);
      alert("Profile updated");

    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/50 z-50">

      <div className="border border-cyan-500/20 backdrop-blur-xl text-white p-6 rounded-xl w-96 shadow-lg relative">

        <button 
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">User Profile</h2>

        {/* 🔥 VIEW MODE */}
        {!edit ? (
          <>
            <div className=" p-3 mb-3 border rounded-lg font-sans bg-cyan-200/5 border-cyan-500/30 "><strong className="text-cyan-400">Name :</strong> {form.name}</div>
            <div  className="p-3 mb-3 border rounded-lg font-sans bg-cyan-200/5 border-cyan-500/30" ><strong className="text-cyan-400">Email :</strong> {form.email}</div>

            <button
              onClick={() => setEdit(true)}
              className="mt-2 px-4 py-2 bg-cyan-400 rounded-lg"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            {/* 🔥 EDIT MODE */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 mb-2 rounded bg-gray-800"
              placeholder="Name"
            />

            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-green-500 rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEdit(false)}
                className="px-4 py-2 bg-gray-500 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ProfileModal;    