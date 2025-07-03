// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import CreateDoubt from "./pages/CreateDoubt";
import EditDoubt from "./pages/EditDoubts";
import DoubtDetail from "./pages/DoubtDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student-only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["student"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-doubt"
            element={
              <ProtectedRoute roles={["student"]}>
                <CreateDoubt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-doubt/:id"
            element={
              <ProtectedRoute roles={["student"]}>
                <EditDoubt />
              </ProtectedRoute>
            }
          />

          {/* Mentor-only */}
          <Route
            path="/mentor-dashboard"
            element={
              <ProtectedRoute roles={["mentor"]}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
     path="/doubt/:id"
   element={
     <ProtectedRoute roles={["mentor", "student"]}>
       <DoubtDetail />
     </ProtectedRoute>
  }
 />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
