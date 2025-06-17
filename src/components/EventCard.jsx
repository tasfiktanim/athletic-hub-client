import { Link } from 'react-router';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    eventName,
    date,
    eventDate,
    location,
    image,
    pictureUrl,
    category,
    description
  } = event;

  const unsplashUrl = image || pictureUrl;

  const optimizedImageUrl = unsplashUrl
    ? `${unsplashUrl.split('?')[0]}?w=400&h=225&fit=crop&auto=format&q=80`
    : `https://source.unsplash.com/random/400x225/?${encodeURIComponent(category || 'sports')}`;

  const displayDate = eventDate || date;

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={optimizedImageUrl}
          alt={title || eventName || 'Event image'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://source.unsplash.com/random/400x225/?${encodeURIComponent(category || 'sports')}`;
          }}
        />
      </div>

      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold text-gray-800">{title || eventName}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {category} {location && `• ${location}`}
        </p>
        {displayDate && (
          <p className="text-sm text-gray-600 mt-2">
            {new Date(displayDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
        {description && (
          <p className="text-gray-600 mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <div className="p-4">
        <Link
          to={event.eventName ? `/events/${_id}` : `/hubs/${_id}`}
          className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          View Details
        </Link>

      </div>
    </div>
  );
};

export default EventCard;