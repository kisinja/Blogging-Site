import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import PostListPage from './pages/PostListPage.jsx';
import SinglePost from './pages/SinglePost.jsx';
import Write from './pages/Write.jsx';
import Login from './pages/Login.jsx';
import MainLayout from './layout/MainLayout.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from './context/AppContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import { Provider } from 'react-redux';
import { store } from './store.js';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import ProfilePage from './pages/ProfilePage.jsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Homepage />
      },
      {
        path: '/posts',
        element: <PostListPage />
      },
      {
        path: "/:slug",
        element: (
          <ProtectedRoute>
            <SinglePost />
          </ProtectedRoute>
        )
      },
      {
        path: "/write",
        element: (
          <ProtectedRoute>
            <Write />
          </ProtectedRoute>
        )
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
    ]
  }
]);


// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
};

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" />
        </Provider>
      </AppProvider>
    </QueryClientProvider>
  </ClerkProvider>,
);