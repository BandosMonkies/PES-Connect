# 🚀 Quick Start Guide - PES Connect

## Running the Project Locally

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:8000`

### 2. Start Frontend (New Terminal)
```bash
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. MongoDB
Ensure MongoDB is running locally or update `server/.env` with your MongoDB URI.

---

## 📂 Quick File Reference

### Adding a New Page
1. Create file in `client/src/pages/NewPage.jsx`
2. Add route in `client/src/App.jsx`:
   ```jsx
   <Route path='/new-page' element={<NewPage />} />
   ```
3. Add navigation link in `client/src/components/Navbar.jsx`

### Creating a New Component
1. Create file in `client/src/components/NewComponent.jsx`
2. Export in `client/src/components/index.js`:
   ```jsx
   export { default as NewComponent } from './NewComponent.jsx';
   ```
3. Use anywhere:
   ```jsx
   import { NewComponent } from '../components';
   ```

### Adding API Endpoints
1. Create route in `server/routes/` or add to existing route file
2. Register in `server/index.js`:
   ```javascript
   app.use('/api/endpoint', endpointRoutes);
   ```
3. Call from frontend using `api` instance:
   ```javascript
   import api from '../lib/api';
   const response = await api.get('/api/endpoint');
   ```

---

## 🎨 Using Design System

### Colors (CSS Variables)
```css
var(--color-primary)        /* Orange #FF6B35 */
var(--color-secondary)      /* Blue #1E88E5 */
var(--color-white)          /* White #FFFFFF */
var(--bg-gradient)          /* Orange to Blue gradient */
```

### Reusable Components

#### Button
```jsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

#### Input
```jsx
<Input
  label="Email"
  type="email"
  name="email"
  value={value}
  onChange={handleChange}
  required
/>
```

#### Card
```jsx
<Card title="Title" subtitle="Subtitle">
  Content here
</Card>
```

---

## 🔐 Authentication

### Check Auth Status
```javascript
import { getAuth } from '../utils/auth';
const { user, token } = getAuth();
```

### Set Auth (After Login)
```javascript
import { setAuth } from '../utils/auth';
setAuth({ token: 'jwt-token', user: userData });
```

### Clear Auth (Logout)
```javascript
import { clearAuth } from '../utils/auth';
clearAuth();
```

---

## 🛠️ Common Tasks

### Make API Request
```javascript
import api from '../lib/api';

// GET
const { data } = await api.get('/api/endpoint');

// POST
const { data } = await api.post('/api/endpoint', { body });

// Token is automatically attached via interceptor
```

### Error Handling
```javascript
try {
  const { data } = await api.post('/api/auth/login', formData);
  // Handle success
} catch (err) {
  const message = err?.response?.data?.message || 'Operation failed';
  // Handle error
}
```

---

## 📦 Project Structure at a Glance

```
client/src/
├── components/     → Reusable UI components
├── pages/          → Route pages
├── constants/      → Theme & design tokens
├── lib/            → External configs (API)
├── utils/          → Helper functions
├── App.jsx         → Main app & routing
├── App.css         → Component styles
└── index.css       → Global styles

server/
├── models/         → Database schemas
├── routes/         → API endpoints
└── index.js        → Server setup
```

---

## 💡 Tips

1. **Always use reusable components** - Check `components/` before creating new ones
2. **Follow color scheme** - Use CSS variables for consistency
3. **Responsive design** - Test on mobile, tablet, and desktop
4. **Error handling** - Always wrap API calls in try-catch
5. **Clean imports** - Use component index: `import { Button } from '../components'`

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `server/.env` configuration
- Check port 8000 is not in use

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 is not in use

### API calls failing
- Verify backend is running on port 8000
- Check `client/.env` has correct `VITE_API_URL`
- Check browser console for CORS errors

### Authentication not working
- Clear localStorage: `localStorage.clear()`
- Check token is being stored
- Verify JWT_SECRET in server `.env`

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Axios](https://axios-http.com/)

---

**Need help? Check the full README or design system documentation!**
