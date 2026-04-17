import {  Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModa'




export default function Example() {
  const navigate=useNavigate()
 const [openModal, setOpenModal] = useState(false)

  const logout=()=>{
   localStorage.clear()
   navigate("/");
  }

  return (
          <div className="menu">
            <ProfileModal 
           isOpen={openModal} 
           onClose={() => setOpenModal(false)} 
         />
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
               <i className="fa-solid fa-user text-2xl size-9 rounded-full bg-gray-900 outline -outline-offset-6 outline-white/10 text-sky-200"></i>
                
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                    Your profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button onClick={logout}
                    
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                  >
                    Log out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          
          </div>
  )
}
