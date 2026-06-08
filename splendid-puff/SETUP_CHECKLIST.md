## ✅ SETUP CHECKLIST

### Pre-Installation
- [ ] You have Node.js 16+ installed (`node --version`)
- [ ] You have npm installed (`npm --version`)
- [ ] You downloaded/extracted the `splendid-puff` folder

### Installation (2 minutes)
```bash
cd splendid-puff
npm install
npm run dev
```
- [ ] npm install completes without errors
- [ ] `npm run dev` starts the server
- [ ] Browser opens to `http://localhost:3000`
- [ ] App loads without errors in console

### First Test (3 minutes)

**Customer Mode:**
- [ ] Try placing an order (🛍️ Order tab)
- [ ] Select products, size, campus
- [ ] Fill in customer details
- [ ] Upload a test image as receipt
- [ ] Get order reference (e.g., SP-12345)
- [ ] See success screen

**Tracking:**
- [ ] Click 📍 Track tab
- [ ] Enter your order reference
- [ ] See your order details and status

**Admin Mode:**
- [ ] Press `Ctrl + A` to enter admin
- [ ] See login screen
- [ ] Enter PIN: `1234`
- [ ] See admin dashboard with your order
- [ ] Click order to expand details
- [ ] Try "Notify" button (opens WhatsApp)
- [ ] Try "Call" button (opens phone dialer)

### Customization (as needed)

**Settings to change (edit `src/config.js`):**
- [ ] Change `ADMIN_PIN` from "1234" to your PIN
- [ ] Update `WHATSAPP_NUMBER` with your business number
- [ ] Update bank details (ACCOUNT_NUMBER, BANK_NAME, etc)
- [ ] Update product list if needed
- [ ] Add/remove campus locations

**Styling (edit `src/styles.css`):**
- [ ] Change colors (search for `--orange: #ff9500`)
- [ ] Adjust fonts (Google Fonts link in index.html)
- [ ] Modify spacing/padding as needed

### Google Sheets Integration (optional)

If you want orders to sync to Google Sheets:
- [ ] Set up Google Apps Script (see original code comments)
- [ ] Get deployment URL
- [ ] Paste URL in `config.js` as `SHEET_WEBHOOK_URL`
- [ ] Test that orders save to Sheets

### Deployment (for production)

```bash
npm run build
```
- [ ] Build completes successfully
- [ ] Check `dist/` folder is created
- [ ] Upload contents of `dist/` folder to your hosting
- [ ] Test live version

### Deployment Options
- [ ] **Vercel** (easiest): `npm i -g vercel` then `vercel`
- [ ] **Netlify** (easy): Drag & drop `dist` folder
- [ ] **GitHub Pages** (free): Push to gh-pages branch
- [ ] **Traditional hosting**: Upload `dist` via FTP/SFTP

---

## 📚 DOCUMENTATION READING ORDER

1. **QUICK_START.md** ← Start here (5 min)
   - Setup instructions
   - Basic testing
   - Configuration quick reference

2. **README.md** (15 min)
   - Complete feature list
   - All configuration options
   - Troubleshooting
   - API reference

3. **PROJECT_STRUCTURE.md** (10 min)
   - File organization
   - Component hierarchy
   - Data flow

4. **MIGRATION_GUIDE.md** (for developers)
   - How vanilla JS became React
   - Code patterns explained
   - Before/after examples

---

## 🎯 COMMON FIRST STEPS

### I want to change the colors
→ Edit `src/styles.css` (CSS variables at top)

### I want to add/remove products
→ Edit `src/config.js` (PRODUCTS array)

### I want to change the admin PIN
→ Edit `src/config.js` (ADMIN_PIN)

### I want to change the business name
→ Edit `src/config.js` (BUSINESS_NAME)

### I want to change the form fields
→ Edit `src/components/OrderForm.jsx`

### I want to add a new section
→ Create new component in `src/components/`

### I want to deploy to production
→ Run `npm run build`, then upload `dist/` folder

---

## 🆘 TROUBLESHOOTING

**"npm: command not found"**
→ Install Node.js from nodejs.org

**"Port 3000 in use"**
→ `npm run dev -- --port 3001`

**"Styles look broken"**
→ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**"Orders not saving"**
→ Check localStorage in DevTools → Application tab

**"WhatsApp links don't work"**
→ Ensure phone numbers start with country code (234...)

**"Admin PIN doesn't work"**
→ Make sure you changed it in `src/config.js` correctly

---

## 📞 SUPPORT

- Check the README.md for detailed docs
- Review QUICK_START.md for setup help
- Look at examples in existing components
- Check browser console (F12) for errors
- Test in a fresh browser window

---

## ✨ YOU'RE READY!

```bash
# Run this command to get started:
npm install && npm run dev
```

Your app will open at `http://localhost:3000` 🚀

Questions? Check the docs!
Stuck? Review the troubleshooting section above.
