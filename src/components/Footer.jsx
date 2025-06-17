import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-2">AthleticHub</h2>
          <p className="text-sm">
            Your ultimate destination to explore and book local athletic events. Join. Compete. Celebrate.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/events" className="hover:underline">All Events</Link></li>
            <li><Link to="/create-event" className="hover:underline">Create Event</Link></li>
            <li><Link to="/myBookings" className="hover:underline">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Connect With Us</h3>
          <p className="text-sm mb-2">Email: support@athletichub.com</p>
          <div className="flex space-x-4 text-lg">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-500">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-6">
        &copy; {new Date().getFullYear()} AthleticHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
