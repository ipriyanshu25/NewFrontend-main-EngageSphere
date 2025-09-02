// App.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './admin/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// User Protected Pages
import Profile from './pages/Profile';
import ServiceDetail from './pages/ServiceDetail';
import ServiceList from './pages/services';
import ActiveServices from './pages/ActiveServices';
import CompletedServices from './pages/CompletedService';

// Admin Pages
import AdminAuthPage from './admin/login';
import AdminServicesPage from './admin/dashboard';
import AddEditServicePage from './admin/add-editService';
import ClientPage from './admin/client';
import Settings from './admin/settings';
import Plan from './admin/plan';
import EditPlanPage from './admin/edit-plan';
import Tasks from './admin/tasks';

// ⤵️ New Admin Page
import UserSerivesPage from './admin/userSerives';

function App() {
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Auth />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="refund" element={<Refund />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="services" element={<ServiceList />} />

          {/* Authenticated User Routes */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile onViewServices={() => navigate('/services/active')} />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/:platform"
            element={
              <ProtectedRoute>
                <ServiceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/active"
            element={
              <ProtectedRoute>
                <ActiveServices
                  onBack={() => navigate('/profile')}
                  onViewCompleted={() => navigate('/services/completed')}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/completed"
            element={
              <ProtectedRoute>
                <CompletedServices onBack={() => navigate('/services/active')} />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="admin">
            <Route path="login" element={<AdminAuthPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<AdminServicesPage />} />
              <Route path="add-editService" element={<AddEditServicePage />} />
              <Route path="client" element={<ClientPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="plan" element={<Plan />} />
              <Route path="edit-plan/:planId" element={<EditPlanPage />} />
              <Route path="user-services/:userId" element={<UserSerivesPage />} />
              <Route path="tasks" element={<Tasks />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
