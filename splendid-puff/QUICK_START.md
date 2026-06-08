# 🚀 Quick Start Guide

Get the Splendid Puff React app running in 5 minutes!

## Step 1: Setup (2 minutes)

```bash
# Navigate to project directory
cd splendid-puff

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens automatically at `http://localhost:3000`

## Step 2: Test Customer Mode (1 minute)

1. **Place an Order**
   - Click 🛍 Order tab
   - Select "Normal order" or "🎁 Anonymous gift"
   - Pick products, size, flavor, campus
   - Fill in your details
   - Upload a test image as receipt
   - Click "Place order"

2. **Track Order**
   - Note your order reference (e.g., SP-12345)
   - Click 📍 Track tab
   - Enter your reference
   - See your order status

## Step 3: Test Admin Mode (2 minutes)

### Method 1: Keyboard Shortcut
Press `Ctrl + A` to jump to admin panel

### Method 2: Mode Switcher Button
- Uncomment the button in `App.jsx` (line ~58)
- `display: 'block'` instead of `display: 'none'`
- Click the button to switch modes

### Default PIN: `1234`

**What to test in admin:**
- See all orders dashboard
- Filter by status (Pending, Confirmed, Ready, Completed)
- Click orders to expand details
- Advance order status with buttons
- Click "Notify" to open WhatsApp
- Click "Call" to make phone calls
- Refresh to reload from Google Sheets (if connected)

## Configuration

### Change Admin PIN

Open `config.js`:
```javascript
ADMIN_PIN: "9999"  // Change to your PIN
```

### Add Products

Edit `config.js` in the PRODUCTS array:
```javascript
PRODUCTS: [
  {
    id: "new-item",
    name: "New Item",
    emoji: "🎉",
    hasFlavour: false,
    sizes: [
      { label: "Small", price: 500 },
      { label: "Large", price: 1000 }
    ]
  }
  // ...
]
```

### Connect Google Sheets (Optional)

1. Set up Google Apps Script webhook (see original code comments)
2. Paste URL in `config.js`:
```javascript
SHEET_WEBHOOK_URL: "https://script.google.com/macros/s/YOUR_ID/exec"
```

3. Leave empty `""` to use localStorage only (offline mode)

### Update Bank Details

In `config.js`:
```javascript
BANK_ACCOUNT_NUMBER: "1234567890",
BANK_NAME: "Your Bank",
BANK_ACCOUNT_HOLDER: "Your Business Name"
```

### Change WhatsApp Number

In `config.js`:
```javascript
WHATSAPP_NUMBER: "2349012345678"  // No + sign
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + A | Jump to admin |
| Ctrl + C | Jump to customer |
| Enter | Submit forms |

## Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- --port 3001
```

### Dependencies won't install?
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm install
```

### Styles look broken?
1. Hard refresh browser (Ctrl+Shift+R)
2. Check DevTools for CSS errors
3. Ensure `styles.css` is in root

### Orders not saving?
1. Check DevTools → Application → Local Storage
2. Look for `sp_orders_v2` key
3. If using Google Sheets, check webhook URL

### WhatsApp links don't work?
- Test phone numbers include country code (234...)
- Open WhatsApp Web in same browser first
- Check message encoding (special characters?)

## Project Files Checklist

After setup, you should have:
- ✅ `package.json` - Dependencies
- ✅ `index.html` - HTML entry point
- ✅ `vite.config.js` - Build config
- ✅ `App.jsx` - Main component
- ✅ `main.jsx` - React init
- ✅ `styles.css` - All styling
- ✅ `config.js` - Settings
- ✅ `context/AppContext.jsx` - State management
- ✅ `components/` - 8+ components
- ✅ `README.md` - Full docs
- ✅ `MIGRATION_GUIDE.md` - HTML→React guide

## Next Steps

### For Development
1. Customize colors in `styles.css` (CSS variables at top)
2. Add more products in `config.js`
3. Modify form fields in `OrderForm.jsx`
4. Test with real phone numbers

### For Production
1. Run `npm run build`
2. Deploy `dist/` folder to hosting
3. Set real `SHEET_WEBHOOK_URL`
4. Change `ADMIN_PIN` to secure value
5. Add environment variables (see .gitignore)

### For Scaling
1. Add backend database
2. Implement proper authentication
3. Add email notifications
4. Create mobile app (React Native)
5. Add analytics
6. Set up CI/CD pipeline

## Documentation

- **README.md** - Full reference guide
- **MIGRATION_GUIDE.md** - How vanilla JS became React
- **PROJECT_STRUCTURE.md** - File organization explained

## Quick Code Examples

### Using App Context
```javascript
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { orders, formatNaira, showToast } = useAppContext();
  
  // Use in component...
  return <div>{formatNaira(1000)}</div>;
}
```

### Adding a Toast
```javascript
showToast('Success!');
showToast('Error occurred!', true);
```

### Filtering Orders
```javascript
const pending = orders.filter(o => o.status === 'pending');
```

### Advancing Order Status
```javascript
const updatedOrders = orders.map(o =>
  o.ref === ref ? { ...o, status: 'confirmed' } : o
);
saveOrders(updatedOrders);
```

## Common Customizations

### Change Colors
Edit `styles.css` variables:
```css
--orange: #ff9500;    /* Primary color */
--black: #0a0a0a;     /* Dark color */
--border: #e5e5e5;    /* Border color */
```

### Change Fonts
Edit Google Fonts link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap">
```

### Modify Header
Edit `CustomerApp.jsx` and `AdminApp.jsx`

### Add New Tab
Edit `CustomerApp.jsx`:
1. Add state for new tab
2. Add button in nav
3. Add new screen component

## Support

- Check `README.md` for detailed docs
- Review `MIGRATION_GUIDE.md` for React patterns
- Look at `PROJECT_STRUCTURE.md` for file organization
- DevTools (F12) for debugging

---

**You're ready! Run `npm run dev` and start testing!** 🎉

Any issues? Check the troubleshooting section above or review the full documentation files.
