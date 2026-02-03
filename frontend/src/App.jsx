import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout ve Global Bileşenler
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AgentLayout from "./components/AgentLayout";
import AdminLayout from "./pages/admin/AdminLayout";

// Ana Site Sayfaları
import HomePage from "./pages/HomePage";
import IlanlarPage from "./pages/IlanlarPage";
import IlanDetay from "./pages/IlanDetay";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim"; // Yeni eklediğimiz iletişim sayfası
import Login from "./pages/Login";
import Register from "./pages/Register";

// Kullanıcı (Müşteri) Sayfaları
import TenantPayments from "./pages/TenantPayments";
import OwnerPage from "./pages/OwnerPage";

// Agent (Danışman) Paneli Sayfaları
import AgentDashboardHome from "./pages/agent/AgentDashboardHome";
import AgentPortfolio from "./pages/agent/AgentPortfolio";
import AgentOwners from "./pages/agent/AgentOwners";
import AgentRentals from "./pages/agent/AgentRentals";
import AgentRentTracker from "./pages/agent/AgentRentTracker";
import AddPropertyForm from "./pages/agent/AddPropertyForm";
import EditPropertyForm from "./pages/agent/EditPropertyForm";
import AgentContacts from "./pages/agent/AgentContacts";

// Admin Paneli Sayfaları
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminPaymentManagement from "./pages/admin/AdminPayments";
import CategoryManagement from "./pages/admin/CategoryManagement";
import UserManagement from "./pages/admin/UserManagement";
import PropertyManagement from "./pages/admin/PropertyManagement";

import "./index.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/agent"
          element={
            <ProtectedRoute allowedRoles={["Agent"]}>
              <AgentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboardHome />} />
          <Route path="portfolio" element={<AgentPortfolio />} />
          <Route path="owners" element={<AgentOwners />} />
          <Route path="rentals" element={<AgentRentals />} />
          <Route path="rent-tracker" element={<AgentRentTracker />} />
          <Route path="add-property" element={<AddPropertyForm />} />
          <Route path="edit-property/:id" element={<EditPropertyForm />} />
          <Route path="contacts" element={<AgentContacts />} />
        </Route>

      
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="payments" element={<AdminPaymentManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
        </Route>

       
        <Route
          path="/*"
          element={
            <>
              <Header onMenuClick={handleOpenSidebar} />
              <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
              <main style={{ minHeight: '85vh' }}>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="ilanlar" element={<IlanlarPage />} />
                  <Route path="ilan/:id" element={<IlanDetay />} />
                  <Route path="hakkimizda" element={<Hakkimizda />} />
                  <Route path="iletisim" element={<Iletisim />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  
                  
                  <Route
                    path="odemelerim"
                    element={
                      <ProtectedRoute allowedRoles={["Tenant"]}>
                        <TenantPayments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="mulklerim"
                    element={
                      <ProtectedRoute allowedRoles={["Owner"]}>
                        <OwnerPage />
                      </ProtectedRoute>
                    }
                  />
                  
                
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;