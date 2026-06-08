import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { OrderCard } from './OrderCard';

export const AdminPanel = ({ onLogout }) => {
  const { orders, loadOrders, saveOrders, updateStatusInSheet, formatNaira, showToast } = useAppContext();
  const [currentFilter, setCurrentFilter] = useState('all');
  const [expandedRef, setExpandedRef] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders =
    currentFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === currentFilter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    revenue: orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0),
  };

  const advanceStatus = (ref) => {
    const nextMap = {
      pending: 'confirmed',
      confirmed: 'ready',
      ready: 'completed',
    };

    const order = orders.find((o) => o.ref === ref);
    if (!order || !nextMap[order.status]) return;

    const updatedOrders = orders.map((o) =>
      o.ref === ref ? { ...o, status: nextMap[order.status] } : o
    );

    saveOrders(updatedOrders);
    updateStatusInSheet(ref, nextMap[order.status]);
    showToast(`${ref} → ${nextMap[order.status]} ✅`);
  };

  const notifyCustomer = (ref) => {
    const order = orders.find((o) => o.ref === ref);
    if (!order) return;

    const isGift = order.orderType === 'gift';
    const senderNum = order.phone;

    const senderMsgs = {
      pending: `Hi! Your order *${ref}* has been confirmed ✅ We're preparing it now 🍩`,
      confirmed: `Hi! Your order *${ref}* is being prepared 🍩`,
      ready: `Hi! Your order *${ref}* is ready 🎉 Come pick it up at ${order.location}!`,
      completed: `Thank you! Your order *${ref}* is complete. Enjoy! 🧡`,
    };

    const msg = encodeURIComponent(senderMsgs[order.status] || `Update on order *${ref}*.`);
    window.open(`https://wa.me/${senderNum.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  const callCustomer = (ref) => {
    const order = orders.find((o) => o.ref === ref);
    if (!order) return;
    window.open(`tel:${order.phone.replace(/\D/g, '')}`);
  };

  return (
    <div className="admin-panel" style={{ display: 'block' }}>
      <div className="admin-header">
        <div className="admin-brand">
          Splendid Puff 🧡
          <span>Admin Panel</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Lock 🔒
        </button>
      </div>

      <div className="panel-body">
        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-val">{stats.total}</div>
            <div className="stat-lbl">Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{stats.pending}</div>
            <div className="stat-lbl">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{formatNaira(stats.revenue)}</div>
            <div className="stat-lbl">Revenue</div>
          </div>
        </div>

        {/* Filter + Refresh */}
        <div className="row-between">
          <div className="filter-row" style={{ margin: 0, flex: 1 }}>
            {['all', 'pending', 'confirmed', 'ready', 'completed'].map((status) => (
              <div
                key={status}
                className={`filter-chip ${currentFilter === status ? 'active' : ''}`}
                onClick={() => setCurrentFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            ))}
          </div>
          <button
            className="refresh-btn"
            onClick={loadOrders}
            style={{ marginLeft: '10px', flexShrink: 0 }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Orders List */}
        <div id="orders-list" style={{ marginTop: '1rem' }}>
          {filteredOrders.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <div>No orders here yet</div>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.ref}
                order={order}
                isExpanded={expandedRef === order.ref}
                onToggleExpand={() =>
                  setExpandedRef(expandedRef === order.ref ? null : order.ref)
                }
                onAdvanceStatus={() => advanceStatus(order.ref)}
                onNotify={() => notifyCustomer(order.ref)}
                onCall={() => callCustomer(order.ref)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
