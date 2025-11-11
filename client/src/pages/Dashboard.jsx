import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from '../utils/auth';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Dashboard() {
  const { user, token } = getAuth();

  // Redirect to login if not authenticated
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  const features = [
    {
      id: 'chat',
      icon: '💬',
      title: 'Chat App',
      description: 'Connect with your peers through instant messaging, just like WhatsApp',
      link: '/chat',
      color: '#1E88E5',
      status: 'Coming Soon'
    },
    {
      id: 'discussion',
      icon: '💭',
      title: 'Discussion Forum',
      description: 'Join discussions, ask questions, and share knowledge like Reddit',
      link: '/discussion',
      color: '#FF6B35',
      status: 'Coming Soon'
    },
    {
      id: 'resell',
      icon: '🛒',
      title: 'Resell Marketplace',
      description: 'Buy and sell items within the PES community - books, electronics, and more',
      link: '/resell',
      color: '#28A745',
      status: 'Available'
    },
    {
      id: 'notes',
      icon: '📚',
      title: 'Notes Sharing',
      description: 'Share and access study materials, notes, and resources like Discord',
      link: '/notes',
      color: '#9C27B0',
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="main-content">
      <div className="container">
        {/* Welcome Section */}
        <div className="hero" style={{ marginBottom: '2rem' }}>
          <h1 className="hero-title">Welcome to PES Connect</h1>
          <p className="hero-subtitle">
            Hello, {user?.name || user?.email}! Explore all the features below
          </p>
        </div>

        {/* Dashboard Features Grid */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            fontSize: '2.25rem',
            color: 'var(--color-dark)'
          }}>
            Explore Features
          </h2>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {features.map((feature) => (
              <Card
                key={feature.id}
                variant="default"
                className="dashboard-feature-card"
                style={{
                  position: 'relative',
                  cursor: feature.status === 'Available' ? 'pointer' : 'default',
                  opacity: feature.status === 'Available' ? 1 : 0.8
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div 
                    className="feature-icon"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                      margin: '0 auto var(--spacing-md)'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description" style={{ marginBottom: '1.5rem' }}>
                    {feature.description}
                  </p>
                  {feature.status === 'Available' ? (
                    <Link to={feature.link}>
                      <Button 
                        variant="primary" 
                        className="w-full"
                        style={{ 
                          background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                          border: 'none'
                        }}
                      >
                        Open {feature.title}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled
                      style={{ 
                        color: 'var(--color-gray)',
                        borderColor: 'var(--color-light-gray)',
                        cursor: 'not-allowed'
                      }}
                    >
                      {feature.status}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats or Info */}
        <Card 
          variant="gradient"
          style={{ 
            marginTop: '3rem', 
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
            Your PES Connect Hub
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
            All your campus needs in one place - chat, discuss, buy, sell, and share knowledge
          </p>
        </Card>
      </div>
    </div>
  );
}

