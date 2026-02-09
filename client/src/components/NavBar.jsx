import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/fulllogo_transparent (1).png";

const NavBar = () => {
  const user = { name: 'John Doe' }; // example user
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate('/');
  };

  return (
    <div className="shadow bg-black">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-50">
        
        <Link to="/">
          <img src={logo} alt="logo" className="h-11 w-auto" />
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <p className='max-sm:hidden'>Hi, {user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-purple-600 hover:bg-purple-700 text-white px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>

      </nav>
    </div>
  );
};

export default NavBar;
