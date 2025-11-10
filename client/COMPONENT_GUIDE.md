# Component Usage Guide

Complete examples of how to use all reusable components in PES Connect.

## 📦 Importing Components

```jsx
// Single import
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

// Or use the index file for cleaner imports
import { Button, Input, Card } from '../components';
```

---

## 🔘 Button Component

### Basic Usage

```jsx
// Primary Button (Default)
<Button variant="primary" size="md">
  Primary Button
</Button>

// Secondary Button
<Button variant="secondary" size="md">
  Secondary Button
</Button>

// Outline Button
<Button variant="outline" size="md">
  Outline Button
</Button>
```

### Sizes

```jsx
// Small
<Button variant="primary" size="sm">Small Button</Button>

// Medium (default)
<Button variant="primary" size="md">Medium Button</Button>

// Large
<Button variant="primary" size="lg">Large Button</Button>
```

### States

```jsx
// Loading State
<Button variant="primary" loading={true}>
  Loading...
</Button>

// Disabled State
<Button variant="primary" disabled={true}>
  Disabled
</Button>
```

### Advanced Examples

```jsx
// Full Width Button
<Button variant="primary" className="w-full">
  Full Width Button
</Button>

// With Click Handler
<Button 
  variant="primary" 
  onClick={() => console.log('Clicked!')}
>
  Click Me
</Button>

// Submit Button in Form
<Button 
  type="submit" 
  variant="primary" 
  loading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Props Reference

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | 'primary' | 'primary', 'secondary', 'outline' |
| `size` | string | 'md' | 'sm', 'md', 'lg' |
| `loading` | boolean | false | true, false |
| `disabled` | boolean | false | true, false |
| `type` | string | 'button' | 'button', 'submit', 'reset' |
| `onClick` | function | - | Any function |
| `className` | string | '' | Any CSS classes |

---

## 📝 Input Component

### Basic Usage

```jsx
// Text Input
<Input
  label="Full Name"
  type="text"
  name="name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Email Input
<Input
  label="Email Address"
  type="email"
  name="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

// Password Input
<Input
  label="Password"
  type="password"
  name="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```

### With Error Handling

```jsx
<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  error="Please enter a valid email address"
/>
```

### Number Input

```jsx
<Input
  label="Age"
  type="number"
  name="age"
  min="18"
  max="100"
  value={age}
  onChange={(e) => setAge(e.target.value)}
/>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Input label text |
| `type` | string | 'text' | HTML input type |
| `name` | string | - | Input name |
| `id` | string | - | Input id (defaults to name) |
| `value` | string | - | Input value |
| `placeholder` | string | - | Placeholder text |
| `required` | boolean | false | Required field |
| `onChange` | function | - | Change handler |
| `error` | string | - | Error message to display |
| `className` | string | '' | Additional CSS classes |

---

## 🎴 Card Component

### Basic Usage

```jsx
// Simple Card
<Card>
  <p>This is a basic card with just content</p>
</Card>

// Card with Title
<Card title="Welcome">
  <p>This card has a title</p>
</Card>

// Card with Title and Subtitle
<Card 
  title="Getting Started" 
  subtitle="Learn the basics"
>
  <p>Card content goes here</p>
</Card>
```

### Card Variants

```jsx
// Default Card
<Card variant="default" title="Standard Card">
  <p>White background card</p>
</Card>

// Gradient Card
<Card 
  variant="gradient"
  title="Premium Feature"
  subtitle="Unlock with Pro"
>
  <p>Card with gradient background</p>
</Card>

// Feature Card with Icon
<Card 
  variant="feature"
  icon="🚀"
  title="Fast Performance"
  subtitle="Lightning-fast load times"
/>
```

### Custom Styling

```jsx
<Card 
  title="Custom Card"
  className="mt-4"
  style={{ maxWidth: '600px', margin: '0 auto' }}
>
  <p>This card has custom styling</p>
</Card>
```

### Props Reference

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | string | 'default' | 'default', 'gradient', 'feature' |
| `title` | string | - | Card title |
| `subtitle` | string | - | Card subtitle |
| `icon` | string/ReactNode | - | Icon (for feature variant) |
| `children` | ReactNode | - | Card content |
| `className` | string | '' | Additional CSS classes |

---

## 💡 Real-World Examples

### Login Form

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // API call logic
  };

  return (
    <Card title="Login" subtitle="Welcome back!">
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          loading={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className="form-message error">{error}</p>}
      </form>
    </Card>
  );
}
```

### Feature Grid

```jsx
function Features() {
  const features = [
    { icon: '🔐', title: 'Secure', desc: 'Top-notch security' },
    { icon: '⚡', title: 'Fast', desc: 'Lightning speed' },
    { icon: '🎯', title: 'Accurate', desc: 'Precise results' },
  ];

  return (
    <div className="features-grid">
      {features.map((feature, index) => (
        <Card
          key={index}
          variant="feature"
          icon={feature.icon}
          title={feature.title}
          subtitle={feature.desc}
        />
      ))}
    </div>
  );
}
```

### Action Buttons

```jsx
function ActionButtons() {
  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
```

### Profile Card

```jsx
function ProfileCard({ user }) {
  return (
    <Card title={user.name} subtitle={user.email}>
      <div style={{ marginTop: '1rem' }}>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined:</strong> {user.joinedDate}</p>
        <Button variant="primary" size="sm" className="mt-4">
          Edit Profile
        </Button>
      </div>
    </Card>
  );
}
```

---

## 🎨 Styling Tips

### Using CSS Variables

```jsx
<div style={{ 
  background: 'var(--bg-gradient)',
  padding: 'var(--spacing-xl)',
  borderRadius: 'var(--radius-lg)',
  color: 'var(--color-white)'
}}>
  Styled with CSS variables
</div>
```

### Using Utility Classes

```jsx
<div className="container mt-8 mb-4">
  <h2 className="text-center mb-4">Title</h2>
  <p className="text-muted">Description</p>
</div>
```

### Available Utility Classes

- **Spacing**: `mt-1`, `mt-2`, `mt-4`, `mt-6`, `mt-8`, `mb-2`, `mb-4`, `mb-8`
- **Text**: `text-center`, `text-muted`, `text-primary`, `text-secondary`, `text-white`
- **Width**: `w-full`
- **Font**: `font-bold`, `font-semibold`
- **Flex**: `flex`, `flex-col`, `items-center`, `justify-center`, `justify-between`

---

## ♿ Accessibility Best Practices

### Always Include Labels

```jsx
// ✅ Good - Has label
<Input label="Email" type="email" />

// ❌ Bad - No label
<input type="email" />
```

### Use Semantic HTML

```jsx
// ✅ Good - Button element
<Button type="submit">Submit</Button>

// ❌ Bad - Div as button
<div onClick={handleClick}>Submit</div>
```

### Required Fields

```jsx
<Input 
  required 
  label="Email Address" 
  type="email"
  // ... other props
/>
```

### Meaningful Button Text

```jsx
// ✅ Good - Descriptive
<Button>Save Changes</Button>

// ❌ Bad - Generic
<Button>Click Here</Button>
```

---

## ⚡ Performance Tips

### Memoize Callbacks

```jsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

<Button onClick={handleClick}>Click</Button>
```

### Use Keys in Lists

```jsx
{items.map(item => (
  <Card key={item.id} title={item.title} />
))}
```

### Lazy Load Components

```jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## 📚 Additional Resources

- See `DESIGN_SYSTEM.md` for complete design documentation
- Check `theme.js` for all available design tokens
- Review `index.css` for all CSS variables
- Look at existing pages for more examples
