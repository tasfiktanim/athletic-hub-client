import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";

const ManageEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const getAuthHeader = async () => {
    if (!user) return {};
    const token = user.accessToken;
    return { authorization: `Bearer ${token}` };
  };


  useEffect(() => {
    if (!user?.email) return; 

    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        const headers = await getAuthHeader();
        const { data } = await axios.get(
          `https://athletic-hub-server-roan.vercel.app/events/user/${user.email}`,
          { headers }
        );
        setEvents(data.data);
      } catch (error) {
        console.error("Fetch events error:", error);
        Swal.fire("Error", "Failed to fetch your events", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

 
  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const headers = await getAuthHeader();
        await axios.delete(`https://athletic-hub-server-roan.vercel.app/events/${id}`, { headers });
        setEvents((prev) => prev.filter((event) => event._id !== id));
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete the event", "error");
      }
    }
  };

  const handleUpdate = (id) => navigate(`/updateEvent/${id}`);

 
  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Manage Your Events</h2>

      <button
        onClick={() => navigate("/create-event")}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create New Event
      </button>

      {events.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600 mb-4">You have not created any events yet.</p>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Event Name</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Type</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Date</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-300">{event.eventName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{event.eventType}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 space-x-2">
                    <button
                      onClick={() => handleUpdate(event._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
