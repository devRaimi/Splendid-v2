# Migration Guide: HTML/JS → React

This guide explains how the original code has been refactored into React components.

## 📋 Function Mappings

### Original `index.html` → React Components

| Original | New Component | Purpose |
|----------|---|---|
| `step-1` | `OrderForm` (state 1) | Product selection |
| `step-2` | `OrderForm` (state 2) | Details & payment |
| `step-3` | `OrderForm` (state 3) | Success screen |
| `tab-order` | `CustomerApp` | Order tab |
| `tab-track` | `TrackOrder` | Tracking tab |

### Original `admin.html` → React Components

| Original | New Component | Purpose |
|----------|---|---|
| `lock-screen` | `AdminLock` | PIN authentication |
| `admin-panel` | `AdminPanel` | Dashboard |
| Orders list | `OrderCard` | Individual order |

## 🔄 State Management Migration

### Before (Vanilla JS)
```javascript
let orders = [];
let currentFilter = 'all';
let adminUnlocked = false;

function loadOrders() {
  orders = await fetch(...);
  refreshData();
}

function saveOrders() {
  localStorage.setItem('sp_orders_v2', JSON.stringify(orders));
}
```

### After (React)
```javascript
// In AppContext.jsx
const [orders, setOrders] = useState([]);

const loadOrders = useCallback(async () => {
  const res = await fetch(...);
  setOrders(res);
}, []);

const saveOrders = useCallback((updatedOrders) => {
  localStorage.setItem('sp_orders_v2', JSON.stringify(updatedOrders));
  setOrders(updatedOrders);
}, []);

// Usage in components
const { orders, loadOrders, saveOrders } = useAppContext();
```

## 📍 Navigation Migration

### Before (DOM-based)
```javascript
function goStep(step) {
  document.getElementById('step-1').classList.remove('active');
  document.getElementById('step-2').classList.add('active');
}

function showTab(tab) {
  document.getElementById('tab-order').style.display = 'block';
  document.getElementById('tab-track').style.display = 'none';
}
```

### After (React state)
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [activeTab, setActiveTab] = useState('order');

function goStep(step) {
  setCurrentStep(step);
}

// In JSX
{currentStep === 1 && <OrderForm />}
{currentStep === 2 && <DeliveryDetails />}
{activeTab === 'order' && <OrderForm />}
{activeTab === 'track' && <TrackOrder />}
```

## 🎯 Form Handling Migration

### Before (Direct DOM)
```javascript
const name = document.getElementById('cust-name').value;
document.getElementById('cust-name').value = '';
```

### After (React state)
```javascript
const [custName, setCustName] = useState('');

<input
  value={custName}
  onChange={(e) => setCustName(e.target.value)}
/>
```

## 🔔 Toast Notifications

### Before
```javascript
function toast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => (el.className = 'toast'), 3000);
}
```

### After
```javascript
const { showToast } = useAppContext();

showToast('Success message');
showToast('Error message', true);
```

## 🔒 Admin Authentication

### Before
```javascript
let adminUnlocked = false;

function checkPin() {
  const pin = document.getElementById('pin-input').value;
  if (pin === CONFIG.ADMIN_PIN) {
    adminUnlocked = true;
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
  }
}
```

### After
```javascript
const [adminUnlocked, setAdminUnlocked] = useState(false);

function checkPin() {
  if (pin === CONFIG.ADMIN_PIN) {
    setAdminUnlocked(true);
  }
}

return !adminUnlocked ? <AdminLock /> : <AdminPanel />;
```

## 📦 Event Handling

### Before (Inline onclick)
```html
<button onclick="goStep(2)">Continue</button>
```

### After (React onClick)
```jsx
<button onClick={() => goStep(2)}>Continue</button>
```

## 🎨 Conditional Rendering

### Before
```javascript
if (orderType === 'gift') {
  document.getElementById('gift-fields').style.display = 'block';
  document.getElementById('normal-fields').style.display = 'none';
}
```

### After
```jsx
{orderType === 'normal' ? (
  <div id="normal-fields">...</div>
) : (
  <div id="gift-fields">...</div>
)}
```

## 📱 List Rendering

### Before
```javascript
const html = filtered.map((o) => `
  <div class="order-card">
    <div class="order-name">${o.name}</div>
  </div>
`).join('');
list.innerHTML = html;
```

### After
```jsx
{filteredOrders.map((order) => (
  <OrderCard
    key={order.ref}
    order={order}
    onAdvanceStatus={() => advanceStatus(order.ref)}
  />
))}
```

## 🔄 Data Updates

### Before
```javascript
function advanceStatus(ref) {
  const order = orders.find((o) => o.ref === ref);
  order.status = 'confirmed';
  saveOrders();
  refreshData();
}
```

### After
```javascript
const advanceStatus = (ref) => {
  const updatedOrders = orders.map((o) =>
    o.ref === ref ? { ...o, status: 'confirmed' } : o
  );
  saveOrders(updatedOrders);
};
```

## 🎯 Common Patterns

### Opening WhatsApp
**Before & After (same)**
```javascript
const msg = encodeURIComponent('Your message');
window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
```

### Making Phone Calls
**Before & After (same)**
```javascript
window.open(`tel:${phone}`);
```

### Formatting Currency
**Before**
```javascript
function formatNaira(n) {
  return '₦' + Math.round(n).toLocaleString('en-NG');
}
formatNaira(1000);
```

**After**
```javascript
const { formatNaira } = useAppContext();
formatNaira(1000);
```

## 💡 Key Improvements

1. **Component Reusability**: Toast, OrderCard can be reused
2. **State Isolation**: Each component manages its own state
3. **Better Testing**: Pure functions easier to test
4. **Performance**: React optimizes DOM updates
5. **Maintainability**: Clear separation of concerns
6. **Scalability**: Easy to add features

## ⚠️ Breaking Changes

None. All functionality is preserved exactly as before.

## 🔗 Context Dependency

All components that use app-wide data now depend on:
```javascript
import { useAppContext } from '../context/AppContext';
```

Ensure `AppProvider` wraps your app in `main.jsx` (it does by default).

## 📚 Further Reading

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Context API](https://react.dev/reference/react/useContext)
- [Best Practices for Form Handling](https://react.dev/learn/sharing-state-between-components)

---

**Migration complete! The app now leverages React's power while maintaining all original functionality.** 🚀
