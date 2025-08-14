import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Layout components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Retirement } from './pages/Retirement';
import { StudentLoans } from './pages/StudentLoans';

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading WealthWise Pro...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main app layout
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Public pages component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <DataProvider>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/retirement" element={<Retirement />} />
                    <Route path="/loans" element={<StudentLoans />} />
                    <Route path="/emergency" element={
                      <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Emergency Fund Tracker</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    } />
                    <Route path="/benefits" element={
                      <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Benefits Utilization</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    } />
                    <Route path="/budgeting" element={
                      <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Budgeting Tools</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    } />
                    <Route path="/education" element={
                      <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Education</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    } />
                    <Route path="/settings" element={
                      <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    } />
                  </Routes>
                </AppLayout>
              </DataProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;