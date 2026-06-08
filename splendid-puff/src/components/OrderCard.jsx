import React from 'react';
import { useAppContext } from '../context/AppContext';

export const OrderCard = ({
  order,
  isExpanded,
  onToggleExpand,
  onAdvanceStatus,
  onNotify,
  onCall,
}) => {
  const { formatNaira } = useAppContext();

  const pillMap = {
    pending: 'pill-pending',
    confirmed: 'pill-confirmed',
    ready: 'pill-ready',
    completed: 'pill-completed',
  };

  const nextMap = {
    pending: 'confirmed',
    confirmed: 'ready',
    ready: 'completed',
  };

  const nextLbl = {
    pending: '✅ Confirm',
    confirmed: '🍩 Mark ready',
    ready: '🎉 Complete',
  };

  const isGift = order.orderType === 'gift';
  const itemStr = `${order.items}${order.flavour ? ' · ' + order.flavour : ''}`;

  let details = '';
  if (isGift) {
    details = `
      <div class="detail-key">Sender</div><div class="detail-val">Anonymous (${order.phone})</div>
      <div class="detail-key">Recipient</div><div class="detail-val">${order.gift?.recipient || '—'}${
      order.gift?.recipientPhone ? ' · ' + order.gift.recipientPhone : ''
    }</div>
      <div class="detail-key">Gift note</div><div class="detail-val">${order.gift?.note || '(none)'}</div>
    `;
  } else {
    details = `
      <div class="detail-key">Customer</div><div class="detail-val">${order.name}</div>
      <div class="detail-key">WhatsApp</div><div class="detail-val">${order.phone}</div>
    `;
  }

  return (
    <div
      className={`order-card ${order.status} ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggleExpand}
    >
      <div className="order-top">
        <div>
          {isGift && <div className="anon-badge">🕵️ Anonymous gift</div>}
          <div className="order-name">
            {isGift ? `🎁 For: ${order.gift?.recipient || '?'}` : order.name}
          </div>
          <div className="order-meta-sm">
            {order.ref} · {order.campus} · {order.time}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`status-pill ${pillMap[order.status]}`}>{order.status}</span>
          <span className="expand-icon">▼</span>
        </div>
      </div>

      <div className="order-items">
        {itemStr} · {formatNaira(order.total)}
      </div>

      {/* Expandable detail */}
      <div className={`order-detail-row ${isExpanded ? 'open' : ''}`}>
        <div className="detail-grid" dangerouslySetInnerHTML={{ __html: details }} />
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '6px 12px' }}>
            <div className="detail-key">Pickup</div>
            <div className="detail-val">{order.location}</div>
            <div className="detail-key">Campus</div>
            <div className="detail-val">{order.campus}</div>
            <div className="detail-key">Items</div>
            <div className="detail-val">{itemStr}</div>
            <div className="detail-key">Total</div>
            <div className="detail-val">{formatNaira(order.total)}</div>
            {order.notes && (
              <>
                <div className="detail-key">Notes</div>
                <div className="detail-val">{order.notes}</div>
              </>
            )}
            <div className="detail-key">Time</div>
            <div className="detail-val">
              {order.date} {order.time}
            </div>
          </div>
        </div>
      </div>

      <div className="order-actions" onClick={(e) => e.stopPropagation()}>
        {nextMap[order.status] && (
          <div className="action-chip primary" onClick={onAdvanceStatus}>
            {nextLbl[order.status]}
          </div>
        )}
        <div className="action-chip" onClick={onNotify}>
          💬 Notify
        </div>
        <div className="action-chip" onClick={onCall}>
          📞 Call
        </div>
      </div>
    </div>
  );
};
