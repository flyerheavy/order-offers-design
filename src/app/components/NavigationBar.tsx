import { Search, Heart, ShoppingCart, User } from "lucide-react";

export function NavigationBar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://picsum.photos/200/300"
              alt="Flyerheaven"
              className="h-8"
            />
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Produkte
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Service
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Themenwochen
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Wissen
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Kontakt
            </a>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="text-sm">Mein Konto</span>
            </button>
            <button className="p-2 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
