import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLoaderData, Link } from 'react-router';
import Spinner from '../components/Spinner';
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';
import useTitle from '../utils/titleSetter';
import axios from 'axios';

const HubDetails = () => {
  const hub = useLoaderData();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useTitle(hub?.title || hub?.eventName || 'Hub Details');

  const { title, eventName, location, date, image, category, _id, description } = hub;

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (user?.email) {
        try {
          setLoadingStatus(true);
          const token = user.accessToken
          const res = await axios.get(`https://athletic-hub-server-roan.vercel.app/bookings`, {
            params: {
              email: user.email,
              eventId: _id,
            },
            headers: {
              authorization: `Bearer ${token}`,
            },
          });

          if (res.data && res.data.exists) {
            setAlreadyBooked(true);
          }
        } catch (error) {
          console.error('Booking status check failed', error);
        } finally {
          setLoadingStatus(false);
        }
      }
    };

    checkBookingStatus();
  }, [user, _id]);

  if (!hub) return <Spinner />;

  const handleNavigateToBookings = () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to proceed.',
      });
      navigate('/login');
      return false;
    }
    return true;
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <img
        src={image || '/default-hub.jpg'}
        alt={title || eventName}
        className="w-full h-64 object-cover rounded-md mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{title || eventName}</h1>
      <p className="text-gray-600 mb-1"><strong>Type:</strong> {category}</p>
      <p className="text-gray-600 mb-1">
        <strong>Date:</strong> {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      <p className="text-gray-600 mb-1"><strong>Location:</strong> {location}</p>
      {description && (
        <p className="text-gray-700 mb-4"><strong>Description:</strong> {description}</p>
      )}

      {alreadyBooked ? (
        <button
          disabled
          className="px-6 py-3 rounded-md bg-gray-400 text-white font-semibold cursor-not-allowed"
        >
          Already Booked
        </button>
      ) : (
        <Link
          to={`/booking/${_id}`}
          onClick={(e) => !handleNavigateToBookings() && e.preventDefault()}
        >
          <button
            className={`px-6 py-3 rounded-md text-white font-semibold ${
              loadingStatus ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loadingStatus}
          >
            {loadingStatus ? 'Checking...' : 'Book Now'}
          </button>
        </Link>
      )}
    </section>
  );
};

export default HubDetails;
