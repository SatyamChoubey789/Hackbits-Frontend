import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeamRegister from "./pages/TeamRegister";
import TeamDetails from "./pages/TeamDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import Profile from "./pages/Profile";
import About from "./pages/About";
import ProblemStatements from "./pages/ProblemStatements";
import Sponsors from "./pages/Sponsors";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "0.95rem",
          },
          success: {
            iconTheme: {
              primary: "#16a34a", // Tailwind green-600
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626", // Tailwind red-600
              secondary: "#fff",
            },
          },
        }}
      />
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/problems" element={<ProblemStatements />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin Routes - Not public, only accessible via direct link */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/home" element={<AdminHome />} />

              {/* Protected Routes */}
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <TeamRegister />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team-register"
                element={
                  <ProtectedRoute>
                    <TeamRegister />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team-details"
                element={
                  <ProtectedRoute>
                    <TeamDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
