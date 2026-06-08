import React, { useState, useRef } from 'react';
import { CONFIG } from '../config';
import { useAppContext } from '../context/AppContext';

const generateRef = () => 'SP-' + Math.floor(10000 + Math.random() * 90000);

export const OrderForm = () => {
  const { showToast } = useAppContext();

  // ── Order state ────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [orderType, setOrderType] = useState('normal');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);

  // ── Form fields ────────────────────────────────────────────────
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custLocation, setCustLocation] = useState('');
  const [custNotes, setCustNotes] = useState('');

  const [senderPhone, setSenderPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientLocation, setRecipientLocation] = useState('');
  const [giftNote, setGiftNote] = useState('');

  const [receiptFile, setReceiptFile] = useState(null);
  const [successRef, setSuccessRef] = useState('');
  const fileInputRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────
  const formatNaira = (n) => '₦' + Math.round(n).toLocaleString('en-NG');

  const getProductById = (id) => CONFIG.PRODUCTS.find((p) => p.id === id);

  const calculateTotal = () => {
    if (!selectedSize) return 0;
    return selectedSize.price;
  };

  const goStep = (step) => {
    if (step === 2) {
      if (!selectedProduct || !selectedSize || !selectedCampus) {
        showToast('Please select product, size, and campus', true);
        return;
      }
      if (orderType === 'puff' && !selectedFlavour) {
        showToast('Please select a flavour', true);
        return;
      }
    }
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const submitOrder = async () => {
    // Validation
    if (orderType === 'normal') {
      if (!custName || !custPhone || !custLocation) {
        showToast('Please fill in all required fields', true);
        return;
      }
    } else {
      if (!senderPhone || !recipientName || !recipientLocation) {
        showToast('Please fill in all required fields', true);
        return;
      }
    }

    if (!receiptFile) {
      showToast('Please upload payment receipt', true);
      return;
    }

    const ref = generateRef();

    const orderData = {
      ref,
      orderType,
      status: 'pending',
      date: new Date().toLocaleDateString('en-NG'),
      time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
      items: selectedProduct.name,
      flavour: selectedFlavour,
      campus: selectedCampus,
      location: orderType === 'normal' ? custLocation : recipientLocation,
      total: calculateTotal(),
      notes: custNotes,
      ...(orderType === 'normal'
        ? {
            name: custName,
            phone: custPhone,
          }
        : {
            phone: senderPhone,
            gift: {
              recipient: recipientName,
              recipientPhone: recipientPhone,
              note: giftNote,
            },
          }),
    };

    // Save order to localStorage (in real app, send to backend)
    const existingOrders = JSON.parse(localStorage.getItem('sp_orders_v2') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('sp_orders_v2', JSON.stringify(existingOrders));

    setSuccessRef(ref);
    setCurrentStep(3);
    window.scrollTo(0, 0);
    showToast('Order placed successfully!');
  };

  const resetOrder = () => {
    setCurrentStep(1);
    setOrderType('normal');
    setSelectedProduct(null);
    setSelectedSize(null);
    setSelectedFlavour(null);
    setSelectedCampus(null);
    setCustName('');
    setCustPhone('');
    setCustLocation('');
    setCustNotes('');
    setSenderPhone('');
    setRecipientName('');
    setRecipientPhone('');
    setRecipientLocation('');
    setGiftNote('');
    setReceiptFile(null);
    window.scrollTo(0, 0);
  };

  const openWhatsApp = () => {
    const message = `Hi! I just placed order ${successRef}`;
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // ── Step 1: Product Selection ──────────────────────────────────
  if (currentStep === 1) {
    return (
      <div className="step active">
        <div className="section-label">Order type</div>
        <div className="order-type-row">
          <div
            className={`order-type-card ${orderType === 'normal' ? 'selected' : ''}`}
            onClick={() => setOrderType('normal')}
          >
            <div className="order-type-icon">🛍</div>
            <div className="order-type-title">Normal order</div>
            <div className="order-type-sub">Order for yourself</div>
          </div>
          <div
            className={`order-type-card ${orderType === 'gift' ? 'selected' : ''}`}
            onClick={() => setOrderType('gift')}
          >
            <div className="order-type-icon">🎁</div>
            <div className="order-type-title">Anonymous gift</div>
            <div className="order-type-sub">Surprise someone — they won't know it's you</div>
          </div>
        </div>

        {orderType === 'gift' && (
          <div className="info-banner">
            🎁 <strong>Anonymous mode:</strong> Your name stays hidden. We only need your WhatsApp to confirm payment, and the recipient's details for delivery.
          </div>
        )}

        <div className="section-label">What would you like?</div>
        <div className="product-grid">
          {CONFIG.PRODUCTS.map((product) => (
            <div
              key={product.name}
              className={`product-card ${selectedProduct?.name === product.name ? 'selected' : ''}`}
              onClick={() => {
                setSelectedProduct(product);
                setSelectedSize(null);
              }}
            >
              <div className="product-emoji">{product.emoji}</div>
              <div className="product-name">{product.name}</div>
              <div className="product-sizes">
                {product.sizes.map((size) => (
                  <div key={size.label} className="size-option">
                    {size.label} - {formatNaira(size.price)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <>
            <div className="section-label">Size</div>
            <div className="tag-row">
              {selectedProduct.sizes.map((size) => (
                <div
                  key={size.label}
                  className={`tag ${selectedSize?.label === size.label ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.label}
                </div>
              ))}
            </div>
          </>
        )}

        {selectedProduct?.hasFlavour && (
          <>
            <div className="section-label">Puff-puff flavour</div>
            <div className="tag-row">
              {CONFIG.FLAVOURS.map((flavour) => (
                <div
                  key={flavour}
                  className={`tag ${selectedFlavour === flavour ? 'selected' : ''}`}
                  onClick={() => setSelectedFlavour(flavour)}
                >
                  {flavour}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="section-label">Campus</div>
        <div className="tag-row">
          {CONFIG.CAMPUSES.map((campus) => (
            <div
              key={campus}
              className={`tag ${selectedCampus === campus ? 'selected' : ''}`}
              onClick={() => setSelectedCampus(campus)}
            >
              {campus}
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => goStep(2)}>
          Continue →
        </button>
      </div>
    );
  }

  // ── Step 2: Details & Payment ──────────────────────────────────
  if (currentStep === 2) {
    return (
      <div className="step active">
        <button className="btn-ghost" onClick={() => goStep(1)}>
          ← Back
        </button>

        {orderType === 'normal' ? (
          <div id="normal-fields">
            <div className="section-label">Your details</div>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label>WhatsApp number</label>
              <input
                type="tel"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="080..."
                autoComplete="tel"
              />
            </div>
            <div className="form-group">
              <label>Pickup / delivery location</label>
              <input
                type="text"
                value={custLocation}
                onChange={(e) => setCustLocation(e.target.value)}
                placeholder="e.g. Faculty of Science, Block A"
              />
            </div>
            <div className="form-group">
              <label>Special instructions <span className="optional">(optional)</span></label>
              <textarea
                value={custNotes}
                onChange={(e) => setCustNotes(e.target.value)}
                placeholder="Anything we should know..."
              />
            </div>
          </div>
        ) : (
          <div id="gift-fields">
            <div className="anon-section-card">
              <div className="anon-section-title">🕵️ Your contact (private)</div>
              <div className="anon-section-sub">Only used to confirm your payment — never shown to recipient</div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Your WhatsApp number</label>
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="080..."
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="anon-section-card" style={{ marginTop: '1rem' }}>
              <div className="anon-section-title">🎁 Recipient details</div>
              <div className="anon-section-sub">Who is receiving the gift?</div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Recipient's name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Who is this for?"
                />
              </div>
              <div className="form-group">
                <label>Recipient's WhatsApp <span className="optional">(optional)</span></label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="080..."
                />
              </div>
              <div className="form-group">
                <label>Delivery location</label>
                <input
                  type="text"
                  value={recipientLocation}
                  onChange={(e) => setRecipientLocation(e.target.value)}
                  placeholder="Where should we deliver?"
                />
              </div>
              <div className="form-group">
                <label>Your secret note <span className="optional">(optional)</span></label>
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Write something sweet... they'll love it 🧡"
                />
              </div>
            </div>
          </div>
        )}

        <div className="section-label">Order summary</div>
        <div className="summary-card">
          <div className="summary-item">
            <span className="summary-label">{selectedProduct?.name}</span>
            <span className="summary-value">{formatNaira(selectedSize?.price || 0)}</span>
          </div>
          {selectedFlavour && (
            <div className="summary-item">
              <span className="summary-label">Flavour: {selectedFlavour}</span>
            </div>
          )}
          <div className="summary-item">
            <span className="summary-label">Campus</span>
            <span className="summary-value">{selectedCampus}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">TOTAL</span>
            <span className="summary-value">{formatNaira(calculateTotal())}</span>
          </div>
        </div>

        <div className="section-label">Pay by bank transfer</div>
        <div className="bank-card">
          <div className="bank-title">🏦 Transfer to this account</div>
          <div className="bank-acct">{CONFIG.BANK_ACCOUNT_NUMBER}</div>
          <div className="bank-detail">{CONFIG.BANK_NAME}</div>
          <div className="bank-detail">{CONFIG.BANK_ACCOUNT_HOLDER}</div>
          <div className="bank-ref-note">📌 Use your WhatsApp number as the transfer reference</div>
        </div>

        <div className="section-label">Upload payment receipt</div>
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📎</div>
          <div className="upload-text">Tap to upload screenshot or photo of transfer</div>
          {receiptFile && <div className="upload-filename">{receiptFile.name}</div>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setReceiptFile(e.target.files[0]);
              showToast('Receipt uploaded');
            }
          }}
          style={{ display: 'none' }}
        />

        <button className="btn-primary" onClick={submitOrder}>
          Place order
        </button>
      </div>
    );
  }

  // ── Step 3: Success ────────────────────────────────────────────
  if (currentStep === 3) {
    return (
      <div className="step active">
        <div className="success-wrap">
          <div className="success-emoji">🎉</div>
          <div className="success-title">Order received!</div>
          <div className="success-sub">We've got your order and will confirm on WhatsApp shortly.</div>
          <div className="order-ref">{successRef}</div>
          <div className="success-sub">Save your reference to track your order.</div>
          <button className="wa-btn" onClick={openWhatsApp}>
            💬 Message us on WhatsApp
          </button>
          <button className="btn-ghost full-width" style={{ marginTop: '0.75rem' }} onClick={resetOrder}>
            Place another order
          </button>
        </div>
      </div>
    );
  }
};
