import { useState } from "react";
import { ChevronDown, RotateCw, AlertCircle, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ShipmentCard } from "./ShipmentCard";

interface Shipment {
  shipmentNumber: number;
  totalShipments: number;
  status: "Offen" | "Abgebrochen" | "In Bearbeitung" | "Versandt" | "Geliefert";
  progressStep: number;
  products: Array<{
    name: string;
    quantity: number;
    price: string;
    format: string;
    paper: string;
    deliveryDate: string;
    thumbnail?: string;
    variations?: Array<{
      label: string;
      value: string;
    }>;
  }>;
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
  };
  uploadStatus?: "pending" | "uploaded" | "none";
  trackingNumber?: string;
  deliveryService?: string;
}

interface Order {
  orderNumber: string;
  date: string;
  total: string;
  globalStatus: string;
  paymentMethod: string;
  paymentStatus: "Bezahlt" | "Offen" | "In Prüfung";
  shipments: Shipment[];
  billingAddress: {
    name: string;
    street: string;
    city: string;
  };
  pricing: {
    net: string;
    vat: string;
    shipping: string;
    total: string;
  };
  invoiceUrl?: string;
}

interface OrderCardWithShipmentsProps {
  order: Order;
}

export function OrderCardWithShipments({ order }: OrderCardWithShipmentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<"order" | "shipment">(
    "order",
  );

  const hasAnyActiveShipment = order.shipments.some(
    (s) => s.status === "Offen" || s.status === "In Bearbeitung",
  );

  const hasAnyDeliveredShipment = order.shipments.some(
    (s) => s.status === "Geliefert",
  );

  const handleCancelClick = () => {
    if (hasAnyDeliveredShipment && hasAnyActiveShipment) {
      // Some delivered, some active - need to choose
      setShowCancelModal(true);
    } else if (hasAnyActiveShipment) {
      // All active - cancel entire order
      setCancelTarget("order");
      setShowCancelModal(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Global Order Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-6 flex-1">
          <div className="text-left">
            <p className="text-sm text-gray-500">Bestellnummer</p>
            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">Bestelldatum</p>
            <p className="text-gray-900">{order.date}</p>
          </div>
          {order.invoiceUrl && (
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1.5 text-sm text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>Rechnung</span>
            </a>
          )}
          <div className="flex-1 flex items-center space-x-4">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium inline-block bg-blue-100 text-blue-800">
              {order.globalStatus}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Gesamtsumme</p>
            <p className="text-lg font-semibold text-gray-900">
              {order.pricing.net}{" "}
              <span className="text-[10px] font-normal text-gray-500 uppercase">
                Netto
              </span>
            </p>
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
            <div className="px-6 pb-6 space-y-6 border-t border-gray-100 pt-6">
              {/* Shipment Cards */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Lieferungen</h3>
                {order.shipments.map((shipment, index) => (
                  <ShipmentCard
                    key={index}
                    shipment={shipment}
                    paymentMethod={order.paymentMethod}
                    paymentStatus={order.paymentStatus}
                  />
                ))}
              </div>

              {/* Global Billing Address */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Rechnungsadresse
                </h4>
                <p className="text-sm text-gray-600">
                  {order.billingAddress.name}
                </p>
                <p className="text-sm text-gray-600">
                  {order.billingAddress.street}
                </p>
                <p className="text-sm text-gray-600">
                  {order.billingAddress.city}
                </p>
              </div>

              {/* Bestellübersicht (Order Summary) */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Bestellübersicht
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Zwischensumme (netto):
                    </span>
                    <span className="text-gray-900">{order.pricing.net}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MwSt. (19%):</span>
                    <span className="text-gray-900">{order.pricing.vat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Versandkosten:</span>
                    <span className="text-gray-900">
                      {order.pricing.shipping}
                    </span>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Gesamtsumme (brutto):
                      </span>
                      <span className="font-semibold text-lg text-gray-900">
                        {order.pricing.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reklamieren</span>
                </button>
                {hasAnyActiveShipment && (
                  <button
                    onClick={handleCancelClick}
                    className="px-6 py-2.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Stornieren</span>
                  </button>
                )}
                <button className="px-6 py-2.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors flex items-center space-x-2">
                  <RotateCw className="w-4 h-4" />
                  <span>Nachbestellen</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Stornierung wählen
            </h3>
            <p className="text-gray-600 mb-6">
              Einige Lieferungen wurden bereits versandt. Was möchten Sie
              stornieren?
            </p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setCancelTarget("order")}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  cancelTarget === "order"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-gray-900">
                  Gesamte Bestellung stornieren
                </p>
                <p className="text-sm text-gray-500">
                  Alle noch offenen Lieferungen werden storniert
                </p>
              </button>
              <button
                onClick={() => setCancelTarget("shipment")}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  cancelTarget === "shipment"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-gray-900">
                  Einzelne Lieferung stornieren
                </p>
                <p className="text-sm text-gray-500">
                  Wählen Sie eine spezifische Lieferung zum Stornieren
                </p>
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  // Handle cancellation logic here
                  setShowCancelModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                Stornieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
