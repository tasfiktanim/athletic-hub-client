import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
import CreateEvent from '../pages/CreateEvent';
import UpdateEvent from '../pages/UpdateEvent';
import MyBookings from '../pages/MyBookings';
import ManageEvents from '../pages/ManageEvents';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import Hub from '../Pages/Hub';
import HubDetails from '../Pages/HubDetails';
import Booking from '../Pages/Booking';
import EventDetails from '../Pages/EventDetails';
import MainLayout from '../Layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/hubs', element: <Hub /> },
      {
        path: '/hubs/:id', element: <HubDetails />,
        loader: ({ params }) => fetch(`https://athletic-hub-server-roan.vercel.app/hubs/${params.id}`)
      },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        path: '/create-event',
        element: (
          <PrivateRoute>
            <CreateEvent />
          </PrivateRoute>
        ),
      },
      {
        path: '/create-event',
        element: (
          <PrivateRoute>
            <CreateEvent />
          </PrivateRoute>
        ),
      },
      {
        path: '/updateEvent/:id',
        element: (
          <PrivateRoute>
            <UpdateEvent />
          </PrivateRoute>
        ),
      },
      {
        path: '/myBookings',
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      {
        path: '/booking/:id',
        element: (
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        ),
      },
      {
        path: '/events/:id',
        element: <EventDetails />,
        loader: async ({ params }) => {
          const res = await fetch(`https://athletic-hub-server-roan.vercel.app/events/${params.id}`);
          const data = await res.json();

          if (!data.success) {
            throw new Response("Not Found", { status: 404 });
          }

          return data.data;
        }
      },
      {
        path: '/manageEvents',
        element: (
          <PrivateRoute>
            <ManageEvents />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
