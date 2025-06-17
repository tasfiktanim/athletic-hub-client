import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    description: '',
    pictureUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const eventTypes = [
    'Swimming',
    'Sprinting',
    'Long Jump',
    'High Jump',
    'Hurdle Race',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['eventName', 'eventType', 'eventDate', 'description', 'pictureUrl'];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate URL
    try {
      new URL(formData.pictureUrl);
    } catch (e) {
      newErrors.pictureUrl = 'Please enter a valid URL';
    }

    // Validate date is in the future
    if (formData.eventDate) {
      const today = new Date();
      const eventDate = new Date(formData.eventDate);
      if (eventDate <= today) {
        newErrors.eventDate = 'Event date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newEvent = {
      ...formData,
      creatorEmail: user?.email,
      creatorName: user?.displayName || 'Anonymous',
      createdAt: new Date(),
      status: 'upcoming' // Add default status
    };

    try {
      setLoading(true);
      const response = await axios.post('https://athletic-hub-server-roan.vercel.app/events', newEvent);
      
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Event created successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/manageEvents');
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create event',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name */}
        <div>
          <label className="block mb-1 font-medium">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className={`w-full border ${errors.eventName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter event name"
          />
          {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
        </div>

        {/* Event Type */}
        <div>
          <label className="block mb-1 font-medium">Event Type</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className={`w-full border ${errors.eventType ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select event type</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
        </div>

        {/* Event Date */}
        <div>
          <label className="block mb-1 font-medium">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className={`w-full border ${errors.eventDate ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Write about the event"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Picture URL */}
        <div>
          <label className="block mb-1 font-medium">Picture URL</label>
          <input
            type="url"
            name="pictureUrl"
            value={formData.pictureUrl}
            onChange={handleChange}
            className={`w-full border ${errors.pictureUrl ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter image URL"
          />
          {errors.pictureUrl && <p className="text-red-500 text-sm mt-1">{errors.pictureUrl}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;