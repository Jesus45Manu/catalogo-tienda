import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import CategoryProducts from './pages/CategoryProducts'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Account from './pages/Account'
import SearchResults from './pages/SearchResults'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'

function TiendaLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      {children}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      <Route path="/" element={<ProtectedRoute><TiendaLayout><Home /></TiendaLayout></ProtectedRoute>} />
      <Route path="/categoria/:id" element={<ProtectedRoute><TiendaLayout><CategoryProducts /></TiendaLayout></ProtectedRoute>} />
      <Route path="/producto/:id" element={<ProtectedRoute><TiendaLayout><ProductDetail /></TiendaLayout></ProtectedRoute>} />
      <Route path="/buscar" element={<ProtectedRoute><TiendaLayout><SearchResults /></TiendaLayout></ProtectedRoute>} />
      <Route path="/carrito" element={<ProtectedRoute><TiendaLayout><Cart /></TiendaLayout></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><TiendaLayout><Checkout /></TiendaLayout></ProtectedRoute>} />
      <Route path="/pedido-confirmado/:id" element={<ProtectedRoute><TiendaLayout><OrderConfirmation /></TiendaLayout></ProtectedRoute>} />
      <Route path="/cuenta" element={<ProtectedRoute><TiendaLayout><Account /></TiendaLayout></ProtectedRoute>} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="/admin/productos" replace />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/nuevo" element={<AdminProductForm />} />
        <Route path="productos/:id" element={<AdminProductForm />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="pedidos" element={<AdminOrders />} />
      </Route>
    </Routes>
  )
}

export default App