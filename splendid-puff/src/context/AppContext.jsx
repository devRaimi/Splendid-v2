import React, { createContext, useState, useCallback, useEffect } from 'react';
import { CONFIG } from '../config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── Toast state ────────────────────────────────────────────────
  const [toast, setToast] = useState({ message: '', isError: false, visible: false });

  const showToast = useCallback((message, isError = false) => {
    setToast({ message, isError, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  // ── Orders state ───────────────────────────────────────────────
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(CONFIG.SHEET_WEBHOOK_URL)
        .then((res) => res.json())
        .then((ans) => ans.obj || []);
      setOrders(res);
    } catch (e) {
      setOrders([]);
    }
  }, []);

  const saveOrders = useCallback((updatedOrders) => {
    try {
      localStorage.setItem('sp_orders_v2', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, []);

  const updateStatusInSheet = useCallback(async (ref, status) => {
    if (!CONFIG.SHEET_WEBHOOK_URL) return;
    try {
      await fetch(CONFIG.SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', ref, status }),
      });
    } catch (e) {
      console.error('Failed to update sheet', e);
    }
  }, []);

  // ── Helper functions ───────────────────────────────────────────
  const formatNaira = useCallback((n) => {
    return '₦' + Math.round(n).toLocaleString('en-NG');
  }, []);

  const getProductName = useCallback((id) => {
    return CONFIG.PRODUCTS.find((p) => p.id === id)?.name || id;
  }, []);

  const getProductEmoji = useCallback((id) => {
    return CONFIG.PRODUCTS.find((p) => p.id === id)?.emoji || '';
  }, []);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const value = {
    toast,
    showToast,
    orders,
    setOrders,
    loadOrders,
    saveOrders,
    updateStatusInSheet,
    formatNaira,
    getProductName,
    getProductEmoji,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
