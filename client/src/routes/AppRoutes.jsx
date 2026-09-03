import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import PublicGallery from '../pages/PublicGallery';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerLayout from '../components/layout/CustomerLayout';
import PhotographerLayout from '../components/layout/PhotographerLayout';
import EditorLayout from '../components/layout/EditorLayout';

// Staff & Admin Views
import DashboardPreview from '../pages/DashboardPreview';
import Calendar from '../pages/Calendar';
import Customers from '../pages/Customers';
import Enquiries from '../pages/Enquiries';
import Services from '../pages/Services';
import Bookings from '../pages/Bookings';
import Shoots from '../pages/Shoots';
import Editing from '../pages/Editing';
import Galleries from '../pages/Galleries';
import Finance from '../pages/Finance';
import Inventory from '../pages/Inventory';
import Reports from '../pages/Reports';
import Administration from '../pages/Administration';

// Customer Portal Views
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import CustomerBookings from '../pages/customer/CustomerBookings';
import CustomerInvoices from '../pages/customer/CustomerInvoices';
import CustomerGalleries from '../pages/customer/CustomerGalleries';
import CustomerNewBooking from '../pages/customer/CustomerNewBooking';

// Staff Portal Views
import PhotographerDashboard from '../pages/photographer/PhotographerDashboard';
import PhotographerGear from '../pages/photographer/PhotographerGear';
import EditorDashboard from '../pages/editor/EditorDashboard';
import EditorGalleries from '../pages/editor/EditorGalleries';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC CINEMATIC LANDING & PORTALS ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gallery/view/:token" element={<PublicGallery />} />

      {/* ================= PHOTOGRAPHER WORKSPACE ================= */}
      <Route
        path="/photographer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Photographer', 'Admin']}>
            <PhotographerLayout>
              <PhotographerDashboard />
            </PhotographerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/photographer/gear"
        element={
          <ProtectedRoute allowedRoles={['Photographer', 'Admin']}>
            <PhotographerLayout>
              <PhotographerGear />
            </PhotographerLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= EDITOR DARKROOM WORKSPACE ================= */}
      <Route
        path="/editor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Editor', 'Admin']}>
            <EditorLayout>
              <EditorDashboard />
            </EditorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/galleries"
        element={
          <ProtectedRoute allowedRoles={['Editor', 'Admin']}>
            <EditorLayout>
              <EditorGalleries />
            </EditorLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= CUSTOMER PORTAL ================= */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
            <CustomerLayout>
              <CustomerDashboard />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/bookings"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
            <CustomerLayout>
              <CustomerBookings />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/finance"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
            <CustomerLayout>
              <CustomerInvoices />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/galleries"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
            <CustomerLayout>
              <CustomerGalleries />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/new-booking"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
            <CustomerLayout>
              <CustomerNewBooking />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= STUDIO STAFF & ADMIN COMMAND CENTER ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <DashboardPreview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Calendar />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Customers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/enquiries"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Enquiries />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Services />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Bookings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shoots"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Photographer']}>
            <DashboardLayout>
              <Shoots />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editing"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Editor']}>
            <DashboardLayout>
              <Editing />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/galleries"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Editor']}>
            <DashboardLayout>
              <Galleries />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Finance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Photographer']}>
            <DashboardLayout>
              <Inventory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout>
              <Administration />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}