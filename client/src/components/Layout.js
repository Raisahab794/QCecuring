import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Set header title based on current route
  const headerTitle = path === '/logs' ? 'Audit Logs' : 'Tasks';

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="15" y2="17"></line>
          </svg>
          <span>Task Manager</span>
        </div>
        <div className="sidebar-section">
          <h3>Main</h3>
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to="/logs" className={({ isActive }) => isActive ? 'active' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Audit Logs
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="main-content">
        <div className="header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {path === '/logs' ? (
              <React.Fragment>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </React.Fragment>
            )}
          </svg>
          <h1>{headerTitle}</h1>
          <div className="version">v1.0</div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
