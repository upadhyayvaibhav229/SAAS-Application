import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Header = () => {
  const { isLoggedIn, userData, logoutUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Close dropdown when route changes
  useEffect(() => {
    setOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  // Navigation items for logged in users
  const navItems = [
    { path: "/dashboard", label: "Dashboard", show: isLoggedIn },
    { path: "/projects", label: "Projects", show: isLoggedIn && userData?.role !== "customer" },
    { path: "/profile", label: "Profile", show: isLoggedIn },
    { path: "/about", label: "About", show: isLoggedIn },
    { path: "/contact", label: "Contact", show: isLoggedIn },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to={isLoggedIn ? "/dashboard" : "/"} 
            className="flex items-center text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            {userData?.tenant?.name || "MyApp"}
            {userData?.tenant?.logo && (
              <img 
                src={userData.tenant.logo} 
                alt="Company Logo" 
                className="h-8 w-8 ml-2 rounded"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => 
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1 rounded transition-colors ${
                    location.pathname === item.path 
                      ? "bg-indigo-700 text-white" 
                      : "hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn && userData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-expanded={open}
                  aria-haspopup="true"
                >
                  <div className="hidden sm:block">
                    <span className="font-medium">{userData.fullName}</span>
                    <span className="text-sm text-gray-400 ml-2">({userData.role})</span>
                  </div>
                  {/* User avatar - fallback to initials if no image */}
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt={userData.fullName} 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      userData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>
                  <svg 
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {open && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-gray-900 rounded-lg shadow-xl p-4 z-50 border border-gray-200">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                        {userData.avatar ? (
                          <img 
                            src={userData.avatar} 
                            alt={userData.fullName} 
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          userData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{userData.fullName}</p>
                        <p className="text-sm text-gray-600">{userData.email}</p>
                      </div>
                    </div>
                    
                    <div className="py-3 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Company:</span> {userData?.tenant?.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Role:</span> {userData.role}
                      </p>
                      <p className="text-sm flex items-center">
                        <span className="font-medium">Email Verified:</span> 
                        {userData.isAccountVerified ? (
                          <span className="ml-1 text-green-600 font-bold">Yes ✅</span>
                        ) : (
                          <Link to={"/verify-email"} className="ml-1 text-red-600 font-bold">No ❌</Link>
                        )}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      <Link
                        to="/profile"
                        className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                  Signup
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden mobile-menu-button p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => 
                item.show && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded transition-colors ${
                      location.pathname === item.path 
                        ? "bg-indigo-700 text-white" 
                        : "hover:bg-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              
              {!isLoggedIn && (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link
                    to="/login"
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;