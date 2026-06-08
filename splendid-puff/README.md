# Splendid Puff — React Migration

This is a complete React refactor of the Splendid Puff ordering and admin system. It maintains all functionality from the original HTML/JS version while leveraging React's component architecture for better maintainability and scalability.

## 📁 Project Structure

```
splendid-puff/
├── public/
├── src/
│   ├── components/
│   │   ├── AdminApp.jsx           # Admin app container
│   │   ├── AdminLock.jsx          # Admin PIN lock screen
│   │   ├── AdminPanel.jsx         # Admin dashboard
│   │   ├── CustomerApp.jsx        # Customer app container
│   │   ├── OrderCard.jsx          # Individual order card (admin)
│   │   ├── OrderForm.jsx          # Multi-step order form
│   │   ├── Toast.jsx              # Toast notifications
│   │   ├── TrackOrder.jsx         # Order tracking
│   │   └── index.js               # Component exports
│   ├── context/
│   │   └── AppContext.jsx         # Shared state & helpers
│   ├── App.jsx                    # Main app with mode switching
│   ├── main.jsx                   # React entry point
│   ├── styles.css                 # Global styles
│   └── config.js                  # Configuration
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite config
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Navigate to project directory
cd splendid-puff

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000` with hot module reloading.

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 🔄 Key Differences from Original

### State Management
- **Before**: Global variables + localStorage
- **After**: React Context API (AppContext) for centralized state

### Component Architecture
- **Before**: Monolithic HTML/JS files
- **After**: Modular React components
  - Separate concerns (form, tracking, admin panel)
  - Reusable components (Toast, OrderCard)
  - Clear parent-child relationships

### Navigation
- **Before**: CSS `.screen.active` toggle
- **After**: React state (`activeTab`) for cleaner switching

### Data Flow
- **Before**: Direct DOM manipulation
- **After**: Unidirectional data flow via React props

## 🎯 Features

### Customer Features
✅ Two order types: Normal order & Anonymous gift  
✅ Multi-step order form with validation  
✅ Product selection with sizes and flavors  
✅ Campus selection  
✅ Payment receipt upload  
✅ Order tracking by reference  
✅ WhatsApp integration  

### Admin Features
✅ PIN-protected access (default: 1234)  
✅ Order dashboard with stats  
✅ Filter orders by status  
✅ Expand order details  
✅ Advance order status  
✅ WhatsApp notifications  
✅ Direct call functionality  
✅ Real-time order updates  

## ⚙️ Configuration

Edit `config.js` to update:

```javascript
const CONFIG = {
  BUSINESS_NAME: "Splendid Puff Nigeria",
  WHATSAPP_NUMBER: "2349040233239",
  BANK_ACCOUNT_NUMBER: "8115781078",
  BANK_NAME: "Palmpay",
  ADMIN_PIN: "1234",
  SHEET_WEBHOOK_URL: "...", // Your Google Sheets webhook
  PRODUCTS: [...],           // Product catalog
  CAMPUSES: [...],           // Available campuses
  FLAVOURS: [...]            // Available flavors
};
```

## 🔐 Admin Access

### Development
Use keyboard shortcuts:
- **Ctrl+A**: Jump to admin
- **Ctrl+C**: Jump to customer

### Production
Locked access via PIN (configurable in `config.js`)

## 💾 Data Persistence

### Local Storage
- Orders stored in `localStorage` under key `sp_orders_v2`
- Format: JSON array of order objects

### Google Sheets
- Optional integration via webhook URL
- When `SHEET_WEBHOOK_URL` is set, orders sync to Sheets
- Set to empty string `""` for offline/localStorage only mode

## 📱 Responsive Design

The app is fully responsive:
- Mobile-first design
- Touch-friendly buttons and forms
- Optimized layouts for all screen sizes

## 🔧 Common Tasks

### Add a New Product

In `config.js`:
```javascript
PRODUCTS: [
  {
    id: "new-product",
    name: "Product Name",
    emoji: "🎉",
    hasFlavour: false,
    sizes: [
      { label: "Size", price: 500 }
    ]
  }
]
```

### Change Admin PIN

In `config.js`:
```javascript
ADMIN_PIN: "9999"  // New PIN
```

### Update WhatsApp Number

In `config.js`:
```javascript
WHATSAPP_NUMBER: "234901234567"  // New number (no +)
```

## 🎨 Styling

All styles in `styles.css` use CSS variables for easy theming:

```css
:root {
  --orange: #ff9500;
  --black: #0a0a0a;
  --border: #e5e5e5;
  /* ... more variables */
}
```

Modify these to change the color scheme globally.

## 📊 Context API Reference

### AppContext exports:

```javascript
{
  // State
  toast,              // { message, isError, visible }
  orders,             // Array of order objects

  // Methods
  showToast(msg, isError),              // Display notification
  loadOrders(),                         // Fetch orders from Sheets/localStorage
  saveOrders(updatedOrders),            // Persist orders
  updateStatusInSheet(ref, status),     // Sync to Google Sheets
  formatNaira(amount),                  // Format currency
  getProductName(id),                   // Get product by ID
  getProductEmoji(id),                  // Get product emoji
}
```

### Usage in Components:

```javascript
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { orders, formatNaira, showToast } = useAppContext();
  
  // Use in component...
}
```

## 🐛 Troubleshooting

### Orders not showing in admin?
- Check localStorage in DevTools → Application → Local Storage
- Verify `SHEET_WEBHOOK_URL` if using Google Sheets
- Try refreshing the page

### WhatsApp links not working?
- Ensure phone numbers include country code (e.g., 2349012345678)
- Test with WhatsApp Web in browser first

### Styles not loading?
- Ensure `styles.css` is properly imported in `App.jsx`
- Clear browser cache and hard refresh

## 📝 License

This project is based on the original Splendid Puff application.

## 🤝 Contributing

To extend this app:

1. Create new components in `src/components/`
2. Add state to AppContext if needed
3. Import and use components
4. Test thoroughly before deploying

## 📞 Support

For issues or questions:
- Check the original code comments
- Review React documentation
- Test in browser DevTools (F12)

---

**Happy coding! 🍩🧡**
