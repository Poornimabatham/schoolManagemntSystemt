// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import StudentLayout from "./components/StudentLayout";
import ClassLayout from "./components/ClassLayout"; // Example page
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes sharing Sidebar and Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentLayout />} />
            <Route path="/classes" element={<ClassLayout />} />
            {/* Add more module routes here */}
            {/* <Route path="/teachers" element={<TeacherLayout />} /> */}
            {/* <Route path="/attendance" element={<AttendanceLayout />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;