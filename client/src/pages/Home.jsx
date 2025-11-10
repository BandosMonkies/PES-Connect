import React from 'react'
import { Link } from 'react-router-dom';
import { getAuth } from '../utils/auth';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Home() {
  const { user, token } = getAuth();
  
  return (
    <div className="main-content">
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <h1 className="hero-title">Welcome to PES Connect</h1>
          <p className="hero-subtitle">
            Your gateway to seamless campus connectivity and collaboration
          </p>
          {!token && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/register">
                <Button variant="secondary" size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Status Section */}
        {token ? (
          <Card 
            title="Dashboard" 
            subtitle={`Welcome back, ${user?.name || user?.email}!`}
            style={{ marginBottom: '2rem', textAlign: 'center' }}
          >
            <div style={{ padding: '2rem 0' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-gray)', marginBottom: '0' }}>
                You're successfully logged in and ready to explore PES Connect!
              </p>
            </div>
          </Card>
        ) : (
          <Card 
            title="Get Started" 
            subtitle="Join our community today"
            style={{ marginBottom: '2rem', textAlign: 'center' }}
          >
            <div style={{ padding: '1rem 0' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
                You are not logged in. Register or login to access all features.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/register">
                  <Button variant="primary">Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Features Section */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.25rem' }}>
            Why Choose PES Connect?
          </h2>
          <div className="features-grid">
            <Card 
              variant="feature"
              icon="🔐"
              title="Secure Authentication"
              subtitle="Your data is protected with industry-standard security measures and encrypted connections."
            />
            <Card 
              variant="feature"
              icon="⚡"
              title="Fast & Reliable"
              subtitle="Experience lightning-fast performance with our optimized infrastructure and modern technology."
            />
            <Card 
              variant="feature"
              icon="🎯"
              title="Easy to Use"
              subtitle="Intuitive interface designed for seamless navigation and effortless user experience."
            />
            <Card 
              variant="feature"
              icon="🤝"
              title="Community Driven"
              subtitle="Connect with peers, share knowledge, and build lasting relationships within the PES community."
            />
            <Card 
              variant="feature"
              icon="📱"
              title="Responsive Design"
              subtitle="Access from any device - desktop, tablet, or mobile - with a fully responsive interface."
            />
            <Card 
              variant="feature"
              icon="🚀"
              title="Future Ready"
              subtitle="Built with scalability in mind, ready to grow with new features and capabilities."
            />
          </div>
        </div>

        {/* Call to Action */}
        {!token && (
          <div style={{ 
            marginTop: '4rem', 
            textAlign: 'center', 
            padding: '3rem 1rem',
            background: 'var(--bg-gradient)',
            borderRadius: 'var(--radius-xl)',
            color: 'var(--color-white)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-white)' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.95 }}>
              Join thousands of students already using PES Connect
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Your Account Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
