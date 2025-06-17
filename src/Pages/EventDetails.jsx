import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLoaderData, Link } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import Swal from 'sweetalert2';
import Spinner from '../components/Spinner';
import useTitle from '../utils/titleSetter';
import axios from 'axios';

const EventDetails = () => {
  const event = useLoaderData();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useTitle(event?.eventName || 'Event Details');

  const {
    _id,
    eventName,
    eventType,
    eventDate,
    description,
    pictureUrl,
    creatorName,
    creatorEmail,
    status,
  } = event || {};

  const isPastEvent = new Date(eventDate) < new Date();

  // 🔍 Check if the user already booked this event
  useEffect(() => {
    if (user?.email && _id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/bookings?userEmail=${user.email}&eventId=${_id}`
          );
          if (res.data.success && res.data.data.length > 0) {
            setBooking(res.data.data[0]);
          }
        } catch (err) {
          console.error('Error fetching booking:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [user, _id]);

  const handleBook = async () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to proceed with booking.',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((res) => {
        if (res.isConfirmed) {
          navigate('/login', { state: { from: `/events/${_id}` } });
        }
      });
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
        userEmail: user.email,
        eventId: _id,
        bookedAt: new Date(),
      });

      if (res.data.success) {
        Swal.fire('Success', 'Event booked successfully!', 'success');
        setBooking(res.data.data);
      }
    } catch (err) {
      console.error('Booking error:', err);
      Swal.fire('Error', 'Failed to book the event', 'error');
    }
  };

  const handleCancel = async () => {
    if (!booking?._id) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/bookings/${booking._id}`
      );
      if (res.data.success) {
        Swal.fire('Cancelled', 'Your booking has been cancelled.', 'success');
        setBooking(null);
      }
    } catch (err) {
      console.error('Cancel error:', err);
      Swal.fire('Error', 'Failed to cancel booking', 'error');
    }
  };

  if (!event || loading) return <Spinner />;

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="relative">
        <img
          src={pictureUrl || '/default-event.jpg'}
          alt={eventName}
          className="w-full h-80 object-cover rounded-md mb-6"
          onError={(e) => {
            e.target.src = '/default-event.jpg';
          }}
        />
        {status && (
          <span
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
              status === 'upcoming'
                ? 'bg-green-100 text-green-800'
                : status === 'ongoing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{eventName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600 mb-1">
            <strong>Event Type:</strong> {eventType}
          </p>
          <p className="text-gray-600 mb-1">
            <strong>Date:</strong>{' '}
            {new Date(eventDate).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {creatorName && (
            <p className="text-gray-600 mb-1">
              <strong>Organizer:</strong> {creatorName}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">About this event</h3>
          {description ? (
            <p className="text-gray-700">{description}</p>
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        {!isPastEvent ? (
          booking ? (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
              <button
                disabled
                className="px-6 py-3 rounded-md text-white font-semibold bg-green-600 cursor-not-allowed"
              >
                Already Booked
              </button>
            </>
          ) : (
            <button
              onClick={handleBook}
              className="px-6 py-3 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          )
        ) : (
          <button
            disabled
            className="px-6 py-3 rounded-md text-white font-semibold bg-gray-400 cursor-not-allowed"
          >
            Event Ended
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-md font-semibold bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Events
        </button>
      </div>

      {user?.email === creatorEmail && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            to={`/updateEvent/${_id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Manage this event →
          </Link>
        </div>
      )}
    </section>
  );
};

export default EventDetails;
