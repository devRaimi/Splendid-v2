import React, { useState } from 'react';
import { AdminLock } from './AdminLock';
import { AdminPanel } from './AdminPanel';

export const AdminApp = () => {
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const handleLogout = () => {
    setAdminUnlocked(false);
  };

  if (!adminUnlocked) {
    return <AdminLock onUnlock={() => setAdminUnlocked(true)} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
};
