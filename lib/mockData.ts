// Mock data for demo - structured to match Prisma schema
// This allows the app to run without database setup

export const mockAccount = {
  id: "acc-123-demo",
  companyName: "Premier Construction Co.",
  planType: "pro",
  status: "active",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date(),
  qbRealmId: null,
  qbAccessToken: null,
  qbRefreshToken: null,
  qbTokenExpiry: null,
  emailProvider: null,
  emailAccessToken: null,
  emailRefreshToken: null,
  emailTokenExpiry: null,
};

export const mockUsers = [
  {
    id: "user-1",
    accountId: mockAccount.id,
    email: "john@premierconst.com",
    passwordHash: "$2a$10$X1234567890abcdefghijklmnopqrstuvwxyzABCDE", // Demo hash
    firstName: "John",
    lastName: "Martinez",
    role: "owner",
    phoneNumber: "+1-661-555-0101",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "user-2",
    accountId: mockAccount.id,
    email: "sarah@premierconst.com",
    passwordHash: "$2a$10$X1234567890abcdefghijklmnopqrstuvwxyzABCDE",
    firstName: "Sarah",
    lastName: "Chen",
    role: "pm",
    phoneNumber: "+1-661-555-0102",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
  {
    id: "user-3",
    accountId: mockAccount.id,
    email: "mike@premierconst.com",
    passwordHash: "$2a$10$X1234567890abcdefghijklmnopqrstuvwxyzABCDE",
    firstName: "Mike",
    lastName: "Thompson",
    role: "super",
    phoneNumber: "+1-661-555-0103",
    isActive: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date(),
  },
];

export const mockProjects = [
  {
    id: "proj-1",
    accountId: mockAccount.id,
    name: "Bakersfield Medical Center Renovation",
    address: "2800 Chester Avenue",
    city: "Bakersfield",
    state: "CA",
    zipCode: "93301",
    status: "active",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-12-31"),
    estimatedBudget: 2850000.00,
    actualCost: 1245678.50,
    qbJobId: null,
    qbClassName: null,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date(),
  },
  {
    id: "proj-2",
    accountId: mockAccount.id,
    name: "Downtown Office Complex - Phase 2",
    address: "1801 19th Street",
    city: "Bakersfield",
    state: "CA",
    zipCode: "93301",
    status: "active",
    startDate: new Date("2024-05-15"),
    endDate: new Date("2025-03-31"),
    estimatedBudget: 4200000.00,
    actualCost: 876543.25,
    qbJobId: null,
    qbClassName: null,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date(),
  },
  {
    id: "proj-3",
    accountId: mockAccount.id,
    name: "Oildale Community Center",
    address: "300 Roberts Lane",
    city: "Oildale",
    state: "CA",
    zipCode: "93308",
    status: "on_hold",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-08-31"),
    estimatedBudget: 1650000.00,
    actualCost: 1234567.89,
    qbJobId: null,
    qbClassName: null,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },
  {
    id: "proj-4",
    accountId: mockAccount.id,
    name: "Rosedale Highway Retail Strip",
    address: "8500 Rosedale Highway",
    city: "Bakersfield",
    state: "CA",
    zipCode: "93312",
    status: "completed",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-04-30"),
    estimatedBudget: 1850000.00,
    actualCost: 1789432.10,
    qbJobId: null,
    qbClassName: null,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date(),
  },
];

export const mockContacts = [
  {
    id: "contact-1",
    accountId: mockAccount.id,
    type: "vendor",
    companyName: "Valley Lumber & Supply",
    firstName: "Robert",
    lastName: "Anderson",
    email: "robert@valleylumber.com",
    phoneNumber: "+1-661-555-0201",
    role: "Sales Manager",
    notes: "Preferred lumber supplier, 2% discount on bulk orders",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },
  {
    id: "contact-2",
    accountId: mockAccount.id,
    type: "sub",
    companyName: "ProElectric Solutions",
    firstName: "Lisa",
    lastName: "Rodriguez",
    email: "lisa@proelectric.com",
    phoneNumber: "+1-661-555-0202",
    role: "Owner",
    notes: "Licensed electrician, reliable for commercial projects",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date(),
  },
  {
    id: "contact-3",
    accountId: mockAccount.id,
    type: "architect",
    companyName: "Kern Design Group",
    firstName: "David",
    lastName: "Kim",
    email: "david@kerndesign.com",
    phoneNumber: "+1-661-555-0203",
    role: "Principal Architect",
    notes: "Lead architect on Medical Center project",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
  },
  {
    id: "contact-4",
    accountId: mockAccount.id,
    type: "vendor",
    companyName: "Bakersfield Concrete & Masonry",
    firstName: "James",
    lastName: "Wilson",
    email: "james@bfconcrete.com",
    phoneNumber: "+1-661-555-0204",
    role: "Operations Manager",
    notes: "Concrete supplier and installation services",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date(),
  },
];

export const mockRFIs = [
  {
    id: "rfi-1",
    accountId: mockAccount.id,
    projectId: "proj-1",
    rfiNumber: "RFI-001",
    subject: "Clarification on HVAC System Specifications",
    question: "The drawings show a 10-ton unit for the second floor, but the mechanical schedule lists a 12-ton unit. Which specification is correct? Also, what is the required SEER rating?",
    response: "Use the 12-ton unit as listed in the mechanical schedule. The drawing will be revised. SEER rating minimum is 16.",
    status: "responded",
    priority: "high",
    fromContactId: "contact-3",
    toContactId: "contact-2",
    dueDate: new Date("2024-11-20"),
    sentDate: new Date("2024-11-10"),
    responseDate: new Date("2024-11-15"),
    createdById: "user-2",
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-15"),
    aiGenerated: false,
    aiConfidence: null,
    sourceEmailId: null,
  },
  {
    id: "rfi-2",
    accountId: mockAccount.id,
    projectId: "proj-1",
    rfiNumber: "RFI-002",
    subject: "Electrical Panel Location Conflict",
    question: "The electrical panel location conflicts with the plumbing chase. Can we relocate the panel 4 feet to the west?",
    response: null,
    status: "sent",
    priority: "urgent",
    fromContactId: null,
    toContactId: "contact-3",
    dueDate: new Date("2024-12-08"),
    sentDate: new Date("2024-12-03"),
    responseDate: null,
    createdById: "user-3",
    createdAt: new Date("2024-12-02"),
    updatedAt: new Date("2024-12-03"),
    aiGenerated: false,
    aiConfidence: null,
    sourceEmailId: null,
  },
  {
    id: "rfi-3",
    accountId: mockAccount.id,
    projectId: "proj-2",
    rfiNumber: "RFI-003",
    subject: "Fire Sprinkler Head Type for Office Areas",
    question: "Plans do not specify sprinkler head type for open office areas. Should we use concealed or pendant heads?",
    response: null,
    status: "draft",
    priority: "normal",
    fromContactId: null,
    toContactId: null,
    dueDate: null,
    sentDate: null,
    responseDate: null,
    createdById: "user-2",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
    aiGenerated: true,
    aiConfidence: 0.89,
    sourceEmailId: "email-123",
  },
];

export const mockChangeOrders = [
  {
    id: "co-1",
    accountId: mockAccount.id,
    projectId: "proj-1",
    coNumber: "CO-001",
    title: "Additional Medical Gas Outlets - Patient Rooms",
    description: "Owner requests 2 additional oxygen outlets and 1 vacuum outlet per patient room (8 rooms total). Includes installation, testing, and certification.",
    reason: "Owner change request based on updated medical equipment requirements.",
    status: "approved",
    priceImpact: 24500.00,
    scheduleImpact: 5,
    contactId: null,
    submittedDate: new Date("2024-10-15"),
    approvedDate: new Date("2024-10-22"),
    rejectedDate: null,
    rejectionReason: null,
    createdById: "user-2",
    createdAt: new Date("2024-10-14"),
    updatedAt: new Date("2024-10-22"),
    aiGenerated: false,
    aiConfidence: null,
    sourceEmailId: null,
  },
  {
    id: "co-2",
    accountId: mockAccount.id,
    projectId: "proj-1",
    coNumber: "CO-002",
    title: "Upgrade Flooring in Main Lobby",
    description: "Change from standard LVT to porcelain tile in main lobby area (approx 1,200 SF). Includes demolition, floor prep, and installation.",
    reason: "Owner upgrade request for higher-end finish.",
    status: "pending",
    priceImpact: 18750.00,
    scheduleImpact: 3,
    contactId: null,
    submittedDate: new Date("2024-11-28"),
    approvedDate: null,
    rejectedDate: null,
    rejectionReason: null,
    createdById: "user-2",
    createdAt: new Date("2024-11-25"),
    updatedAt: new Date("2024-11-28"),
    aiGenerated: false,
    aiConfidence: null,
    sourceEmailId: null,
  },
  {
    id: "co-3",
    accountId: mockAccount.id,
    projectId: "proj-2",
    coNumber: "CO-003",
    title: "Structural Steel Reinforcement - Roof",
    description: "Additional steel beam required due to unforeseen existing structural conditions. Includes engineering, materials, and installation.",
    reason: "Unforeseen existing condition discovered during demolition.",
    status: "approved",
    priceImpact: 45200.00,
    scheduleImpact: 10,
    contactId: null,
    submittedDate: new Date("2024-09-10"),
    approvedDate: new Date("2024-09-12"),
    rejectedDate: null,
    rejectionReason: null,
    createdById: "user-2",
    createdAt: new Date("2024-09-09"),
    updatedAt: new Date("2024-09-12"),
    aiGenerated: false,
    aiConfidence: null,
    sourceEmailId: null,
  },
];

export const mockInvoices = [
  {
    id: "inv-1",
    accountId: mockAccount.id,
    projectId: "proj-1",
    vendorId: "contact-1",
    invoiceNumber: "VLS-2024-8821",
    invoiceDate: new Date("2024-11-15"),
    dueDate: new Date("2024-12-15"),
    subtotal: 12450.00,
    tax: 1057.88,
    total: 13507.88,
    status: "approved",
    category: "materials",
    costCode: "03-3000",
    qbTxnId: null,
    qbSyncedAt: null,
    isMultiJob: false,
    allocations: null,
    notes: "Lumber delivery for framing - Building A",
    createdAt: new Date("2024-11-16"),
    updatedAt: new Date("2024-11-18"),
    aiExtracted: true,
    aiConfidence: 0.95,
    rawExtraction: null,
  },
  {
    id: "inv-2",
    accountId: mockAccount.id,
    projectId: "proj-1",
    vendorId: "contact-2",
    invoiceNumber: "PRO-ELEC-4512",
    invoiceDate: new Date("2024-11-20"),
    dueDate: new Date("2024-12-20"),
    subtotal: 8975.00,
    tax: 762.88,
    total: 9737.88,
    status: "pending",
    category: "labor",
    costCode: "16-1000",
    qbTxnId: null,
    qbSyncedAt: null,
    isMultiJob: false,
    allocations: null,
    notes: "Electrical rough-in - 2nd floor",
    createdAt: new Date("2024-11-21"),
    updatedAt: new Date("2024-11-21"),
    aiExtracted: true,
    aiConfidence: 0.92,
    rawExtraction: null,
  },
  {
    id: "inv-3",
    accountId: mockAccount.id,
    projectId: "proj-2",
    vendorId: "contact-4",
    invoiceNumber: "BFC-2024-1205",
    invoiceDate: new Date("2024-11-28"),
    dueDate: new Date("2024-12-28"),
    subtotal: 24800.00,
    tax: 2108.00,
    total: 26908.00,
    status: "approved",
    category: "materials",
    costCode: "03-3000",
    qbTxnId: null,
    qbSyncedAt: null,
    isMultiJob: false,
    allocations: null,
    notes: "Concrete for foundation - Phase 2",
    createdAt: new Date("2024-11-29"),
    updatedAt: new Date("2024-12-01"),
    aiExtracted: true,
    aiConfidence: 0.97,
    rawExtraction: null,
  },
];

export const mockDailyReports = [
  {
    id: "dr-1",
    accountId: mockAccount.id,
    projectId: "proj-1",
    reportDate: new Date("2024-12-02"),
    weatherAM: "Clear",
    weatherPM: "Partly Cloudy",
    temperature: "58°F - 72°F",
    workPerformed: "Continued electrical rough-in on 2nd floor. Completed framing inspection in Building A. Started HVAC ductwork installation in west wing.",
    laborSummary: [
      { trade: "Electricians", workers: 4, hours: 32 },
      { trade: "Framers", workers: 6, hours: 48 },
      { trade: "HVAC Techs", workers: 3, hours: 24 },
    ],
    equipmentUsed: "Scissor lift (2), Forklift, Compressor",
    deliveries: "Electrical conduit and boxes from ProElectric. HVAC ductwork delivery at 10am.",
    delays: "None",
    safetyIssues: "None reported. Daily safety briefing completed at 7am.",
    photos: [],
    createdById: "user-3",
    createdAt: new Date("2024-12-02T16:30:00"),
    updatedAt: new Date("2024-12-02T16:30:00"),
    voiceRecorded: true,
    transcriptId: "transcript-001",
  },
  {
    id: "dr-2",
    accountId: mockAccount.id,
    projectId: "proj-2",
    reportDate: new Date("2024-12-01"),
    weatherAM: "Overcast",
    weatherPM: "Light Rain",
    temperature: "52°F - 65°F",
    workPerformed: "Foundation formwork in progress for south section. Rebar placement completed in north section. Concrete pour scheduled for tomorrow pending weather.",
    laborSummary: [
      { trade: "Concrete Crew", workers: 8, hours: 64 },
      { trade: "Laborers", workers: 4, hours: 32 },
    ],
    equipmentUsed: "Concrete pump truck (scheduled), Excavator, Rebar bender",
    deliveries: "Rebar delivery completed at 8am. Ready-mix concrete scheduled for 6am tomorrow.",
    delays: "Weather delay possible for concrete pour - monitoring forecast.",
    safetyIssues: "Wet conditions - extra caution signs posted. All workers briefed on slip hazards.",
    photos: [],
    createdById: "user-3",
    createdAt: new Date("2024-12-01T15:45:00"),
    updatedAt: new Date("2024-12-01T15:45:00"),
    voiceRecorded: true,
    transcriptId: "transcript-002",
  },
];

// Helper functions to query mock data
export const getMockData = {
  getAccount: () => mockAccount,

  getUser: (email: string) => mockUsers.find(u => u.email === email),

  getUsers: () => mockUsers,

  getProjects: (accountId: string) =>
    mockProjects.filter(p => p.accountId === accountId),

  getProject: (id: string) =>
    mockProjects.find(p => p.id === id),

  getProjectStats: (accountId: string) => {
    const projects = mockProjects.filter(p => p.accountId === accountId);
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on_hold').length,
      totalBudget: projects.reduce((sum, p) => sum + (Number(p.estimatedBudget) || 0), 0),
      totalSpent: projects.reduce((sum, p) => sum + (Number(p.actualCost) || 0), 0),
    };
  },

  getRFIs: (accountId: string, projectId?: string) => {
    let rfis = mockRFIs.filter(r => r.accountId === accountId);
    if (projectId) {
      rfis = rfis.filter(r => r.projectId === projectId);
    }
    return rfis;
  },

  getChangeOrders: (accountId: string, projectId?: string) => {
    let cos = mockChangeOrders.filter(c => c.accountId === accountId);
    if (projectId) {
      cos = cos.filter(c => c.projectId === projectId);
    }
    return cos;
  },

  getInvoices: (accountId: string, projectId?: string) => {
    let invoices = mockInvoices.filter(i => i.accountId === accountId);
    if (projectId) {
      invoices = invoices.filter(i => i.projectId === projectId);
    }
    return invoices;
  },

  getDailyReports: (accountId: string, projectId?: string) => {
    let reports = mockDailyReports.filter(d => d.accountId === accountId);
    if (projectId) {
      reports = reports.filter(d => d.projectId === projectId);
    }
    return reports;
  },

  getRecentActivity: (accountId: string, limit: number = 10) => {
    const activities: any[] = [];

    // Add recent invoices
    mockInvoices
      .filter(i => i.accountId === accountId)
      .forEach(inv => {
        activities.push({
          id: inv.id,
          type: 'invoice',
          title: `Invoice ${inv.invoiceNumber}`,
          description: `$${inv.total.toFixed(2)} - ${inv.status}`,
          date: inv.createdAt,
          projectId: inv.projectId,
        });
      });

    // Add recent RFIs
    mockRFIs
      .filter(r => r.accountId === accountId)
      .forEach(rfi => {
        activities.push({
          id: rfi.id,
          type: 'rfi',
          title: rfi.rfiNumber,
          description: rfi.subject,
          date: rfi.createdAt,
          projectId: rfi.projectId,
        });
      });

    // Add recent Change Orders
    mockChangeOrders
      .filter(c => c.accountId === accountId)
      .forEach(co => {
        activities.push({
          id: co.id,
          type: 'changeorder',
          title: co.coNumber,
          description: co.title,
          date: co.createdAt,
          projectId: co.projectId,
        });
      });

    // Sort by date and limit
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  },
};
