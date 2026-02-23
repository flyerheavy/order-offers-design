import { MapPin, Package, Truck, Clock } from "lucide-react";

export interface DistributionDestination {
  quantity: number;
  address: {
    name: string;
    street: string;
    city: string;
    country?: string;
  };
  status:
    | "Versandt"
    | "Wartet auf Abholung"
    | "Zugestellt"
    | "In Vorbereitung"
    | "Storniert"
    | "Geliefert";
  trackingNumber?: string;
  carrier?: string;
}

interface DistributionRowProps {
  destination: DistributionDestination;
}

export function DistributionRow({ destination }: DistributionRowProps) {
  const getStatusIcon = () => {
    switch (destination.status) {
      case "Zugestellt":
      case "Geliefert":
        return <Package className="w-4 h-4 text-green-600" />;
      case "Versandt":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "In Vorbereitung":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "Storniert":
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (destination.status) {
      case "Zugestellt":
      case "Geliefert":
        return "bg-green-50 text-green-700 border-green-200";
      case "Versandt":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Vorbereitung":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Storniert":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      {/* Quantity Badge */}
      <div className="flex-shrink-0 min-w-[4rem] text-center">
        <div className="inline-flex items-center justify-center h-12 px-3 rounded-lg bg-cyan-100 text-cyan-700 font-semibold">
          {destination.quantity.toLocaleString("de-DE")}x
        </div>
      </div>

      {/* Address */}
      <div className="flex-1 px-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {destination.address.name}
            </p>
            <p className="text-sm text-gray-600">
              {destination.address.street}
            </p>
            <p className="text-sm text-gray-600">{destination.address.city}</p>
            {destination.address.country && (
              <p className="text-sm text-gray-600">
                {destination.address.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status & Tracking */}
      <div className="flex-shrink-0 w-64 text-right">
        <div
          className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium">{destination.status}</span>
        </div>
        {destination.trackingNumber && (
          <div className="mt-2">
            <button className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors">
              {destination.carrier || "DHL"}: {destination.trackingNumber}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
