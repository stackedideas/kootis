import { Outlet } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import BodyShopHeader from "@/components/bodyshop/BodyShopHeader";
import BodyShopFooter from "@/components/bodyshop/BodyShopFooter";
import { useLocation } from "react-router-dom";

const navKeyMap: Record<string, "new" | "shoes" | "handbags" | "watches" | "accessories" | "contact" | "sale" | null> = {
  "/the-body-shop/new": "new",
  "/the-body-shop/shoes": "shoes",
  "/the-body-shop/handbags": "handbags",
  "/the-body-shop/watches": "watches",
  "/the-body-shop/accessories": "accessories",
  "/the-body-shop/sale": "sale",
  "/the-body-shop/contact": "contact",
};

export default function BodyShopLayout() {
  const { pathname } = useLocation();
  const activeLink = navKeyMap[pathname] ?? null;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <BodyShopHeader activeLink={activeLink} />
      <main className="flex-1">
        <Outlet />
      </main>
      <BodyShopFooter />
    </div>
  );
}
