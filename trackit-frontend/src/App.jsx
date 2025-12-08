import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ViewReports from './pages/ViewReports';
import AddEntry from './pages/AddEntry';
import EditShift from './pages/EditEntry';
import Analytics from "./pages/Analytics";
import './App.css';

function App() {
  // Check if user is loggin in
  const isAuthenticated = () => {
    return localStorage.getItem('token') != null;
  };

  const RouteTo = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <RouteTo>
              <Dashboard />
            </RouteTo>
          }
        />

        <Route 
            path="/add-entry" 
            element={
              <RouteTo>
                <AddEntry />
              </RouteTo>
            } 
        />

        <Route 
          path="/edit-shift/:id" 
          element={
            <RouteTo>
              <EditShift />
            </RouteTo>
          } 
        />

        <Route
          path="/view-reports"
          element={
            <RouteTo>
              <ViewReports />
            </RouteTo>
          }
        />

        <Route
          path="/analytics"
          element={
            <RouteTo>
              <Analytics />
            </RouteTo>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;