import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer, Toaster } from "./components/Chrome";

export default function App() {
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="min-h-[100svh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <ScrollRestoration getKey={(location) => location.pathname} />
    </>
  );
}
