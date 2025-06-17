import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
 console.log(user)
  useEffect(() => {
    if (!user?.email) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = user.accessToken

        const res = await fetch(`https://athletic-hub-server-roan.vercel.app/bookings?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // ✅ Remove duplicates based on eventId
        const uniqueMap = new Map();
        data.forEach((booking) => {
          if (!uniqueMap.has(booking.eventId)) {
            uniqueMap.set(booking.eventId, booking);
          }
        });

        setBookings(Array.from(uniqueMap.values()));
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to fetch bookings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const token = localStorage.getItem("athletichub-token");

        const res = await fetch(`https://athletic-hub-server-roan.vercel.app/bookings/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to cancel");

        setBookings((prev) => prev.filter((booking) => booking._id !== id));
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to cancel booking", "error");
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">My Bookings</h2>
        <button
          onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Switch to {viewMode === "table" ? "Card" : "Table"} View
        </button>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Event Name</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Date</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Location</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-300">{booking.eventName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{new Date(booking.eventDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{booking.location}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-bold mb-1">{booking.eventName}</h3>
              <p className="text-gray-600">
                <strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Location:</strong> {booking.location}
              </p>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;