import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar fixed at top, full width, above other elements */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>

      {/* Add top padding equal to Navbar height so content doesn't hide behind it */}
      <main className="flex-grow container mx-auto px-4 py-6 pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
