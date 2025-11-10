# PES Connect - Frontend Design System

## 🎨 Design Overview

PES Connect features a modern, beautiful UI with a carefully crafted color scheme using **Orange**, **Blue**, and **White**.

### Color Palette

#### Primary Colors (Orange)
- **Primary Orange**: `#FF6B35` - Main brand color
- **Light Orange**: `#FF8C61` - Hover states, highlights
- **Dark Orange**: `#E55A2B` - Active states
- **Very Light Orange**: `#FFE5DC` - Backgrounds, subtle accents

#### Secondary Colors (Blue)
- **Primary Blue**: `#1E88E5` - Secondary brand color
- **Light Blue**: `#42A5F5` - Hover states
- **Dark Blue**: `#1565C0` - Active states
- **Very Light Blue**: `#E3F2FD` - Backgrounds

#### Neutral Colors
- **White**: `#FFFFFF`
- **Off White**: `#F8F9FA` - Page background
- **Light Gray**: `#E9ECEF` - Borders, dividers
- **Gray**: `#6C757D` - Muted text
- **Dark Gray**: `#495057` - Secondary text
- **Dark**: `#212529` - Primary text

## 📁 File Structure

```
client/src/
├── constants/
│   └── theme.js           # Design tokens and theme configuration
├── components/
│   ├── Navbar.jsx         # Navigation bar with gradient
│   ├── Button.jsx         # Reusable button component
│   ├── Input.jsx          # Reusable input component
│   └── Card.jsx           # Reusable card component
├── pages/
│   ├── Home.jsx           # Landing page with hero and features
│   ├── Login.jsx          # Login page with modern form
│   └── Register.jsx       # Registration page
├── lib/
│   └── api.js             # Axios configuration and interceptors
├── utils/
│   └── auth.js            # Authentication helpers
├── App.jsx                # Main app component with routing
├── App.css                # Component-specific styles
└── index.css              # Global styles and CSS variables
```

## 🧩 Component Library

### Button Component
```jsx
import Button from './components/Button';

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean

### Input Component
```jsx
import Input from './components/Input';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  required
/>
```

### Card Component
```jsx
import Card from './components/Card';

<Card 
  variant="default"
  title="Card Title"
  subtitle="Card subtitle"
>
  Card content
</Card>
```

**Variants:**
- `default`: Standard white card
- `gradient`: Card with gradient background
- `feature`: Feature card with icon support

## 🎯 Key Features

### 1. **Gradient Design**
- Beautiful orange-to-blue gradients used throughout
- Navbar features a stunning gradient background
- Buttons and hero sections use gradient effects

### 2. **Responsive Design**
- Fully responsive on all devices
- Mobile-first approach
- Breakpoints at 768px and 480px

### 3. **Modern Animations**
- Smooth transitions on all interactive elements
- Hover effects on cards and buttons
- Loading spinners for async operations

### 4. **Consistent Spacing**
- CSS variables for spacing (xs, sm, md, lg, xl, xxl)
- Consistent padding and margins throughout

### 5. **Typography**
- **Primary Font**: Inter (body text)
- **Heading Font**: Poppins (headings)
- Proper font weights and sizes

## 🔧 CSS Variables

All design tokens are available as CSS variables:

```css
/* Colors */
--color-primary: #FF6B35;
--color-secondary: #1E88E5;

/* Gradients */
--bg-gradient: linear-gradient(135deg, #FF6B35 0%, #1E88E5 100%);

/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl

/* Border Radius */
--radius-sm, --radius-md, --radius-lg, --radius-xl

/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl
```

## 🚀 Getting Started

### Development
```bash
cd client
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

## 🔐 Backend Integration

All backend connections are maintained through:
- **API Client**: `src/lib/api.js` (Axios with interceptors)
- **Auth Utils**: `src/utils/auth.js` (localStorage management)
- **API Routes**: All routes connect to `/api/auth/*` endpoints

The frontend seamlessly communicates with the backend for:
- User registration
- User login
- Token-based authentication
- Protected routes

## 📱 Pages

### Home Page (`/`)
- Hero section with gradient background
- Feature cards showcasing benefits
- Conditional rendering based on auth state
- Call-to-action sections

### Login Page (`/login`)
- Modern form with validation
- Error handling
- Links to registration
- Security messaging

### Register Page (`/register`)
- User-friendly registration form
- Success/error messaging
- Benefits section
- Smooth redirect after registration

## 🎨 Customization

To customize colors, edit `src/constants/theme.js` and the CSS variables in `src/index.css`.

## 📦 Future Scalability

The file structure is designed for easy expansion:
- Add new components to `src/components/`
- Add new pages to `src/pages/`
- Add new utilities to `src/utils/`
- Add new features while maintaining consistency

## 🤝 Contributing

When adding new features:
1. Use existing components when possible
2. Follow the established color scheme
3. Maintain consistent spacing using CSS variables
4. Ensure responsive design
5. Test on multiple devices
