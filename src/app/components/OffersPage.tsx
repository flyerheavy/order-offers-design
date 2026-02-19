import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { OfferCard } from './OfferCard';
import { toast } from 'sonner';

// Mock offer data
const mockOffers = [
  {
    offerNumber: '1089',
    createdDate: '13.11.2025',
    validUntil: '13.11.2025',
    total: '2.50 €',
    status: 'Offen' as const,
    products: [
      {
        name: 'Shopware Test DIN A4',
        deliveryNote: 'Auftrag 13. November 2025',
        quantity: 35,
        price: '2.10 €',
        format: 'DIN A4',
        delivery: 'Standard 5 Werktage',
        uploadStatus: 'Upload ausstehend',
      },
    ],
    pricing: {
      subtotal: '2.10 €',
      discount: '0.00 €',
      subtotalAfterDiscount: '2.10 €',
      vat: '0.40 €',
      total: '2.50 €',
    },
    billingAddress: {
      name: 'Max Mustermann',
      street: 'Menden 5',
      city: '49124 Berlin',
    },
  },
  {
    offerNumber: '1088',
    createdDate: '13.11.2025',
    validUntil: '20.11.2025',
    total: '2.50 €',
    status: 'Offen' as const,
    products: [
      {
        name: 'Flyer DIN A5',
        deliveryNote: 'Auftrag 20. November 2025',
        quantity: 1000,
        price: '2.10 €',
        format: 'DIN A5',
        delivery: 'Premium 3 Werktage',
        uploadStatus: 'Upload ausstehend',
      },
    ],
    pricing: {
      subtotal: '2.10 €',
      discount: '0.00 €',
      subtotalAfterDiscount: '2.10 €',
      vat: '0.40 €',
      total: '2.50 €',
    },
    billingAddress: {
      name: 'Max Mustermann',
      street: 'Menden 5',
      city: '49124 Berlin',
    },
  },
  {
    offerNumber: '1075',
    createdDate: '01.11.2025',
    validUntil: '08.11.2025',
    total: '450.00 €',
    status: 'Abgebrochen' as const,
    products: [
      {
        name: 'Broschüren A4',
        deliveryNote: 'Auftrag 05. November 2025',
        quantity: 500,
        price: '450.00 €',
        format: 'DIN A4, 16 Seiten',
        delivery: 'Express 2 Werktage',
        uploadStatus: 'Hochgeladen',
      },
    ],
    pricing: {
      subtotal: '378.15 €',
      discount: '0.00 €',
      subtotalAfterDiscount: '378.15 €',
      vat: '71.85 €',
      total: '450.00 €',
    },
    billingAddress: {
      name: 'Max Mustermann',
      street: 'Menden 5',
      city: '49124 Berlin',
    },
  },
];

export function OffersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState(mockOffers);

  const filteredOffers = offers.filter(
    (offer) =>
      offer.offerNumber.includes(searchQuery) ||
      offer.createdDate.includes(searchQuery) ||
      offer.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAcceptOffer = (offerNumber: string) => {
    toast.success(`Angebot #${offerNumber} wurde angenommen und in Bestellung umgewandelt.`);
    // In real app, this would make an API call
    setOffers(offers.map(o => 
      o.offerNumber === offerNumber 
        ? { ...o, status: 'Abgebrochen' as const } 
        : o
    ));
  };

  const handleDeclineOffer = (offerNumber: string) => {
    toast.error(`Angebot #${offerNumber} wurde abgelehnt.`);
    // In real app, this would make an API call
    setOffers(offers.map(o => 
      o.offerNumber === offerNumber 
        ? { ...o, status: 'Abgebrochen' as const } 
        : o
    ));
  };

  const activeOffers = filteredOffers.filter(o => o.status === 'Offen');
  const inactiveOffers = filteredOffers.filter(o => o.status === 'Abgebrochen');

  return (
    <main className="flex-1">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Angebote</h1>
            <p className="text-gray-600 mt-1">
              Verwalten Sie Ihre Angebote und wandeln Sie diese in Bestellungen um
            </p>
          </div>
          {activeOffers.length > 0 && (
            <div className="px-4 py-2 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-sm text-cyan-700">
                <span className="font-semibold">{activeOffers.length}</span> offene Angebot{activeOffers.length !== 1 ? 'e' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Search/Filter */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Suche nach Angebotsnummer, Datum oder Produkt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Active Offers */}
      {activeOffers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Offene Angebote</h2>
          <div className="space-y-4">
            {activeOffers.map((offer) => (
              <OfferCard
                key={offer.offerNumber}
                offer={offer}
                onAccept={handleAcceptOffer}
                onDecline={handleDeclineOffer}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Offers */}
      {inactiveOffers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Abgeschlossene Angebote</h2>
          <div className="space-y-4">
            {inactiveOffers.map((offer) => (
              <OfferCard
                key={offer.offerNumber}
                offer={offer}
                onAccept={handleAcceptOffer}
                onDecline={handleDeclineOffer}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Keine Angebote gefunden.</p>
          <p className="text-sm text-gray-400 mt-1">
            Ihre Angebote werden hier angezeigt, sobald sie erstellt wurden.
          </p>
        </div>
      )}
    </main>
  );
}