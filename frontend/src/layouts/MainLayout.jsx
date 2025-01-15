import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/toaster";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DevelopmentBanner from "@/components/DevelopmentBanner";

export default function MainLayout() {
  return (
    <>
      {/* <DevelopmentBanner /> */}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
