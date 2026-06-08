import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const TrackOrder = () => {
  const { showToast, formatNaira } = useAppContext();
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  const trackOrder = () => {
    const ref = trackInput.trim().toUpperCase();
    if (!ref) {
      showToast('Please enter order reference', true);
      return;
    }

    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('sp_orders_v2') || '[]');
    const order = orders.find((o) => o.ref === ref);

    if (!order) {
      setTrackResult({ found: false, message: 'Order not found' });
      showToast('Order not found', true);
      return;
    }

    setTrackResult({
      found: true,
      order,
    });
  };

  return (
    <div className="screen active">
      <div className="section-label" style={{ marginTop: 0 }}>
        Track your order
      </div>
      <div className="form-group">
        <label>Order reference</label>
        <input
          type="text"
          value={trackInput}
          onChange={(e) => setTrackInput(e.target.value.toUpperCase())}
          placeholder="SP-0001"
          style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') trackOrder();
          }}
        />
      </div>
      <button className="btn-primary" onClick={trackOrder}>
        Look up order
      </button>

      {trackResult && (
        <div className={`track-result ${trackResult.found ? 'found' : 'not-found'}`}>
          {trackResult.found ? (
            <>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  {trackResult.order.orderType === 'gift'
                    ? `🎁 Gift for: ${trackResult.order.gift?.recipient || 'Unknown'}`
                    : trackResult.order.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                  {trackResult.order.date} {trackResult.order.time}
                </div>
              </div>

              <div style={{ fontSize: '13px', marginBottom: '12px', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Items:</span>
                  <strong>
                    {trackResult.order.items}
                    {trackResult.order.flavour && ` · ${trackResult.order.flavour}`}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Campus:</span>
                  <strong>{trackResult.order.campus}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total:</span>
                  <strong>{formatNaira(trackResult.order.total)}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  className={`order-status-badge status-${trackResult.order.status}`}
                  style={{
                    display: 'inline-block',
                    textTransform: 'capitalize',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                >
                  {trackResult.order.status === 'pending' && '⏳ Pending Confirmation'}
                  {trackResult.order.status === 'confirmed' && '✅ Confirmed'}
                  {trackResult.order.status === 'ready' && '🍩 Ready for Pickup'}
                  {trackResult.order.status === 'completed' && '🎉 Completed'}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                {trackResult.message}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '12px' }}>
                Check your order reference and try again, or message us on WhatsApp.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
