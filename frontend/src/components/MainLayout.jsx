// src/components/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <div className="app-content">
          {/* This is where Dashboard, StudentLayout, ClassLayout, etc. will render */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}