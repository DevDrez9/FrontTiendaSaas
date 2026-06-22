import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Landing/LandingPage";
import LoginPage from "./Pages/Auth/LoginPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import ProductosDashboard from "./Pages/Dashboard/ProductosDashboard";
import PedidosDashboard from "./Pages/Dashboard/PedidosDashboard";
import ConfiguracionDashboard from "./Pages/Dashboard/ConfiguracionDashboard";
import CategoriasDashboard from "./Pages/Dashboard/CategoriasDashboard";
import DashboardHome from "./Pages/Dashboard/DashboardHome";
import AdminPanel from "./Pages/Dashboard/AdminPanel";
import StoreRouter from "./Pages/Storefront/StoreRouter";
import DetalleProducto from "./Pages/Storefront/DetalleProducto";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="productos" element={<ProductosDashboard />} />
          <Route path="categorias" element={<CategoriasDashboard />} />
          <Route path="pedidos" element={<PedidosDashboard />} />
          <Route path="configuracion" element={<ConfiguracionDashboard />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>

        {/* Dynamic Store Routes */}
        <Route path="/:storeDomain" element={<StoreRouter />} />
        
        {/* Product Details Route */}
        <Route path="/producto/:id" element={<DetalleProducto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
