import { useState } from "react";
import {
  ChevronDown,
  RotateCw,
  AlertCircle,
  X,
  GitBranch,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StatusBadge } from "./StatusBadge";
import { OrderProgressTracker } from "./OrderProgressTracker";
import { FileUploadZone } from "./FileUploadZone";
import {
  DistributionRow,
  type DistributionDestination,
} from "./DistributionRow";

interface Product {
  name: string;
  totalQuantity: number;
  netPrice: string;
  grossPrice: string;
  format: string;
  paper: string;
  deliveryDate: string;
  thumbnail?: string;
  variations?: Array<{
    label: string;
    value: string;
  }>;
  distributionList: DistributionDestination[];
}

interface OrderDistribution {
  orderNumber: string;
  date: string;
  total: string;
  status: "Offen" | "Abgebrochen" | "In Bearbeitung" | "Versandt" | "Geliefert";
  progressStep: number;
  paymentMethod: string;
  paymentStatus: "Bezahlt" | "Offen" | "In Prüfung";
  products: Product[];
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

interface OrderCardDistributionProps {
  order: OrderDistribution;
}

export function OrderCardDistribution({ order }: OrderCardDistributionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleProductDetails = (index: number) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculateOrderStatus = (): any => {
    const allItems = order.products.flatMap((p) => p.distributionList);
    const allCancelled = allItems.every((item) => item.status === "Storniert");

    if (allCancelled && allItems.length > 0) {
      return "Abgebrochen";
    }

    if (order.uploadStatus !== "uploaded") {
      return "Wartet auf Daten";
    }

    const allFinishedOrCancelled = allItems.every(
      (item) =>
        (item.status as string) === "Versandt" ||
        (item.status as string) === "Geliefert" ||
        (item.status as string) === "Storniert",
    );

    if (allFinishedOrCancelled && allItems.length > 0) {
      return "Versandt";
    }

    return "Eingegangen";
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

          <div className="flex-1 flex items-start space-x-4">
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
            <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
              {/* Product Details (Multiple Products) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Produktdetails ({order.products.length} Produkte)
                </h3>
                {order.products.map((product, productIndex) => {
                  const totalDestinations = product.distributionList.length;
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
                            <div className="flex items-start justify-between mb-2 gap-5">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  Auftrag {product.deliveryDate}
                                </p>
                                {/* Distribution Indicator */}
                                <div className="flex items-center space-x-2 text-sm text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 w-fit">
                                  <GitBranch className="w-4 h-4" />
                                  <span>
                                    Verteilt auf {totalDestinations}{" "}
                                    Lieferadresse
                                    {totalDestinations > 1 ? "n" : ""}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right grow">
                                <p className="text-sm font-semibold text-gray-500 leading-tight">
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
                                <p className="text-sm text-gray-500">
                                  {product.totalQuantity} Stück (Gesamt)
                                </p>
                                {/* Global Progress Tracker */}
                                {order.status !== "Abgebrochen" && (
                                  <div className="pt-2">
                                    <OrderProgressTracker
                                      currentStep={order.progressStep}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quick Info */}
                            {/* <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-500">Format:</span>
                                <span className="ml-2 text-gray-900">
                                  {product.format}
                                </span>
                              </div>
                            </div> */}

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
                                <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-sm">
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Auflage:
                                    </span>
                                    <span className="text-gray-900">
                                      {product.totalQuantity} Stück
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Format
                                    </span>
                                    <span className="text-gray-900">
                                      {product.format}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Papierart
                                    </span>
                                    <span className="text-gray-900">
                                      {product.paper}
                                    </span>
                                  </div>
                                  {/* <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Liefertermin
                                    </span>
                                    <span className="text-gray-900">
                                      {product.deliveryDate}
                                    </span>
                                  </div> */}
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Veredelung
                                    </span>
                                    <span className="text-gray-900">Keine</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Zahlungsart
                                    </span>
                                    <span className="text-gray-900">
                                      {order.paymentMethod}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block text-xs mb-1">
                                      Zahlungsstatus
                                    </span>
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        order.paymentStatus === "Bezahlt"
                                          ? "bg-green-100 text-green-700"
                                          : order.paymentStatus === "In Prüfung"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {order.paymentStatus}
                                    </span>
                                  </div>
                                  {product.variations?.map((variation, idx) => (
                                    <div key={idx}>
                                      <span className="text-gray-500 block text-xs mb-1">
                                        {variation.label}
                                      </span>
                                      <span className="text-gray-900">
                                        {variation.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Upload Zone for this Product */}
                                {order.uploadStatus &&
                                  order.uploadStatus !== "uploaded" && (
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-semibold text-gray-900">
                                        Druckdaten hochladen
                                      </h4>
                                      <p className="text-xs text-gray-600">
                                        Upload für {product.name}
                                      </p>
                                      <FileUploadZone
                                        uploadStatus={order.uploadStatus}
                                      />
                                    </div>
                                  )}

                                {/* Distribution List for this Product */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Versandaufteilung ({totalDestinations}{" "}
                                    Adresse{totalDestinations > 1 ? "n" : ""})
                                  </h4>
                                  <div className="space-y-2">
                                    {product.distributionList.map(
                                      (destination, destIndex) => (
                                        <DistributionRow
                                          key={destIndex}
                                          destination={destination}
                                        />
                                      ),
                                    )}
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

                  {order.paymentMethod && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Zahlungsmethode:</span>
                        <span className="text-gray-900 font-medium">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  )}
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
