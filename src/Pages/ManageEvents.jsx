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
        Swal.fire({
          title: "Error",
          text: "Failed to fetch your events",
          icon: "error",
          background:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "#374151"
              : "#FFFFFF",
          color:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "#F3F4F6"
              : "#1F2937",
          confirmButtonColor: "#2563EB",
        });
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
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, delete it!",
      background:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#374151"
          : "#FFFFFF",
      color:
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "#F3F4F6"
          : "#1F2937",
    });

    if (confirmResult.isConfirmed) {
      try {
        const headers = await getAuthHeader();
        await axios.delete(
          `https://athletic-hub-server-roan.vercel.app/events/${id}`,
          { headers }
        );
        setEvents((prev) => prev.filter((event) => event._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Your event has been deleted.",
          icon: "success",
          background:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "#374151"
              : "#FFFFFF",
          color:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "#F3F4F6"
              : "#1F2937",
          confirmButtonColor: "#16A34A",
        });
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete the event",
          icon: "error",
          background:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "#374151"
              : "#FFFFFF",
          color:
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "#F3F4F6"
              : "#1F2937",
          confirmButtonColor: "#2563EB",
        });
      }
    }
  };

  const handleUpdate = (id) => navigate(`/updateEvent/${id}`);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[var(--dropdown-bg)] text-[var(--text-primary)]">
      <h2 className="text-3xl font-semibold mb-6">Manage Your Events</h2>

      <button
        onClick={() => navigate("/create-event")}
        className="mb-4 bg-[var(--btn-create)] text-[var(--text-primary)] px-4 py-2 rounded hover:bg-[var(--btn-create-hover)]"
      >
        Create New Event
      </button>

      {events.length === 0 ? (
        <div className="text-center p-8 bg-[var(--table-bg)] rounded-lg">
          <p className="mb-4 text-[var(--text-tertiary)]">
            You have not created any events yet.
          </p>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-[var(--btn-primary)] text-[var(--text-primary)] px-4 py-2 rounded hover:bg-[var(--btn-primary-hover)]"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[var(--table-border)] rounded">
            <thead className="bg-[var(--table-bg)]">
              <tr>
                <th className="py-2 px-4 border-b border-[var(--table-border)] text-left text-[var(--text-primary)]">
                  Event Name
                </th>
                <th className="py-2 px-4 border-b border-[var(--table-border)] text-left text-[var(--text-primary)]">
                  Type
                </th>
                <th className="py-2 px-4 border-b border-[var(--table-border)] text-left text-[var(--text-primary)]">
                  Date
                </th>
                <th className="py-2 px-4 border-b border-[var(--table-border)] text-left text-[var(--text-primary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-[var(--table-hover)]">
                  <td className="py-2 px-4 border-b border-[var(--table-border)] text-[var(--text-primary)]">
                    {event.eventName}
                  </td>
                  <td className="py-2 px-4 border-b border-[var(--table-border)] text-[var(--text-primary)]">
                    {event.eventType}
                  </td>
                  <td className="py-2 px-4 border-b border-[var(--table-border)] text-[var(--text-primary)]">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-[var(--table-border)] space-x-2">
                    <button
                      onClick={() => handleUpdate(event._id)}
                      className="bg-[var(--btn-primary)] text-[var(--text-primary)] px-3 py-1 rounded hover:bg-[var(--btn-primary-hover)]"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-[var(--btn-danger)] text-[var(--text-primary)] px-3 py-1 rounded hover:bg-[var(--btn-danger-hover)]"
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
