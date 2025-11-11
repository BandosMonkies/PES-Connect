import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from '../../utils/auth';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProductCard from '../../components/resell/ProductCard';
import { demoProducts } from '../../data/demoProducts.js';

export default function ProductList() {
  const { token } = getAuth();
  const [products] = useState(demoProducts);
  const [filteredProducts, setFilteredProducts] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);

  // Filter and search products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = ['all', 'electronics', 'books', 'sports', 'accessories', 'other'];

  if (!token) return null;

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Resell Marketplace</h1>
            <p style={{ color: 'var(--color-gray)', fontSize: '1.125rem' }}>
              Buy and sell items within the PES community
            </p>
          </div>
          <Link to="/resell/add">
            <Button variant="primary" size="lg">
              ➕ Sell Item
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Search */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Category Filter */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="sports">Sports</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Sort */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p style={{ 
            color: 'var(--color-gray)', 
            fontSize: '0.9rem',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              Try adjusting your search or filters
            </p>
            <Button 
              variant="primary" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

