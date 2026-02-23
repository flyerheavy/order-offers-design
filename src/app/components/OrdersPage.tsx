import { useState } from "react";
import { Search } from "lucide-react";
import { OrderCard } from "./OrderCard";
import { OrderCardWithShipments } from "./OrderCardWithShipments";
import { OrderCardDistribution } from "./OrderCardDistribution";

// Mock distribution-based orders (Concept B: Unified Production)
const mockDistributionOrders = [
  {
    orderNumber: "10825",
    date: "15.11.2025",
    total: "1,847.80 €",
    status: "Offen" as const,
    progressStep: 1,
    paymentMethod: "Rechnung",
    products: [
      {
        name: "Shopware Test DIN A4",
        totalQuantity: 35000,
        price: "420.50 €",
        netPrice: "420.50 €",
        grossPrice: "500.40 €",
        format: "DIN A4",
        paper: "Standard 5 Werktage",
        deliveryDate: "18. November 2025",
        distributionList: [
          {
            quantity: 10000,
            address: {
              name: "Max Mustermann",
              street: "Menden 5",
              city: "49124 Berlin",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "DHL1234567890",
            carrier: "DHL",
          },
          {
            quantity: 15,
            address: {
              name: "Filiale München",
              street: "Hauptstraße 1",
              city: "80331 München",
              country: "Deutschland",
            },
            status: "Wartet auf Abholung" as const,
          },
          {
            quantity: 10,
            address: {
              name: "Lager Hamburg",
              street: "Hafenstraße 42",
              city: "20457 Hamburg",
              country: "Deutschland",
            },
            status: "In Vorbereitung" as const,
          },
        ],
      },
      {
        name: "Visitenkarten Premium",
        totalQuantity: 500,
        price: "289.00 €",
        netPrice: "289.00 €",
        grossPrice: "343.91 €",
        format: "85 x 55 mm",
        paper: "Premium Matt 350g",
        deliveryDate: "18. November 2025",
        distributionList: [
          {
            quantity: 250,
            address: {
              name: "Hauptbüro Frankfurt",
              street: "Zeil 112",
              city: "60313 Frankfurt am Main",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "DHL9876543210",
            carrier: "DHL",
          },
          {
            quantity: 250,
            address: {
              name: "Filiale München",
              street: "Hauptstraße 1",
              city: "80331 München",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "DHL5555666677",
            carrier: "DHL",
          },
        ],
      },
      {
        name: "Poster DIN A1",
        totalQuantity: 100000,
        price: "567.90 €",
        netPrice: "567.90 €",
        grossPrice: "675.80 €",
        format: "DIN A1",
        paper: "Premium Glanz 170g",
        deliveryDate: "17. November 2025",
        distributionList: [
          {
            quantity: 60,
            address: {
              name: "Marketing Abteilung",
              street: "Berliner Straße 45",
              city: "10715 Berlin",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "DHL7777888899",
            carrier: "DHL",
          },
          {
            quantity: 25,
            address: {
              name: "Event-Center Köln",
              street: "Messegelände 1",
              city: "50679 Köln",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "DPD1112223334",
            carrier: "DPD",
          },
          {
            quantity: 15,
            address: {
              name: "Showroom Stuttgart",
              street: "Königstraße 78",
              city: "70173 Stuttgart",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "UPS4445556667",
            carrier: "UPS",
          },
        ],
      },
      {
        name: "Flyer DIN A6 beidseitig",
        totalQuantity: 10000,
        price: "570.40 €",
        netPrice: "570.40 €",
        grossPrice: "678.78 €",
        format: "DIN A6",
        paper: "Standard 135g",
        deliveryDate: "19. November 2025",
        distributionList: [
          {
            quantity: 2000,
            address: {
              name: "Vertriebszentrale",
              street: "Industriestraße 23",
              city: "45127 Essen",
              country: "Deutschland",
            },
            status: "Versandt" as const,
            trackingNumber: "GLS8889990001",
            carrier: "GLS",
          },
        ],
      },
    ],
    billingAddress: {
      name: "Max Mustermann",
      street: "Menden 5",
      city: "49124 Berlin",
    },
    pricing: {
      net: "1,552.77 €",
      vat: "295.03 €",
      shipping: "0.00 €",
      total: "1,847.80 €",
    },
    uploadStatus: "pending" as const,
    invoiceUrl: "https://example.com/invoice-10825.pdf",
  },
  {
    orderNumber: "10826",
    date: "16.11.2025",
    total: "500.00 €",
    status: "Offen" as const,
    progressStep: 1,
    paymentMethod: "PayPal",
    products: [
      {
        name: "Alle Storniert Test",
        totalQuantity: 1000,
        netPrice: "420.00 €",
        grossPrice: "500.00 €",
        format: "DIN A4",
        paper: "Standard",
        deliveryDate: "20.11.2025",
        distributionList: [
          {
            quantity: 1000,
            address: {
              name: "Test User",
              street: "Test Str 1",
              city: "Berlin",
            },
            status: "Storniert" as const,
          },
        ],
      },
    ],
    billingAddress: { name: "Test User", street: "Test Str 1", city: "Berlin" },
    pricing: {
      net: "420.00 €",
      vat: "80.00 €",
      shipping: "0.00 €",
      total: "500.00 €",
    },
    uploadStatus: "uploaded" as const,
  },
];

// Mock order data with shipments (Concept A: Independent Shipments)
const mockOrdersWithShipments = [
  {
    orderNumber: "10820",
    date: "13.11.2025",
    total: "267.96 €",
    globalStatus: "In Bearbeitung (2 Teillieferungen)",
    shipments: [
      {
        shipmentNumber: 1,
        totalShipments: 2,
        status: "Geliefert" as const,
        progressStep: 4,
        products: [
          {
            name: "Shopware Test DIN A4",
            quantity: 10,
            price: "21.00 €",
            netPrice: "21.00 €",
            grossPrice: "24.99 €",
            format: "DIN A4",
            paper: "Standard 5 Werktage",
            deliveryDate: "11. November 2025",
          },
        ],
        deliveryAddress: {
          name: "Max Mustermann",
          street: "Menden 5 & Edtermann",
          city: "49124 Berlin",
        },
        uploadStatus: "uploaded" as const,
        trackingNumber: "DHL1234567890",
        deliveryService: "DHL",
      },
      {
        shipmentNumber: 2,
        totalShipments: 2,
        status: "In Bearbeitung" as const,
        progressStep: 3,
        products: [
          {
            name: "Shopware Test DIN A4",
            quantity: 25,
            price: "246.96 €",
            netPrice: "246.96 €",
            grossPrice: "293.88 €",
            format: "DIN A4",
            paper: "Standard 5 Werktage",
            deliveryDate: "20. November 2025",
          },
        ],
        deliveryAddress: {
          name: "Erika Musterfrau",
          street: "Hauptstraße 123",
          city: "80331 München",
        },
        uploadStatus: "pending" as const,
      },
    ],
    billingAddress: {
      name: "Max Mustermann",
      street: "Menden 5 & Edtermann",
      city: "49124 Berlin",
    },
    pricing: {
      net: "224.76 €",
      vat: "42.70 €",
      shipping: "0.50 €",
      total: "267.96 €",
    },
    invoiceUrl: "https://example.com/invoice-10820.pdf",
  },
];

// Legacy mock order data (old structure)
const mockOrders = [
  {
    orderNumber: "10806",
    date: "12.11.2025",
    total: "267.96 €",
    status: "Abgebrochen" as const,
    progressStep: 1,
    products: [
      {
        name: "Flyer DIN A5",
        deliveryDate: "20. November 2025",
        quantity: 100,
        price: "249.99 €",
        netPrice: "249.99 €",
        grossPrice: "297.49 €",
        format: "85x55mm",
        paper: "Premium 3 Werktage",
      },
    ],
    deliveryAddress: {
      name: "Max Mustermann",
      street: "Walserstraße 7",
      city: "49321 Berlin",
    },
    billingAddress: {
      name: "Max Mustermann",
      street: "Walserstraße 7",
      city: "49321 Berlin",
    },
    pricing: {
      net: "225.18 €",
      vat: "42.78 €",
      shipping: "0.00 €",
      total: "267.96 €",
    },
    uploadStatus: "none" as const,
    invoiceUrl: "https://example.com/invoice-10806.pdf",
  },
];

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDistributionOrders = mockDistributionOrders.filter(
    (order) =>
      order.orderNumber.includes(searchQuery) ||
      order.date.includes(searchQuery) ||
      order.products.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const filteredOrdersWithShipments = mockOrdersWithShipments.filter(
    (order) =>
      order.orderNumber.includes(searchQuery) ||
      order.date.includes(searchQuery) ||
      order.shipments.some((s) =>
        s.products.some((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      ),
  );

  const filteredLegacyOrders = mockOrders.filter(
    (order) =>
      order.orderNumber.includes(searchQuery) ||
      order.date.includes(searchQuery) ||
      order.products.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <main className="flex-1">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Meine Bestellungen
          </h1>
        </div>

        {/* Search/Filter */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Suche nach Bestellnummer, Datum oder Produkt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {/* Distribution-Based Orders (Concept B) */}
        {filteredDistributionOrders.map((order) => (
          <OrderCardDistribution key={order.orderNumber} order={order} />
        ))}

        {/* Shipment-Based Orders (Concept A) */}
        {filteredOrdersWithShipments.map((order) => (
          <OrderCardWithShipments key={order.orderNumber} order={order} />
        ))}

        {/* Legacy Single-Shipment Orders */}
        {filteredLegacyOrders.map((order) => (
          <OrderCard key={order.orderNumber} order={order} />
        ))}

        {filteredDistributionOrders.length === 0 &&
          filteredOrdersWithShipments.length === 0 &&
          filteredLegacyOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">Keine Bestellungen gefunden.</p>
            </div>
          )}
      </div>
    </main>
  );
}
