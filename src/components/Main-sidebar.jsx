import React from "react";
import "../styles/main-sidebar.css";

const MainSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay (click to close) */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <div className={`main-sidebar ${isOpen ? "open" : ""}`}>
        
        {/* Header */}
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={toggleSidebar}>✖</button>
        </div>

        {/* Menu Items */}
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li>Obligations</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>

      </div>
    </>
  );
};

export default MainSidebar;