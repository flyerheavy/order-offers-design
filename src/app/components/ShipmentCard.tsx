import { useState } from 'react';
import { ChevronDown, Package, Truck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StatusBadge } from './StatusBadge';
import { FileUploadZone } from './FileUploadZone';
import { OrderProgressTracker } from './OrderProgressTracker';

interface ShipmentProduct {
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
}

interface Shipment {
  shipmentNumber: number;
  totalShipments: number;
  status: 'Offen' | 'Abgebrochen' | 'In Bearbeitung' | 'Versandt' | 'Geliefert';
  progressStep: number;
  products: ShipmentProduct[];
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
  };
  uploadStatus?: 'pending' | 'uploaded' | 'none';
  trackingNumber?: string;
  deliveryService?: string;
}

interface ShipmentCardProps {
  shipment: Shipment;
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState<{ [key: number]: boolean }>({});

  const getStatusColor = () => {
    switch (shipment.status) {
      case 'Geliefert':
        return 'bg-green-50 border-green-200';
      case 'Versandt':
        return 'bg-blue-50 border-blue-200';
      case 'In Bearbeitung':
        return 'bg-amber-50 border-amber-200';
      case 'Offen':
        return 'bg-cyan-50 border-cyan-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const toggleProductDetails = (index: number) => {
    setShowProductDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className={`rounded-lg border-2 ${getStatusColor()} overflow-hidden`}>
      {/* Shipment Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <Package className="w-5 h-5 text-gray-600" />
          <div className="text-left">
            <p className="font-medium text-gray-900">
              Lieferung {shipment.shipmentNumber} von {shipment.totalShipments}
            </p>
            <p className="text-sm text-gray-600">
              {shipment.deliveryAddress.city}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <StatusBadge status={shipment.status} />
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Shipment Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 bg-white">
              {/* Progress Tracker for this Shipment */}
              {shipment.status !== 'Abgebrochen' && (
                <div className="pt-2">
                  <OrderProgressTracker currentStep={shipment.progressStep} />
                </div>
              )}

              {/* Delivery Address */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Lieferadresse</p>
                  <p className="text-sm text-gray-600">{shipment.deliveryAddress.name}</p>
                  <p className="text-sm text-gray-600">{shipment.deliveryAddress.street}</p>
                  <p className="text-sm text-gray-600">{shipment.deliveryAddress.city}</p>
                </div>
              </div>

              {/* Products in this Shipment */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Artikel in dieser Lieferung</h4>
                {shipment.products.map((product, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg border border-gray-200">
                    <div className="p-3">
                      <div className="flex space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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
                              <h5 className="font-medium text-gray-900">{product.name}</h5>
                              <p className="text-xs text-gray-500">{product.deliveryDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{product.price}</p>
                              <p className="text-xs text-gray-500">{product.quantity} Stück</p>
                            </div>
                          </div>

                          {/* Quick Info */}
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-gray-500 block">Lieferung</span>
                              <span className="text-gray-900">{product.paper}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block">Auflage</span>
                              <span className="text-gray-900">{product.quantity}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block">Format</span>
                              <span className="text-gray-900">{product.format}</span>
                            </div>
                          </div>

                          {/* Details Toggle */}
                          <button
                            onClick={() => toggleProductDetails(index)}
                            className="flex items-center space-x-1 text-cyan-600 hover:text-cyan-700 transition-colors text-sm"
                          >
                            <span>Details</span>
                            <motion.div
                              animate={{ rotate: showProductDetails[index] ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>
                        </div>
                      </div>

                      {/* Expanded Product Details */}
                      <AnimatePresence>
                        {showProductDetails[index] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div>
                                <span className="text-gray-500 block text-xs mb-1">Format</span>
                                <span className="text-gray-900">{product.format}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block text-xs mb-1">Papierart</span>
                                <span className="text-gray-900">{product.paper}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block text-xs mb-1">Liefertermin</span>
                                <span className="text-gray-900">{product.deliveryDate}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block text-xs mb-1">Veredelung</span>
                                <span className="text-gray-900">Keine</span>
                              </div>
                              {product.variations?.map((variation, idx) => (
                                <div key={idx}>
                                  <span className="text-gray-500 block text-xs mb-1">{variation.label}</span>
                                  <span className="text-gray-900">{variation.value}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Zone (if needed for this shipment) */}
              {shipment.uploadStatus && shipment.uploadStatus !== 'uploaded' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Druckdaten für diese Lieferung hochladen</h4>
                  <FileUploadZone uploadStatus={shipment.uploadStatus} />
                </div>
              )}

              {/* Tracking Info */}
              {shipment.trackingNumber && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sendungsverfolgung</p>
                      <p className="text-sm text-gray-600">
                        {shipment.deliveryService || 'DHL'}: {shipment.trackingNumber}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm">
                    Verfolgen
                  </button>
                </div>
              )}

              {shipment.status === 'Offen' && (
                <div className="flex items-center justify-end space-x-2">
                  <button className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition-colors text-sm">
                    Diese Lieferung stornieren
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}