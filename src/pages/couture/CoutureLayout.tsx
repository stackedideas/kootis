import { Outlet } from "react-router-dom";
import CoutureHeader from "@/components/couture/CoutureHeader";
import CoutureFooter from "@/components/couture/CoutureFooter";

export default function CoutureLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <CoutureHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <CoutureFooter />
    </div>
  );
}
