import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router"; 
import Swal from "sweetalert2";

const Register = () => {
  const { registerUser, updateUserProfile } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, photoURL, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    if (!validatePassword(password)) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 6 characters long and include uppercase and lowercase letters.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password);
      await updateUserProfile(name, photoURL); // ✅ Set display name and photo
      Swal.fire("Success", "Registration successful", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Profile Picture URL</label>
          <input
            type="url"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="At least 6 characters, uppercase & lowercase"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Re-enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
