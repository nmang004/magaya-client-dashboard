const crypto = require('crypto');

// Helper function to generate random date between two dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random number between min and max
const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate realistic company names
const generateCompanyName = () => {
  const prefixes = ['Global', 'International', 'Pacific', 'Atlantic', 'Express', 'Premier', 'Elite', 'Swift', 'Reliable'];
  const suffixes = ['Logistics', 'Shipping', 'Freight', 'Cargo', 'Transport', 'Forwarding', 'Solutions', 'Services'];
  const endings = ['Inc.', 'Co.', 'LLC', 'Corp.', 'Ltd.'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${endings[Math.floor(Math.random() * endings.length)]}`;
};

// Comprehensive location data
const locations = {
  ports: [
    { name: 'Port of Shanghai', code: 'CNSHA', country: 'China', lat: 31.2304, lng: 121.4737 },
    { name: 'Port of Singapore', code: 'SGSIN', country: 'Singapore', lat: 1.2644, lng: 103.8236 },
    { name: 'Port of Rotterdam', code: 'NLRTM', country: 'Netherlands', lat: 51.9225, lng: 4.47917 },
    { name: 'Port of Los Angeles', code: 'USLAX', country: 'USA', lat: 33.7406, lng: -118.2726 },
    { name: 'Port of Hamburg', code: 'DEHAM', country: 'Germany', lat: 53.5511, lng: 9.9937 },
    { name: 'Port of Dubai', code: 'AEDXB', country: 'UAE', lat: 25.0657, lng: 55.1356 },
    { name: 'Port of Hong Kong', code: 'HKHKG', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
    { name: 'Port of Antwerp', code: 'BEANR', country: 'Belgium', lat: 51.2194, lng: 4.4025 },
    { name: 'Port of Tokyo', code: 'JPTYO', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Port of New York', code: 'USNYC', country: 'USA', lat: 40.7128, lng: -74.0060 }
  ],
  warehouses: [
    'North Distribution Center',
    'South Logistics Hub',
    'East Coast Warehouse',
    'West Coast Facility',
    'Central Processing Center',
    'Regional Storage Depot'
  ]
};

// Shipment data configuration
const shipmentConfig = {
  statuses: [
    { status: 'Pending', color: '#FFA726', icon: 'schedule' },
    { status: 'Processing', color: '#42A5F5', icon: 'autorenew' },
    { status: 'In Transit', color: '#66BB6A', icon: 'local_shipping' },
    { status: 'Customs Hold', color: '#EF5350', icon: 'gavel' },
    { status: 'Out for Delivery', color: '#AB47BC', icon: 'delivery_dining' },
    { status: 'Delivered', color: '#26A69A', icon: 'check_circle' },
    { status: 'Delayed', color: '#FF7043', icon: 'warning' },
    { status: 'Returned', color: '#EC407A', icon: 'undo' }
  ],
  carriers: [
    { name: 'Maersk Line', logo: 'maersk.png', rating: 4.5 },
    { name: 'MSC', logo: 'msc.png', rating: 4.3 },
    { name: 'CMA CGM', logo: 'cma-cgm.png', rating: 4.4 },
    { name: 'Hapag-Lloyd', logo: 'hapag-lloyd.png', rating: 4.6 },
    { name: 'ONE', logo: 'one.png', rating: 4.2 },
    { name: 'Evergreen', logo: 'evergreen.png', rating: 4.1 },
    { name: 'COSCO', logo: 'cosco.png', rating: 4.0 }
  ],
  containerTypes: ['20ft Standard', '40ft Standard', '40ft High Cube', '20ft Refrigerated', '40ft Refrigerated'],
  cargoTypes: ['General Cargo', 'Electronics', 'Textiles', 'Machinery', 'Food Products', 'Raw Materials', 'Chemicals', 'Automotive Parts'],
  incoterms: ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']
};

// Generate realistic tracking events
const generateTrackingEvents = (status, createdDate) => {
  const events = [];
  const now = new Date();
  
  // Base events that all shipments have
  events.push({
    id: crypto.randomBytes(8).toString('hex'),
    status: 'Booking Confirmed',
    timestamp: createdDate,
    location: 'Online Portal',
    description: 'Shipment booking has been confirmed',
    icon: 'confirmation_number',
    completed: true
  });

  // Add events based on current status
  const statusFlow = [
    { status: 'Processing', location: 'Origin Warehouse', description: 'Package received at origin facility', icon: 'inventory' },
    { status: 'Container Loaded', location: 'Origin Port', description: 'Cargo loaded into container', icon: 'inventory_2' },
    { status: 'Vessel Departed', location: 'Origin Port', description: 'Vessel has departed from port', icon: 'directions_boat' },
    { status: 'In Transit', location: 'International Waters', description: 'Shipment in transit on vessel', icon: 'sailing' },
    { status: 'Vessel Arrived', location: 'Destination Port', description: 'Vessel arrived at destination port', icon: 'anchor' },
    { status: 'Customs Clearance', location: 'Customs', description: 'Undergoing customs inspection', icon: 'fact_check' },
    { status: 'Out for Delivery', location: 'Local Distribution', description: 'Package out for final delivery', icon: 'local_shipping' },
    { status: 'Delivered', location: 'Final Destination', description: 'Package successfully delivered', icon: 'done_all' }
  ];

  // Determine how many events to add based on current status
  let eventsToAdd = 0;
  switch (status) {
    case 'Processing': eventsToAdd = 1; break;
    case 'In Transit': eventsToAdd = 4; break;
    case 'Customs Hold': eventsToAdd = 5; break;
    case 'Out for Delivery': eventsToAdd = 6; break;
    case 'Delivered': eventsToAdd = 7; break;
    default: eventsToAdd = 0;
  }

  // Add events with realistic timestamps
  for (let i = 0; i < eventsToAdd && i < statusFlow.length; i++) {
    const daysSinceCreated = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    const eventDate = new Date(createdDate);
    eventDate.setDate(eventDate.getDate() + Math.floor((daysSinceCreated / eventsToAdd) * (i + 1)));
    
    events.push({
      id: crypto.randomBytes(8).toString('hex'),
      ...statusFlow[i],
      timestamp: eventDate,
      completed: true
    });
  }

  // Add current status as pending if not delivered
  if (status !== 'Delivered') {
    const currentStatusInfo = shipmentConfig.statuses.find(s => s.status === status);
    events.push({
      id: crypto.randomBytes(8).toString('hex'),
      status: status,
      timestamp: new Date(),
      location: 'Current Location',
      description: `Shipment is currently: ${status}`,
      icon: currentStatusInfo?.icon || 'info',
      completed: false
    });
  }

  return events;
};

// Generate documents for shipment
const generateDocuments = (shipmentId) => {
  const documentTypes = [
    { type: 'Bill of Lading', icon: 'description', required: true },
    { type: 'Commercial Invoice', icon: 'receipt', required: true },
    { type: 'Packing List', icon: 'list_alt', required: true },
    { type: 'Certificate of Origin', icon: 'verified', required: false },
    { type: 'Insurance Certificate', icon: 'security', required: false },
    { type: 'Customs Declaration', icon: 'assignment', required: true }
  ];

  return documentTypes
    .filter(doc => doc.required || Math.random() > 0.5)
    .map(doc => ({
      id: crypto.randomBytes(8).toString('hex'),
      name: doc.type,
      type: doc.type.toLowerCase().replace(/\s+/g, '-'),
      icon: doc.icon,
      uploadDate: randomDate(new Date(2024, 0, 1), new Date()),
      size: `${randomBetween(100, 2000)} KB`,
      status: Math.random() > 0.1 ? 'approved' : 'pending',
      url: `#${doc.type.toLowerCase().replace(/\s+/g, '-')}-${shipmentId}`
    }));
};

// Main shipment generator
const generateShipment = (index, clientId = null) => {
  const createdDate = randomDate(new Date(2024, 0, 1), new Date());
  const origin = locations.ports[Math.floor(Math.random() * locations.ports.length)];
  const destination = locations.ports[Math.floor(Math.random() * locations.ports.length)];
  const carrier = shipmentConfig.carriers[Math.floor(Math.random() * shipmentConfig.carriers.length)];
  const statusInfo = shipmentConfig.statuses[Math.floor(Math.random() * shipmentConfig.statuses.length)];
  
  // Calculate estimated delivery based on distance and status
  const transitDays = randomBetween(7, 30);
  const estimatedDelivery = new Date(createdDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + transitDays);
  
  const actualDelivery = statusInfo.status === 'Delivered' 
    ? randomDate(estimatedDelivery, new Date())
    : null;

  const shipmentId = `SHP-${new Date().getFullYear()}-${String(index + 10000).padStart(6, '0')}`;
  
  return {
    id: shipmentId,
    trackingNumber: `MAG${Date.now()}${index}`,
    referenceNumber: `REF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    status: statusInfo.status,
    statusColor: statusInfo.color,
    statusIcon: statusInfo.icon,
    
    // Origin and destination details
    origin: {
      port: origin.name,
      code: origin.code,
      country: origin.country,
      coordinates: { lat: origin.lat, lng: origin.lng },
      warehouse: locations.warehouses[Math.floor(Math.random() * locations.warehouses.length)]
    },
    destination: {
      port: destination.name,
      code: destination.code,
      country: destination.country,
      coordinates: { lat: destination.lat, lng: destination.lng },
      warehouse: locations.warehouses[Math.floor(Math.random() * locations.warehouses.length)]
    },
    
    // Carrier information
    carrier: {
      name: carrier.name,
      logo: carrier.logo,
      rating: carrier.rating,
      vesselName: `MV ${generateCompanyName().split(' ')[0]} ${randomBetween(1000, 9999)}`,
      voyageNumber: `V${randomBetween(100, 999)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    },
    
    // Dates
    createdAt: createdDate,
    estimatedDelivery: estimatedDelivery,
    actualDelivery: actualDelivery,
    lastUpdated: randomDate(createdDate, new Date()),
    
    // Container and cargo details
    container: {
      number: `${['MAGU', 'MSKU', 'TGHU'][Math.floor(Math.random() * 3)]}${randomBetween(1000000, 9999999)}`,
      type: shipmentConfig.containerTypes[Math.floor(Math.random() * shipmentConfig.containerTypes.length)],
      sealNumber: `SEAL${randomBetween(100000, 999999)}`
    },
    
    // Cargo information
    cargo: {
      type: shipmentConfig.cargoTypes[Math.floor(Math.random() * shipmentConfig.cargoTypes.length)],
      description: `${randomBetween(10, 100)} pallets of assorted goods`,
      weight: randomBetween(1000, 25000),
      weightUnit: 'kg',
      volume: randomBetween(10, 100),
      volumeUnit: 'm³',
      value: randomBetween(10000, 500000),
      currency: 'USD',
      insurance: Math.random() > 0.3,
      hazardous: Math.random() > 0.9
    },
    
    // Business details
    incoterm: shipmentConfig.incoterms[Math.floor(Math.random() * shipmentConfig.incoterms.length)],
    paymentStatus: Math.random() > 0.2 ? 'paid' : 'pending',
    
    // Tracking and documents
    events: generateTrackingEvents(statusInfo.status, createdDate),
    documents: generateDocuments(shipmentId),
    
    // Client information
    clientId: clientId || `CLIENT${String(randomBetween(1, 10)).padStart(3, '0')}`,
    consignee: generateCompanyName(),
    shipper: generateCompanyName(),
    
    // Additional metadata
    priority: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'normal',
    tags: ['tracked', 'insured', statusInfo.status.toLowerCase().replace(/\s+/g, '-')],
    notes: Math.random() > 0.7 ? 'Special handling required for fragile items' : null
  };
};

// Generate multiple shipments
const generateShipments = (count = 20, clientId = null) => {
  return Array.from({ length: count }, (_, i) => generateShipment(i, clientId));
};

// Generate transaction/invoice data
const generateTransaction = (shipmentId, index) => {
  const types = ['Invoice', 'Credit Note', 'Debit Note', 'Payment Receipt'];
  const status = ['paid', 'pending', 'overdue', 'cancelled'];
  const services = [
    { name: 'Ocean Freight', amount: randomBetween(2000, 10000) },
    { name: 'Port Charges', amount: randomBetween(200, 1000) },
    { name: 'Documentation Fee', amount: randomBetween(50, 200) },
    { name: 'Customs Clearance', amount: randomBetween(300, 1500) },
    { name: 'Inland Transportation', amount: randomBetween(500, 2000) }
  ];
  
  const selectedServices = services.filter(() => Math.random() > 0.3);
  const subtotal = selectedServices.reduce((sum, service) => sum + service.amount, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  return {
    id: `TRX-${new Date().getFullYear()}-${String(index + 1000).padStart(6, '0')}`,
    type: types[Math.floor(Math.random() * types.length)],
    status: status[Math.floor(Math.random() * status.length)],
    shipmentId: shipmentId,
    invoiceNumber: `INV-${randomBetween(100000, 999999)}`,
    
    // Financial details
    lineItems: selectedServices,
    subtotal: subtotal,
    tax: tax,
    total: total,
    currency: 'USD',
    
    // Dates
    issueDate: randomDate(new Date(2024, 0, 1), new Date()),
    dueDate: randomDate(new Date(), new Date(2024, 11, 31)),
    paidDate: status === 'paid' ? randomDate(new Date(2024, 0, 1), new Date()) : null,
    
    // Payment information
    paymentMethod: ['Bank Transfer', 'Credit Card', 'Wire Transfer', 'Check'][Math.floor(Math.random() * 4)],
    paymentReference: status === 'paid' ? `PAY-${crypto.randomBytes(8).toString('hex').toUpperCase()}` : null,
    
    // Additional details
    notes: Math.random() > 0.7 ? 'Payment terms: Net 30 days' : null,
    attachments: randomBetween(1, 3)
  };
};

// Generate analytics data
const generateAnalytics = (clientId) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate monthly shipment data
  const monthlyData = months.slice(0, currentMonth + 1).map((month, index) => ({
    month: month,
    shipments: randomBetween(50, 200),
    delivered: randomBetween(40, 180),
    revenue: randomBetween(50000, 200000),
    onTimeDelivery: randomBetween(85, 98) / 100
  }));
  
  // Generate route performance data
  const routePerformance = locations.ports.slice(0, 5).map(port => ({
    route: `Shanghai - ${port.name}`,
    shipments: randomBetween(20, 100),
    avgTransitTime: randomBetween(7, 30),
    onTimeRate: randomBetween(80, 95) / 100,
    revenue: randomBetween(100000, 500000)
  }));
  
  // Generate carrier performance
  const carrierPerformance = shipmentConfig.carriers.map(carrier => ({
    carrier: carrier.name,
    shipments: randomBetween(10, 50),
    onTimeRate: randomBetween(85, 98) / 100,
    avgRating: carrier.rating,
    incidents: randomBetween(0, 5)
  }));
  
  return {
    overview: {
      totalShipments: randomBetween(500, 2000),
      activeShipments: randomBetween(50, 200),
      deliveredThisMonth: randomBetween(100, 400),
      pendingShipments: randomBetween(20, 100),
      
      // Performance metrics
      onTimeDeliveryRate: randomBetween(88, 96) / 100,
      averageTransitTime: randomBetween(10, 20),
      customerSatisfaction: randomBetween(4.2, 4.8),
      
      // Financial metrics
      totalRevenue: randomBetween(1000000, 5000000),
      outstandingPayments: randomBetween(50000, 200000),
      averageShipmentValue: randomBetween(5000, 15000)
    },
    
    monthlyData: monthlyData,
    routePerformance: routePerformance,
    carrierPerformance: carrierPerformance,
    
    // Additional analytics
    shipmentsByStatus: shipmentConfig.statuses.map(status => ({
      status: status.status,
      count: randomBetween(10, 100),
      percentage: randomBetween(5, 30)
    })),
    
    topDestinations: locations.ports.slice(0, 5).map(port => ({
      destination: port.name,
      shipments: randomBetween(20, 100),
      revenue: randomBetween(50000, 300000)
    })),
    
    recentActivity: Array.from({ length: 10 }, (_, i) => ({
      id: crypto.randomBytes(8).toString('hex'),
      type: ['shipment_created', 'payment_received', 'delivery_completed', 'document_uploaded'][Math.floor(Math.random() * 4)],
      description: `Activity description ${i + 1}`,
      timestamp: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
    }))
  };
};

module.exports = {
  generateShipment,
  generateShipments,
  generateTransaction,
  generateAnalytics,
  generateCompanyName,
  locations,
  shipmentConfig
};