import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';
import Spinner from '../components/Spinner';
import axios from 'axios';

const Booking = () => {
  const { id: hubId } = useParams();
  const { user } = useContext(AuthContext);

  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`https://athletic-hub-server-roan.vercel.app/hubs/${hubId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHub(res.data);
      } catch {
        Swal.fire('Error', 'Failed to load event details', 'error');
      }
    };

    const checkBookingStatus = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`https://athletic-hub-server-roan.vercel.app/bookings`, {
          params: {
            email: user.email,
            eventId: hubId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.exists) {
          setAlreadyBooked(true);
        }
      } catch (err) {
        console.error('Check booking failed', err);
      }
    };

    const init = async () => {
      await Promise.all([fetchHub(), checkBookingStatus()]);
      setFetching(false);
    };

    if (user?.email) {
      init();
    }
  }, [hubId, user]);

  if (fetching || !hub) return <Spinner />;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingInfo = {
      userEmail: user.email,
      eventId: hub._id,
      eventName: hub.title,
      eventDate: hub.date,
      location: hub.location,
    };

    try {
      const token = await user.getIdToken();
      const res = await axios.post(`https://athletic-hub-server-roan.vercel.app/booking`, bookingInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.insertedId || res.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Booking confirmed!',
          showConfirmButton: false,
          timer: 2000,
        });

        setAlreadyBooked(true);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      Swal.fire('Error', 'Booking failed. Please try again.', 'error');
      console.error('Booking Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Book: {hub.title}</h2>

      {alreadyBooked ? (
        <div className="text-center text-green-600 font-medium">
          ✅ You have already booked this event.
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Your Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Event Name</label>
            <input
              type="text"
              value={hub.title}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Event Date</label>
            <input
              type="text"
              value={new Date(hub.date).toLocaleDateString()}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              value={hub.location}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading || alreadyBooked}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Booking;
