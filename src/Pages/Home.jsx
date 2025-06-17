import { useEffect } from "react";
import Hubs from "../components/Hubs";
import Banner from "../components/Banner";
import { motion } from "framer-motion";


const popularSports = [
  {
    id: 1,
    name: "Swimming",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635",
    description: "Competitive swimming events for all age groups",
    eventsCount: 15,
    tags: ["Freestyle", "Backstroke", "Butterfly"]
  },
  {
    id: 2,
    name: "Sprinting",
    image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0",
    description: "Track and field sprint competitions",
    eventsCount: 22,
    tags: ["100m", "200m", "400m"]
  },
  {
    id: 3,
    name: "High Jump",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    description: "Athletic jumping events testing vertical leap",
    eventsCount: 8,
    tags: ["Fosbury Flop", "Scissors Jump"]
  },
  {
    id: 4,
    name: "Long Jump",
    image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781",
    description: "Track and field horizontal jumping events",
    eventsCount: 12,
    tags: ["Approach", "Takeoff", "Flight"]
  },
  {
    id: 5,
    name: "Hurdle Race",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    description: "Sprint races with obstacles to jump over",
    eventsCount: 10,
    tags: ["110m", "400m", "Steeplechase"]
  }
];

// Animation 
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Home = () => {
  useEffect(() => {
    document.title = "Home | AthleticHub";
  }, []);

  return (
    <div className="space-y-12">
      <Banner />

      <Hubs />

      <div className="text-center mt-8">
        <a
          href="/hubs"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          See All Events
        </a>
      </div>

      <section className="bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-6">What Athletes Say</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <blockquote className="bg-white p-6 rounded shadow">
              "AthleticHub helped me discover local events and push my limits!
              Highly recommended."
              <footer className="mt-4 text-sm font-semibold">— Priya, Sprinter</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded shadow">
              "I found my first professional swimming competition through this
              platform. Amazing experience!"
              <footer className="mt-4 text-sm font-semibold">— Arif, Swimmer</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold mb-8 text-center">
          Popular Sports This Month
        </h3>
        
      
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {popularSports.map((sport) => (
            <motion.span
              key={sport.id}
              whileHover={{ scale: 1.05 }}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition"
            >
              {sport.name}
            </motion.span>
          ))}
        </div>

        {/* Sport Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularSports.map((sport) => (
            <motion.div
              key={sport.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={sport.image} 
                  alt={sport.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{sport.name}</h4>
                <p className="text-gray-600 mb-4">{sport.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {sport.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">
                    {sport.eventsCount} upcoming events
                  </span>
                  <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition">
                    View Events
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;