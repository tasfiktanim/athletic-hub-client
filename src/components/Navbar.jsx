// src/components/Navbar.jsx
import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthProvider';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wide hover:text-yellow-400">
              AthleticHub
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-300'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/hubs"
              className={({ isActive }) =>
                isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-300'
              }
            >
              Events
            </NavLink>

            {!user && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'text-yellow-400 font-semibold' : 'hover:text-yellow-300'
                }
              >
                Login
              </NavLink>
            )}

            {user && (
              <div
                className="relative"
                onMouseEnter={() => setProfileDropdown(true)}
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <img
                  src={user.photoURL || '/default-profile.png'}
                  alt={user.displayName || 'User'}
                  title={user.displayName || ''}
                  className="h-10 w-10 rounded-full cursor-pointer border-2 border-yellow-400"
                />

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
                    <p className="px-4 py-1 font-semibold border-b border-gray-300">
                      {user.displayName || user.email}
                    </p>
                    <Link
                      to="/create-event"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Book Event
                    </Link>
                    <Link
                      to="/myBookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileDropdown(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/manageEvents"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileDropdown(false)}
                    >
                      Manage Events
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
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

      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-2 pt-2 pb-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'block px-3 py-2 rounded bg-yellow-400 font-semibold' : 'block px-3 py-2 rounded hover:bg-yellow-300'
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? 'block px-3 py-2 rounded bg-yellow-400 font-semibold' : 'block px-3 py-2 rounded hover:bg-yellow-300'
            }
            onClick={() => setMenuOpen(false)}
          >
            Events
          </NavLink>

          {!user && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'block px-3 py-2 rounded bg-yellow-400 font-semibold' : 'block px-3 py-2 rounded hover:bg-yellow-300'
              }
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}

          {user && (
            <>
              <Link
                to="/create-event"
                className="block px-3 py-2 rounded hover:bg-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                Book Event
              </Link>
              <Link
                to="/myBookings"
                className="block px-3 py-2 rounded hover:bg-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                to="/manageEvents"
                className="block px-3 py-2 rounded hover:bg-yellow-300"
                onClick={() => setMenuOpen(false)}
              >
                Manage Events
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-yellow-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
