import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from '../components/Spinner';

const UpdateEvent = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    description: '',
    pictureUrl: '',
    creatorEmail: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const eventTypes = [
    'Swimming',
    'Sprinting',
    'Long Jump',
    'High Jump',
    'Hurdle Race',
  ];

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.eventName.trim()) {
      return 'Event name is required';
    }
    if (!formData.eventType) {
      return 'Event type is required';
    }
    if (!formData.eventDate) {
      return 'Event date is required';
    }
    if (new Date(formData.eventDate) < new Date()) {
      return 'Event date must be in the future';
    }
    if (formData.pictureUrl && !isValidUrl(formData.pictureUrl)) {
      return 'Please enter a valid image URL';
    }
    return null;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setFetching(true);
        setError(null);
        
        const response = await axios.get(`https://athletic-hub-server-roan.vercel.app/events/${id}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch event');
        }

        const event = response.data.data;
        
        if (event.creatorEmail !== user?.email) {
          throw new Error('You are not authorized to edit this event');
        }
        
        const eventDate = new Date(event.eventDate);
        const formattedDate = eventDate.toISOString().split('T')[0];

        setFormData({
          eventName: event.eventName,
          eventType: event.eventType,
          eventDate: formattedDate,
          description: event.description,
          pictureUrl: event.pictureUrl,
          creatorEmail: event.creatorEmail,
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load event',
        });
        navigate('/manageEvents');
      } finally {
        setFetching(false);
      }
    };

    if (user?.email) {
      fetchEvent();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please login to edit events',
      });
      navigate('/login');
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  const validationError = validateForm();
  if (validationError) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: validationError,
    });
    return;
  }

  try {
    setLoading(true);
    
    // Prepare the update data
    const updateData = {
      eventName: formData.eventName,
      eventType: formData.eventType,
      eventDate: formData.eventDate, // Already in correct format from date input
      description: formData.description,
      pictureUrl: formData.pictureUrl,
    };

    const response = await axios.put(`https://athletic-hub-server-roan.vercel.app/events/${id}`, updateData);

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Event updated successfully',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/manageEvents');
      });
    } else {
      throw new Error(response.data.message || 'Update failed');
    }
  } catch (error) {
    console.error('Update error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update event',
    });
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
        <p className="mb-6">{error}</p>
        <button
          onClick={() => navigate('/manageEvents')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Update Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Event Name*</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Event Type*</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select type</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Event Date*</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="url"
            name="pictureUrl"
            value={formData.pictureUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
          {formData.pictureUrl && !isValidUrl(formData.pictureUrl) && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Creator Email</label>
          <input
            type="email"
            name="creatorEmail"
            value={formData.creatorEmail}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            readOnly
            disabled
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/manageEvents')}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;