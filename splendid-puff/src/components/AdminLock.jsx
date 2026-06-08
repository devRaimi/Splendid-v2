import React, { useState, useRef } from 'react';
import { CONFIG } from '../config';

export const AdminLock = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const handleCheckPin = () => {
    if (pin === CONFIG.ADMIN_PIN) {
      onUnlock();
    } else {
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="lock-screen">
      <div className="lock-logo">Splendid Puff 🧡</div>
      <div className="lock-sub">Staff portal</div>
      <div className="lock-icon">🔐</div>
      <div className="lock-card">
        <div className="lock-title">Admin access</div>
        <div className="lock-hint">Enter your staff PIN to continue</div>
        <input
          ref={inputRef}
          type="password"
          className={`pin-input ${shake ? 'shake' : ''}`}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCheckPin();
          }}
          placeholder="••••"
          maxLength="6"
          autoFocus
        />
        <button className="btn-unlock" onClick={handleCheckPin}>
          Unlock
        </button>
      </div>
    </div>
  );
};
