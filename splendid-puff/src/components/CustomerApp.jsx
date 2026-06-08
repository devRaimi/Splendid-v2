import React, { useState } from 'react';
import { OrderForm } from './OrderForm';
import { TrackOrder } from './TrackOrder';

export const CustomerApp = () => {
  const [activeTab, setActiveTab] = useState('order');

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <div className="brand-row">
          <div className="brand-name">Splendid Puff 🧡</div>
          <div className="brand-badge">Campus Orders</div>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
            🛍 Order
          </button>
          <button
            className={`nav-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            📍 Track
          </button>
        </nav>
      </div>

      {/* ORDER TAB */}
      {activeTab === 'order' && (
        <div className="screen active">
          <OrderForm />
        </div>
      )}

      {/* TRACK TAB */}
      {activeTab === 'track' && <TrackOrder />}
    </div>
  );
};
