import { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthProvider';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  // Sync theme with system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-yellow-400 font-semibold'
      : 'hover:text-yellow-300 data-[theme=dark]:hover:text-yellow-200';

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-3 py-2 rounded bg-yellow-400 font-semibold data-[theme=dark]:bg-yellow-500'
      : 'block px-3 py-2 rounded hover:bg-yellow-300 data-[theme=dark]:hover:bg-yellow-600';

  return (
    <nav className="bg-blue-700 text-white shadow-md data-[theme=dark]:bg-gray-800 data-[theme=dark]:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wide hover:text-yellow-400 data-[theme=dark]:hover:text-yellow-200">
              AthleticHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/hubs" className={navLinkClass}>Events</NavLink>

            {user ? (
              <>
                <NavLink to="/create-event" className={navLinkClass}>Book Event</NavLink>
                <NavLink to="/myBookings" className={navLinkClass}>My Bookings</NavLink>
                <NavLink to="/manageEvents" className={navLinkClass}>Manage Events</NavLink>

                {/* Profile Picture & Logout */}
                <div
                  className="relative"
                  onMouseEnter={() => setProfileDropdown(true)}
                  onMouseLeave={() => setProfileDropdown(false)}
                >
                  <img
                    src={user.photoURL || '/default-profile.png'}
                    alt={user.displayName || 'User'}
                    title={user.displayName || ''}
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-yellow-400 data-[theme=dark]:border-yellow-500"
                  />
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50 data-[theme=dark]:bg-gray-700 data-[theme=dark]:text-gray-100">
                      <p className="px-4 py-1 font-semibold border-b border-gray-300 data-[theme=dark]:border-gray-600">
                        {user.displayName || user.email}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 data-[theme=dark]:hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 data-[theme=dark]:bg-gray-600 data-[theme=dark]:text-gray-100 data-[theme=dark]:hover:bg-gray-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 8v8m-4-4h8" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 0020.354 15.354z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none data-[theme=dark]:text-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-2 pt-2 pb-4 space-y-1 data-[theme=dark]:bg-gray-700 data-[theme=dark]:text-gray-100">
          <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/hubs" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Events</NavLink>

          {user ? (
            <>
              <NavLink to="/create-event" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Book Event</NavLink>
              <NavLink to="/myBookings" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
              <NavLink to="/manageEvents" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Manage Events</NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-yellow-300 data-[theme=dark]:hover:bg-yellow-600"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
          )}

          {/* Theme Toggle in Mobile Menu */}
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 text-gray-800 data-[theme=dark]:hover:bg-gray-600 data-[theme=dark]:text-gray-100"
          >
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;