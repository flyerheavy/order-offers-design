import { useState } from "react";
import { Toaster } from "sonner";
import { NavigationBar } from "./components/NavigationBar";
import { SidebarNav } from "./components/SidebarNav";
import { OrdersPage } from "./components/OrdersPage";
import { OffersPage } from "./components/OffersPage";
import { Footer } from "./components/Footer";

type PageType = "orders" | "offers" | "profile" | "addresses";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("orders");

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <NavigationBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="flex gap-8">
          {/* Sidebar */}
          <SidebarNav activePage={currentPage} onNavigate={setCurrentPage} />

          {/* Main Content */}
          {currentPage === "orders" && <OrdersPage />}
          {currentPage === "offers" && <OffersPage />}
          {currentPage === "profile" && (
            <main className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Profil
              </h1>
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <p className="text-gray-600">
                  Profil-Seite wird bald verfügbar sein.
                </p>
              </div>
            </main>
          )}
          {currentPage === "addresses" && (
            <main className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                Adressen
              </h1>
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <p className="text-gray-600">
                  Adressen-Seite wird bald verfügbar sein.
                </p>
              </div>
            </main>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
