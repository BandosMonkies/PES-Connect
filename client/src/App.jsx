import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProductList from './pages/resell/ProductList.jsx';
import ProductDetail from './pages/resell/ProductDetail.jsx';
import AddProduct from './pages/resell/AddProduct.jsx';
import PostList from './pages/discussion/PostList.jsx';
import PostDetail from './pages/discussion/PostDetail.jsx';
import CreatePost from './pages/discussion/CreatePost.jsx';
import ChatPage from './pages/chat/ChatPage.jsx';
import NotesList from './pages/notes/NotesList.jsx';
import NoteDetail from './pages/notes/NoteDetail.jsx';
import CreateNote from './pages/notes/CreateNote.jsx';
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
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/resell' element={<ProductList />} />
        <Route path='/resell/:id' element={<ProductDetail />} />
        <Route path='/resell/add' element={<AddProduct />} />
        <Route path='/discussion' element={<PostList />} />
        <Route path='/discussion/:id' element={<PostDetail />} />
        <Route path='/discussion/create' element={<CreatePost />} />
        <Route path='/notes' element={<NotesList />} />
        <Route path='/notes/create' element={<CreateNote />} />
        <Route path='/notes/:id' element={<NoteDetail />} />
        <Route path='/notes/shared/:token' element={<NoteDetail />} />
      </Routes>
    </>
  )
}

export default App
