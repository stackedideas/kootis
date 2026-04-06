import { Outlet } from "react-router-dom";
import TopBar from "@/components/shared/TopBar";
import BodyShopHeader from "@/components/bodyshop/BodyShopHeader";
import BodyShopFooter from "@/components/bodyshop/BodyShopFooter";
// TODO: replace with Supabase session check — temporarily open for development

export default function AccountLayout() {
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
