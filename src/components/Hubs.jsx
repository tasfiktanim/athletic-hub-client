import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import Spinner from './Spinner';

const Hubs = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await axios.get('https://athletic-hub-server-roan.vercel.app/hubs');
        setHubs(response.data);
      } catch (err) {
        console.error("Failed to fetch hubs:", err);
        setError('Failed to load hubs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHubs();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">    
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Featured Hubs
      </h2>

      {/* Uniform card size grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hubs.map(hub => (
          <EventCard key={hub._id} event={hub} />
        ))}
      </div>
    </div>
  );
};

export default Hubs;
