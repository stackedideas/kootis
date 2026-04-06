import { Routes, Route, Navigate } from "react-router-dom";

// Landing
import LandingPage from "@/pages/landing/LandingPage";
import ComingSoon from "@/pages/landing/ComingSoon";

const COMING_SOON = import.meta.env.VITE_COMING_SOON === "true";

// Couture pages
import CoutureLayout from "@/pages/couture/CoutureLayout";
import CoutureHome from "@/pages/couture/CoutureHome";
import CoutureAbout from "@/pages/couture/CoutureAbout";
import CoutureBrands from "@/pages/couture/CoutureBrands";
import CoutureMedia from "@/pages/couture/CoutureMedia";
import CoutureContact from "@/pages/couture/CoutureContact";
import CoutureBookAppointment from "@/pages/couture/CoutureBookAppointment";

// Body Shop pages
import BodyShopLayout from "@/pages/bodyshop/BodyShopLayout";
import BodyShopHome from "@/pages/bodyshop/BodyShopHome";
import BodyShopNewArrivals from "@/pages/bodyshop/BodyShopNewArrivals";
import BodyShopShoes from "@/pages/bodyshop/BodyShopShoes";
import BodyShopHandbags from "@/pages/bodyshop/BodyShopHandbags";
import BodyShopWatches from "@/pages/bodyshop/BodyShopWatches";
import BodyShopAccessories from "@/pages/bodyshop/BodyShopAccessories";
import BodyShopSale from "@/pages/bodyshop/BodyShopSale";
import BodyShopProductDetail from "@/pages/bodyshop/BodyShopProductDetail";
import BodyShopCart from "@/pages/bodyshop/BodyShopCart";
import BodyShopCheckoutAddress from "@/pages/bodyshop/BodyShopCheckoutAddress";
import BodyShopCheckoutShipping from "@/pages/bodyshop/BodyShopCheckoutShipping";
import BodyShopCheckoutPayment from "@/pages/bodyshop/BodyShopCheckoutPayment";
import BodyShopOrderConfirmation from "@/pages/bodyshop/BodyShopOrderConfirmation";
import BodyShopContact from "@/pages/bodyshop/BodyShopContact";
import BodyShopSearch from "@/pages/bodyshop/BodyShopSearch";
import BodyShopWishlist from "@/pages/bodyshop/BodyShopWishlist";

// Account pages (Body Shop)
import AccountLayout from "@/pages/account/AccountLayout";
import AccountDashboard from "@/pages/account/AccountDashboard";
import AccountOrders from "@/pages/account/AccountOrders";
import AccountAddresses from "@/pages/account/AccountAddresses";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Booking admin
const adminSlug = import.meta.env.VITE_ADMIN_SLUG || "admin";

export default function App() {
  return (
    <Routes>
      {/* ── Landing ── */}
      <Route path="/" element={COMING_SOON ? <ComingSoon /> : <LandingPage />} />

      {/* ── Kootis Couture ── */}
      <Route path="/kootis-couture" element={<CoutureLayout />}>
        <Route index element={<CoutureHome />} />
        <Route path="about" element={<CoutureAbout />} />
        <Route path="brands" element={<CoutureBrands />} />
        <Route path="media" element={<CoutureMedia />} />
        <Route path="contact" element={<CoutureContact />} />
        <Route path="book" element={<CoutureBookAppointment />} />
      </Route>

      {/* ── The Body Shop by Kootis ── */}
      <Route path="/the-body-shop" element={<BodyShopLayout />}>
        <Route index element={<BodyShopHome />} />
        <Route path="new" element={<BodyShopNewArrivals />} />
        <Route path="shoes" element={<BodyShopShoes />} />
        <Route path="handbags" element={<BodyShopHandbags />} />
        <Route path="watches" element={<BodyShopWatches />} />
        <Route path="accessories" element={<BodyShopAccessories />} />
        <Route path="sale" element={<BodyShopSale />} />
        <Route path="products/:slug" element={<BodyShopProductDetail />} />
        <Route path="cart" element={<BodyShopCart />} />
        <Route path="contact" element={<BodyShopContact />} />
        <Route path="search" element={<BodyShopSearch />} />
        <Route path="wishlist" element={<BodyShopWishlist />} />
      </Route>

      {/* ── Account (shared auth) ── */}
      <Route path="/account" element={<AccountLayout />}>
        <Route index element={<AccountDashboard />} />
        <Route path="orders" element={<AccountOrders />} />
        <Route path="addresses" element={<AccountAddresses />} />
      </Route>

      {/* ── Body Shop checkout (own minimal header, outside layout) ── */}
      <Route path="/the-body-shop/checkout" element={<BodyShopCheckoutAddress />} />
      <Route path="/the-body-shop/checkout/shipping" element={<BodyShopCheckoutShipping />} />
      <Route path="/the-body-shop/checkout/payment" element={<BodyShopCheckoutPayment />} />
      <Route path="/the-body-shop/order-confirmation" element={<BodyShopOrderConfirmation />} />

      {/* ── Auth ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── Booking Admin (secret URL) ── */}
      <Route
        path={`/${adminSlug}`}
        element={<div>Admin Login — coming soon</div>}
      />
      <Route
        path={`/${adminSlug}/dashboard`}
        element={<div>Admin Dashboard — coming soon</div>}
      />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
