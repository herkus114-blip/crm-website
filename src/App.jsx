import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AppProvider } from '@/lib/AppContext';
import Layout from '@/components/Layout';
// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// App pages
import Dashboard from '@/pages/Dashboard';
import DevelopmentsList from '@/pages/DevelopmentsList';
import DevelopmentDetail from '@/pages/DevelopmentDetail';
import HousesList from '@/pages/HousesList';
import HouseDetail from '@/pages/HouseDetail';
import PlotsList from '@/pages/PlotsList';
import LandList from '@/pages/LandList';
import PermitsList from '@/pages/PermitsList';
import TasksList from '@/pages/TasksList';
import ApprovalsList from '@/pages/ApprovalsList';
import MapPage from '@/pages/MapPage';
import Construction from '@/pages/Construction';
import Documents from '@/pages/Documents';
import Contractors from '@/pages/Contractors';
import Finance from '@/pages/Finance';
import Sales from '@/pages/Sales';
import Customers from '@/pages/Customers';
import Warranty from '@/pages/Warranty';
import Reports from '@/pages/Reports';
import Audit from '@/pages/Audit';
import Administration from '@/pages/Administration';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/developments" element={<DevelopmentsList />} />
            <Route path="/developments/:id" element={<DevelopmentDetail />} />
            <Route path="/houses" element={<HousesList />} />
            <Route path="/houses/:id" element={<HouseDetail />} />
            <Route path="/plots" element={<PlotsList />} />
            <Route path="/land" element={<LandList />} />
            <Route path="/permits" element={<PermitsList />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/approvals" element={<ApprovalsList />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/administration" element={<Administration />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppProvider>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App