import React from 'react';
import { useAppContext } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useAppContext();

  return (
    <div className={`toast ${toast.visible ? 'show' : ''} ${toast.isError ? 'error' : ''}`}>
      {toast.message}
    </div>
  );
};
