import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProductList from './pages/resell/ProductList.jsx';
import ProductDetail from './pages/resell/ProductDetail.jsx';
import AddProduct from './pages/resell/AddProduct.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resell' element={<ProductList />} />
        <Route path='/resell/:id' element={<ProductDetail />} />
        <Route path='/resell/add' element={<AddProduct />} />
      </Routes>
    </>
  )
}

export default App
