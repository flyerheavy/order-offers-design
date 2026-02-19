import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A4A5C] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Kontakt */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Tel: 0441-20936-30</li>
              <li>E-Mail: info@flyerheaven.de</li>
              <li>Mo - Do: 8:30 - 17:30</li>
              <li>Fr: 8:30 - 16:00</li>
            </ul>
          </div>

          {/* Informationen */}
          <div>
            <h3 className="font-semibold mb-4">Informationen</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Datenformate</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
            </ul>
          </div>

          {/* AGB */}
          <div>
            <h3 className="font-semibold mb-4">AGB</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h3 className="font-semibold mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Versandpartner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Climate Partner</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Certification */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex items-center justify-between">
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-gray-400">
            © 2026 Flyerheaven. Alle Rechte vorbehalten.
          </div>
        </div>
      </div>
    </footer>
  );
}
