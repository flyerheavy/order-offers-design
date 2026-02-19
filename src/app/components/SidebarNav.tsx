import { User, MapPin, Package, LogOut, FileText } from 'lucide-react';

interface SidebarNavProps {
  activePage?: 'orders' | 'offers' | 'profile' | 'addresses';
  onNavigate?: (page: 'orders' | 'offers' | 'profile' | 'addresses') => void;
}

export function SidebarNav({ activePage = 'orders', onNavigate }: SidebarNavProps) {
  return (
    <aside className="w-64 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
      {/* User Greeting */}
      <div className="mb-8">
        <h2 className="text-xl mb-1">Hallo Max Mustermann</h2>
        <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700">Mein Profil</a>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2 mb-8">
        <button
          onClick={() => onNavigate?.('profile')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activePage === 'profile'
              ? 'bg-cyan-50 text-cyan-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profil</span>
        </button>
        <button
          onClick={() => onNavigate?.('addresses')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activePage === 'addresses'
              ? 'bg-cyan-50 text-cyan-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Adressen</span>
        </button>
        <button
          onClick={() => onNavigate?.('orders')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activePage === 'orders'
              ? 'bg-cyan-50 text-cyan-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Bestellungen</span>
        </button>
        <button
          onClick={() => onNavigate?.('offers')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activePage === 'offers'
              ? 'bg-cyan-50 text-cyan-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Angebote</span>
        </button>
      </nav>

      {/* Logout Button */}
      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
}