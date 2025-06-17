import { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';
import SearchBar from '../components/SearchBar';
import useTitle from '../utils/titleSetter';

const Hub = () => {
  useTitle('All Events Hub');

  const [events, setEvents] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredHubs, setFilteredHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, hubsRes] = await Promise.all([
          axios.get('https://athletic-hub-server-roan.vercel.app/events'),
          axios.get('https://athletic-hub-server-roan.vercel.app/hubs'),
        ]);

        const eventsData = eventsRes.data.data || eventsRes.data;
        const hubsData = hubsRes.data.data || hubsRes.data;

        setEvents(eventsData);
        setHubs(hubsData);
        setFilteredEvents(eventsData);
        setFilteredHubs(hubsData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredEvents(events);
      setFilteredHubs(hubs);
      return;
    }

    const filterItems = (items, isHub = false) => {
      return items.filter(item => {
        const nameMatch = (isHub ? item.title || item.hubName : item.eventName)?.toLowerCase().includes(term);
        const typeMatch = (isHub ? item.category || item.type : item.eventType)?.toLowerCase().includes(term);
        const descMatch = item.description?.toLowerCase().includes(term);
        const locationMatch = item.location?.toLowerCase().includes(term);
        return nameMatch || typeMatch || descMatch || locationMatch;
      });
    };

    setFilteredEvents(filterItems(events));
    setFilteredHubs(filterItems(hubs, true));
  }, [searchTerm, events, hubs]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const noResults = filteredEvents.length === 0 && filteredHubs.length === 0;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Athletic Events</h1>

      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search events and hubs by name, type, or location..."
        />
      </div>

      {noResults ? (
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg">No matching events or hubs found</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-2 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {filteredHubs.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Featured Hubs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHubs.map(hub => (
                  <EventCard 
                    key={hub._id} 
                    event={hub}
                    isHub={true}
                  />
                ))}
              </div>
            </>
          )}

          {filteredEvents.length > 0 && (
            <div className={`${filteredHubs.length > 0 ? 'mt-12' : ''}`}>
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event._id} 
                    event={event} 
                    showCreator={true}
                    isHub={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Hub;
