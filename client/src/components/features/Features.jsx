import React from 'react';
import './Features.scss';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  return (
    <section className="employee-org-section">
      <div className="heading">
        <h2>Explore the Features</h2>
        <h2>of chartify.</h2>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon search">
            <i className="icon-search"></i>
          </div>
          <div className="feature-content">
            <h3>Employee List & Search</h3>
            <p>Displays a list of employees with search and filter options.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon chart">
            <i className="icon-chart"></i>
          </div>
          <div className="feature-content">
            <h3>Interactive Org Chart</h3>
            <p>Visualizes the employee hierarchy based on manager relationships.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon drag">
            <i className="icon-drag"></i>
          </div>
          <div className="feature-content">
            <h3>Drag & Drop</h3>
            <p>Allows users to change reporting structures by dragging and dropping employees.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon download">
            <i className="icon-download"></i>
          </div>
          <div className="feature-content">
            <h3>Download as PDF</h3>
            <p>Enables exporting the org chart as a PDF file.</p>
          </div>
        </div>
      </div>

      <div className="cta-buttons">
        <Link to='/chart-page'><button className="btn-secondary">View all features</button></Link>
        <Link to='/chart-page'><button className="btn-primary">View Demo</button></Link>
      </div>

      <div className="wave-decoration">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default FeaturesSection;