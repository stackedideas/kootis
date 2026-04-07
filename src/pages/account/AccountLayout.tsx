import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import BodyShopHeader from "@/components/bodyshop/BodyShopHeader";
import BodyShopFooter from "@/components/bodyshop/BodyShopFooter";
import { useAuth } from "@/context/AuthContext";

export default function AccountLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [session, loading, navigate, location.pathname]);

  // Show nothing while checking auth — prevents flash of content
  if (loading || !session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <BodyShopHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <BodyShopFooter />
    </div>
  );
}
