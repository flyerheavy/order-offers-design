import { useState } from "react";
import {
  ChevronDown,
  RotateCw,
  AlertCircle,
  X,
  ChevronRight,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "./StatusBadge";
import { OrderProgressTracker } from "./OrderProgressTracker";
import { FileUploadZone } from "./FileUploadZone";

interface Order {
  orderNumber: string;
  date: string;
  total: string;
  status: "Offen" | "Abgebrochen" | "In Bearbeitung" | "Versandt" | "Geliefert";
  progressStep: number;
  products: Array<{
    name: string;
    deliveryDate: string;
    quantity: number;
    price: string;
    netPrice: string;
    grossPrice: string;
    format: string;
    paper: string;
    thumbnail?: string;
    // Additional product variations
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
  uploadStatus?: "pending" | "uploaded" | "none";
  invoiceUrl?: string;
}

interface OrderCardProps {
  order: Order;
}

function ProductCard({
  product,
  index,
}: {
  product: Order["products"][0];
  index: number;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Product Header - Always Visible */}
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
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {product.deliveryDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {product.netPrice}{" "}
                  <span className="text-[10px] font-normal text-gray-500 uppercase">
                    Netto
                  </span>
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {product.grossPrice}{" "}
                  <span className="text-[10px] font-normal text-gray-500 uppercase">
                    Brutto
                  </span>
                </p>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm mb-3">
              <div>
                <span className="text-gray-500 block text-xs">Lieferung</span>
                <span className="text-gray-900">{product.paper}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Auflage</span>
                <span className="text-gray-900">{product.quantity} Stück</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Format</span>
                <span className="text-gray-900">{product.format}</span>
              </div>
            </div>

            {/* Details Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-1 text-cyan-600 hover:text-cyan-700 transition-colors text-sm"
            >
              <span>Details</span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-x-4 gap-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs mb-1">
                    Format
                  </span>
                  <span className="text-gray-900">{product.format}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">
                    Papierart
                  </span>
                  <span className="text-gray-900">{product.paper}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">
                    Liefertermin
                  </span>
                  <span className="text-gray-900">{product.deliveryDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">
                    Veredelung
                  </span>
                  <span className="text-gray-900">Keine</span>
                </div>
                {product.variations?.map((variation, idx) => (
                  <div key={idx}>
                    <span className="text-gray-500 block text-xs mb-1">
                      {variation.label}
                    </span>
                    <span className="text-gray-900">{variation.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);

  const calculateOrderStatus = (): any => {
    if (order.status === "Abgebrochen") {
      return "Abgebrochen";
    }

    if (order.uploadStatus !== "uploaded") {
      return "Wartet auf Daten";
    }

    const allProductsFinished = order.products.every(
      (p) => order.status === "Versandt" || order.status === "Geliefert",
    );

    if (allProductsFinished && order.products.length > 0) {
      return order.status;
    }

    return "Eingegangen";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Collapsed Header */}
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
          <div className="flex-1 flex items-center space-x-4">
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
          </div>
          <div className="flex-1 flex items-center space-x-4">
            <StatusBadge status={calculateOrderStatus()} />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Gesamtsumme</p>
            <p className="text-lg font-semibold text-gray-900">{order.total}</p>
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
              {/* Progress Tracker */}
              {order.status !== "Abgebrochen" && (
                <OrderProgressTracker currentStep={order.progressStep} />
              )}

              {/* Product Cards */}
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <ProductCard key={index} product={product} index={index} />
                ))}
              </div>

              {/* File Upload Zone */}
              {order.uploadStatus && order.uploadStatus !== "uploaded" && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    Druckdaten hochladen
                  </h3>
                  <FileUploadZone uploadStatus={order.uploadStatus} />
                </div>
              )}

              {/* Delivery & Billing Addresses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Lieferadresse
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.city}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
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
              </div>

              {/* Delivery Section */}
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setShowDeliveryDetails(!showDeliveryDetails)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <span className="font-medium text-gray-900">
                    1. Lieferung
                  </span>
                  <motion.div
                    animate={{ rotate: showDeliveryDetails ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showDeliveryDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Delivery Address */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Versandadresse:
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.deliveryAddress.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.deliveryAddress.street}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.deliveryAddress.city}
                            </p>
                          </div>

                          {/* Pricing Summary */}
                          <div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Trackkosol
                                </span>
                                <span className="text-gray-900">
                                  {order.pricing.net}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Restervereforderunle:
                                </span>
                                <span className="text-gray-900">3,00 €</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rabatung</span>
                                <span className="text-gray-900">0,00 €</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>- 55 Sluck</span>
                                <span className="text-red-600">-2,55 €</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Shipping */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Versand
                            </h4>
                            <p className="text-sm text-gray-600">
                              DHL (3-5 Werktage)
                            </p>
                          </div>

                          {/* Total */}
                          <div>
                            <div className="flex justify-between font-medium">
                              <span className="text-gray-900">
                                Gesamtsumme (brutto)
                              </span>
                              <span className="text-gray-900">
                                {order.total}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Tracking */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              Tracking:
                            </h4>
                            <p className="text-sm text-gray-600">
                              Keine Sendinsonformaten
                            </p>
                          </div>

                          {/* Order Number */}
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">
                                Bestellnummer:
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-900">80„22T</span>
                                <span className="text-sm text-gray-500">
                                  Strigazahus
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bestellübersicht (Order Summary) Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Bestellübersicht
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Bestellgebührensammeln
                    </span>
                    <span className="text-gray-900">50,09</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Zabrungstatus</span>
                    <span className="text-gray-900">0,00 €</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Zeilerlannummer:</span>
                      <span className="text-gray-900">2,36 €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Kleinenschastzreummer
                      </span>
                      <span className="text-gray-900">2,34 €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Versand (inte. MwSlesl):
                      </span>
                      <span className="text-gray-900">0,00 €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bundarferdeskon</span>
                      <span className="text-gray-900">0,00 €</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center mb-3">
                      <button className="text-cyan-600 hover:text-cyan-700 text-sm">
                        Elestel35i lewereten
                      </button>
                      <span className="font-semibold text-lg text-gray-900">
                        2,94 €
                      </span>
                    </div>
                    <button className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm">
                      Nerr Diverdan missse Hochlassen
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reklamieren</span>
                </button>
                {order.status === "Offen" && (
                  <button className="px-6 py-2.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition-colors flex items-center space-x-2">
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
    </div>
  );
}
