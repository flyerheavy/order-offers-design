import { useState } from "react";
import {
  ChevronDown,
  Check,
  X,
  Calendar,
  Clock,
  GitBranch,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "./StatusBadge";

interface Offer {
  offerNumber: string;
  createdDate: string;
  validUntil: string;
  total: string;
  status: "Offen" | "Abgebrochen";
  products: Array<{
    name: string;
    deliveryNote: string;
    quantity: number;
    price: string;
    format: string;
    delivery: string;
    uploadStatus: string;
    thumbnail?: string;
  }>;
  pricing: {
    subtotal: string;
    discount: string;
    subtotalAfterDiscount: string;
    vat: string;
    total: string;
  };
  billingAddress?: {
    name: string;
    street: string;
    city: string;
  };
}

interface OfferCardProps {
  offer: Offer;
  onAccept: (offerNumber: string) => void;
  onDecline: (offerNumber: string) => void;
}

export function OfferCard({ offer, onAccept, onDecline }: OfferCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleProductDetails = (index: number) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isExpired = () => {
    const validDate = new Date(offer.validUntil.split(".").reverse().join("-"));
    return validDate < new Date();
  };

  const getDaysRemaining = () => {
    const validDate = new Date(offer.validUntil.split(".").reverse().join("-"));
    const today = new Date();
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-6 flex-1">
          <div className="text-left">
            <p className="text-sm text-gray-500">Angebotsnummer</p>
            <p className="font-semibold text-gray-900">#{offer.offerNumber}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">Angeboten am</p>
            <p className="text-gray-900">{offer.createdDate}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Gültig bis</span>
            </p>
            <div className="flex items-center space-x-2">
              <p
                className={`${isExpired() ? "text-red-600 font-medium" : "text-gray-900"}`}
              >
                {offer.validUntil}
              </p>
              {!isExpired() && daysRemaining <= 7 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  {daysRemaining} Tage
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <StatusBadge status={offer.status} />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Gesamtsumme</p>
            <p className="text-lg font-semibold text-gray-900">{offer.total}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
              {/* Validity Warning */}
              {!isExpired() &&
                daysRemaining <= 3 &&
                offer.status === "Offen" && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">
                        Angebot läuft bald ab
                      </p>
                      <p className="text-sm text-amber-700">
                        Dieses Angebot ist nur noch {daysRemaining} Tag
                        {daysRemaining !== 1 ? "e" : ""} gültig. Bitte treffen
                        Sie Ihre Entscheidung zeitnah.
                      </p>
                    </div>
                  </div>
                )}

              {isExpired() && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      Angebot abgelaufen
                    </p>
                    <p className="text-sm text-red-700">
                      Dieses Angebot ist am {offer.validUntil} abgelaufen. Bitte
                      kontaktieren Sie uns für ein neues Angebot.
                    </p>
                  </div>
                </div>
              )}

              {/* Product Details (Multiple Products) */}
              <div className="space-y-4 mt-6">
                <h3 className="font-semibold text-gray-900">
                  Positionen ({offer.products.length} Produkte)
                </h3>
                {offer.products.map((product, productIndex) => {
                  const showProductDetails =
                    expandedProducts[productIndex] || false;

                  return (
                    <div
                      key={productIndex}
                      className="bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="p-4">
                        <div className="flex space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {product.thumbnail && (
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {product.deliveryNote}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {product.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.quantity} Stück
                                </p>
                              </div>
                            </div>

                            {/* Details Toggle */}
                            <button
                              onClick={() => toggleProductDetails(productIndex)}
                              className="flex items-center space-x-1 text-cyan-600 hover:text-cyan-700 transition-colors text-sm"
                            >
                              <span>Details</span>
                              <motion.div
                                animate={{
                                  rotate: showProductDetails ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </button>
                          </div>
                        </div>

                        {/* Expanded Product Details */}
                        <AnimatePresence>
                          {showProductDetails && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ms-20 mt-4 pt-4 border-t border-gray-200 space-y-4">
                                {/* Product Specifications */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Auflage:
                                    </span>
                                    <span className="text-gray-900">
                                      {product.quantity} Stück
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Format:
                                    </span>
                                    <span className="text-gray-900">
                                      {product.format}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Lieferung:
                                    </span>
                                    <span className="text-gray-900">
                                      {product.delivery}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Druckdaten:
                                    </span>
                                    <span className="text-gray-900">
                                      {product.uploadStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Global Billing Address */}
              {offer.billingAddress && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Rechnungsadresse
                  </h4>
                  <p className="text-sm text-gray-600">
                    {offer.billingAddress.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {offer.billingAddress.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {offer.billingAddress.city}
                  </p>
                </div>
              )}

              {/* Bestellübersicht (Order Summary) */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Angebotsübersicht
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Zwischensumme (netto):
                    </span>
                    <span className="text-gray-900">
                      {offer.pricing.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MwSt. (19%):</span>
                    <span className="text-gray-900">{offer.pricing.vat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Versandkosten:</span>
                    <span className="text-gray-900">0.00 €</span>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Gesamtsumme (brutto):
                      </span>
                      <span className="font-semibold text-lg text-gray-900">
                        {offer.pricing.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {offer.status === "Offen" && !isExpired() && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowDeclineDialog(true)}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Angebot ablehnen</span>
                  </button>
                  <button
                    onClick={() => setShowAcceptDialog(true)}
                    className="px-6 py-2.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Angebot annehmen</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accept Confirmation Dialog */}
      {showAcceptDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Angebot annehmen?
            </h3>
            <p className="text-gray-600 mb-6">
              Möchten Sie das Angebot #{offer.offerNumber} über {offer.total}{" "}
              wirklich annehmen? Dies wird eine verbindliche Bestellung
              auslösen.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAcceptDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  onAccept(offer.offerNumber);
                  setShowAcceptDialog(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors font-medium"
              >
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Dialog */}
      {showDeclineDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Angebot ablehnen?
            </h3>
            <p className="text-gray-600 mb-6">
              Möchten Sie das Angebot #{offer.offerNumber} wirklich ablehnen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeclineDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  onDecline(offer.offerNumber);
                  setShowDeclineDialog(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                Ablehnen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
