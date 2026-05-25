import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import fs from 'fs'

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db')
const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '20251201075516_init', 'migration-sqlite.sql')

console.log('🔄 Initializing database...')

// Create DB file if it doesn't exist
const dbExists = fs.existsSync(dbPath)
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Run migrations if the DB is new or empty
const tableCount = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get() as any
if (!dbExists || tableCount['count(*)'] === 0) {
  console.log('📦 Running schema migration...')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
  const statements = migrationSQL.split(';').filter(s => s.trim())
  for (const stmt of statements) {
    if (stmt.trim()) db.exec(stmt)
  }
  console.log('✅ Schema created')
} else {
  console.log('📦 Schema already exists')
}

// Seed data
const existingAccounts = db.prepare('SELECT count(*) as count FROM accounts').get() as any
if (existingAccounts.count > 0) {
  console.log('⚠️  Database already has data — skipping seed')
  db.close()
  process.exit(0)
}

console.log('🌱 Seeding data...')

const accountId = randomUUID()
const userId = randomUUID()

// Hash password
const passwordHash = bcrypt.hashSync('coaijay1989', 10)
const now = new Date().toISOString()

// Insert account
db.prepare(`
  INSERT INTO accounts (id, companyName, planType, status, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(accountId, 'SiteForge Demo Co.', 'pro', 'active', now, now)

// Insert master user
db.prepare(`
  INSERT INTO users (id, accountId, email, passwordHash, firstName, lastName, role, phoneNumber, isActive, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(userId, accountId, 'blunts954@gmail.com', passwordHash, 'Jason', 'Manuel', 'owner', '+1-555-0100', 1, now, now)

// Insert demo projects
const projects = [
  { id: randomUUID(), name: 'Bakersfield Medical Center Renovation', address: '2800 Chester Avenue', city: 'Bakersfield', state: 'CA', zipCode: '93301', status: 'active', estimatedBudget: 2850000.00, actualCost: 1245678.50 },
  { id: randomUUID(), name: 'Downtown Office Complex - Phase 2', address: '1801 19th Street', city: 'Bakersfield', state: 'CA', zipCode: '93301', status: 'active', estimatedBudget: 4200000.00, actualCost: 876543.25 },
  { id: randomUUID(), name: 'Oildale Community Center', address: '300 Roberts Lane', city: 'Oildale', state: 'CA', zipCode: '93308', status: 'on_hold', estimatedBudget: 1650000.00, actualCost: 1234567.89 },
  { id: randomUUID(), name: 'Rosedale Highway Retail Strip', address: '8500 Rosedale Highway', city: 'Bakersfield', state: 'CA', zipCode: '93312', status: 'completed', estimatedBudget: 1850000.00, actualCost: 1789432.10 },
]

const insertProject = db.prepare(`
  INSERT INTO projects (id, accountId, name, address, city, state, zipCode, status, startDate, endDate, estimatedBudget, actualCost, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

projects.forEach(p => {
  insertProject.run(p.id, accountId, p.name, p.address, p.city, p.state, p.zipCode, p.status,
    new Date('2024-01-01').toISOString(),
    new Date('2024-12-31').toISOString(),
    p.estimatedBudget, p.actualCost, now, now)
})

const [proj1, proj2, proj3, proj4] = projects

// Insert demo contacts
const contacts = [
  { id: randomUUID(), type: 'vendor', companyName: 'Valley Lumber & Supply', firstName: 'Robert', lastName: 'Anderson', email: 'robert@valleylumber.com', phoneNumber: '+1-661-555-0201', role: 'Sales Manager', notes: 'Preferred lumber supplier' },
  { id: randomUUID(), type: 'sub', companyName: 'ProElectric Solutions', firstName: 'Lisa', lastName: 'Rodriguez', email: 'lisa@proelectric.com', phoneNumber: '+1-661-555-0202', role: 'Owner', notes: 'Licensed electrician' },
  { id: randomUUID(), type: 'architect', companyName: 'Kern Design Group', firstName: 'David', lastName: 'Kim', email: 'david@kerndesign.com', phoneNumber: '+1-661-555-0203', role: 'Principal Architect', notes: 'Medical Center project' },
  { id: randomUUID(), type: 'vendor', companyName: 'Bakersfield Concrete & Masonry', firstName: 'James', lastName: 'Wilson', email: 'james@bfconcrete.com', phoneNumber: '+1-661-555-0204', role: 'Operations Manager', notes: 'Concrete supplier' },
]

const insertContact = db.prepare(`
  INSERT INTO contacts (id, accountId, type, companyName, firstName, lastName, email, phoneNumber, role, notes, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

contacts.forEach(c => {
  insertContact.run(c.id, accountId, c.type, c.companyName, c.firstName, c.lastName, c.email, c.phoneNumber, c.role, c.notes, now, now)
})

const [contact1, contact2, contact3, contact4] = contacts

// Insert demo RFIs
const rfi1 = randomUUID()
db.prepare(`INSERT INTO rfis (id, accountId, projectId, rfiNumber, subject, question, response, status, priority, fromContactId, toContactId, dueDate, sentDate, responseDate, createdById, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(rfi1, accountId, proj1.id, 'RFI-001', 'Clarification on HVAC System Specifications',
    'The drawings show a 10-ton unit for the second floor, but the mechanical schedule lists a 12-ton unit. Which specification is correct?',
    'Use the 12-ton unit as listed. SEER rating minimum is 16.',
    'responded', 'high', contact3.id, contact2.id,
    new Date('2024-11-20').toISOString(), new Date('2024-11-10').toISOString(), new Date('2024-11-15').toISOString(),
    userId, new Date('2024-11-10').toISOString(), new Date('2024-11-15').toISOString())

const rfi2 = randomUUID()
db.prepare(`INSERT INTO rfis (id, accountId, projectId, rfiNumber, subject, question, status, priority, toContactId, dueDate, sentDate, createdById, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(rfi2, accountId, proj1.id, 'RFI-002', 'Electrical Panel Location Conflict',
    'The electrical panel location conflicts with the plumbing chase. Can we relocate the panel 4 feet to the west?',
    'sent', 'urgent', contact3.id,
    new Date('2024-12-08').toISOString(), new Date('2024-12-03').toISOString(),
    userId, new Date('2024-12-02').toISOString(), new Date('2024-12-03').toISOString())

const rfi3 = randomUUID()
db.prepare(`INSERT INTO rfis (id, accountId, projectId, rfiNumber, subject, question, status, priority, createdById, createdAt, updatedAt, aiGenerated, aiConfidence, sourceEmailId)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(rfi3, accountId, proj2.id, 'RFI-003', 'Fire Sprinkler Head Type for Office Areas',
    'Plans do not specify sprinkler head type for open office areas. Should we use concealed or pendant heads?',
    'draft', 'normal', userId,
    new Date('2024-12-01').toISOString(), new Date('2024-12-01').toISOString(), 1, 0.89, 'email-123')

// Insert demo change orders
db.prepare(`INSERT INTO change_orders (id, accountId, projectId, coNumber, title, description, reason, status, priceImpact, scheduleImpact, submittedDate, approvedDate, createdById, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), accountId, proj1.id, 'CO-001', 'Additional Medical Gas Outlets',
    'Owner requests 2 additional oxygen outlets and 1 vacuum outlet per patient room (8 rooms total).',
    'Owner change request', 'approved', 24500.00, 5,
    new Date('2024-10-15').toISOString(), new Date('2024-10-22').toISOString(),
    userId, new Date('2024-10-14').toISOString(), new Date('2024-10-22').toISOString())

db.prepare(`INSERT INTO change_orders (id, accountId, projectId, coNumber, title, description, reason, status, priceImpact, scheduleImpact, submittedDate, createdById, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), accountId, proj1.id, 'CO-002', 'Upgrade Flooring in Main Lobby',
    'Change from standard LVT to porcelain tile in main lobby area (approx 1,200 SF).',
    'Owner upgrade request', 'pending', 18750.00, 3,
    new Date('2024-11-28').toISOString(),
    userId, new Date('2024-11-25').toISOString(), new Date('2024-11-28').toISOString())

db.prepare(`INSERT INTO change_orders (id, accountId, projectId, coNumber, title, description, reason, status, priceImpact, scheduleImpact, submittedDate, approvedDate, createdById, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), accountId, proj2.id, 'CO-003', 'Structural Steel Reinforcement - Roof',
    'Additional steel beam required due to unforeseen existing structural conditions.',
    'Unforeseen existing condition', 'approved', 45200.00, 10,
    new Date('2024-09-10').toISOString(), new Date('2024-09-12').toISOString(),
    userId, new Date('2024-09-09').toISOString(), new Date('2024-09-12').toISOString())

// Insert demo invoices
const inv1 = randomUUID()
db.prepare(`INSERT INTO invoices (id, accountId, projectId, vendorId, invoiceNumber, invoiceDate, dueDate, subtotal, tax, total, status, category, costCode, notes, createdAt, updatedAt, aiExtracted, aiConfidence)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(inv1, accountId, proj1.id, contact1.id, 'VLS-2024-8821',
    new Date('2024-11-15').toISOString(), new Date('2024-12-15').toISOString(),
    12450.00, 1057.88, 13507.88, 'approved', 'materials', '03-3000',
    'Lumber delivery for framing - Building A', now, now, 1, 0.95)

db.prepare(`INSERT INTO invoice_line_items (id, invoiceId, description, quantity, unitPrice, amount)
  VALUES (?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), inv1, '2x4x8 Studs - Premium Grade', 500, 8.50, 4250.00)

db.prepare(`INSERT INTO invoice_line_items (id, invoiceId, description, quantity, unitPrice, amount)
  VALUES (?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), inv1, '4x8x3/4 Plywood Sheathing', 200, 42.00, 8400.00)

const inv2 = randomUUID()
db.prepare(`INSERT INTO invoices (id, accountId, projectId, vendorId, invoiceNumber, invoiceDate, dueDate, subtotal, tax, total, status, category, costCode, notes, createdAt, updatedAt, aiExtracted, aiConfidence)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(inv2, accountId, proj1.id, contact2.id, 'PRO-ELEC-4512',
    new Date('2024-11-20').toISOString(), new Date('2024-12-20').toISOString(),
    8975.00, 762.88, 9737.88, 'pending', 'labor', '16-1000',
    'Electrical rough-in - 2nd floor', now, now, 1, 0.92)

db.prepare(`INSERT INTO invoice_line_items (id, invoiceId, description, quantity, unitPrice, amount)
  VALUES (?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), inv2, 'Electrical Rough-in Labor', 85, 95.00, 8075.00)

const inv3 = randomUUID()
db.prepare(`INSERT INTO invoices (id, accountId, projectId, vendorId, invoiceNumber, invoiceDate, dueDate, subtotal, tax, total, status, category, costCode, notes, createdAt, updatedAt, aiExtracted, aiConfidence)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(inv3, accountId, proj2.id, contact4.id, 'BFC-2024-1205',
    new Date('2024-11-28').toISOString(), new Date('2024-12-28').toISOString(),
    24800.00, 2108.00, 26908.00, 'approved', 'materials', '03-3000',
    'Concrete for foundation - Phase 2', now, now, 1, 0.97)

db.prepare(`INSERT INTO invoice_line_items (id, invoiceId, description, quantity, unitPrice, amount)
  VALUES (?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), inv3, 'Ready-Mix Concrete (3000 PSI)', 80, 175.00, 14000.00)

db.prepare(`INSERT INTO invoice_line_items (id, invoiceId, description, quantity, unitPrice, amount)
  VALUES (?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), inv3, 'Rebar #4 (20ft)', 400, 12.50, 5000.00)

// Insert demo daily reports
db.prepare(`INSERT INTO daily_reports (id, accountId, projectId, reportDate, weatherAM, weatherPM, temperature, workPerformed, laborSummary, equipmentUsed, deliveries, delays, safetyIssues, createdById, createdAt, updatedAt, voiceRecorded, transcriptId)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), accountId, proj1.id, new Date('2024-12-02').toISOString(),
    'Clear', 'Partly Cloudy', '58°F - 72°F',
    'Continued electrical rough-in on 2nd floor. Completed framing inspection in Building A. Started HVAC ductwork installation in west wing.',
    JSON.stringify([{ trade: 'Electricians', workers: 4, hours: 32 }, { trade: 'Framers', workers: 6, hours: 48 }, { trade: 'HVAC Techs', workers: 3, hours: 24 }]),
    'Scissor lift (2), Forklift, Compressor',
    'Electrical conduit and boxes from ProElectric.',
    'None', 'None reported.',
    userId, now, now, 1, 'transcript-001')

db.prepare(`INSERT INTO daily_reports (id, accountId, projectId, reportDate, weatherAM, weatherPM, temperature, workPerformed, laborSummary, equipmentUsed, deliveries, delays, safetyIssues, createdById, createdAt, updatedAt, voiceRecorded, transcriptId)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(randomUUID(), accountId, proj2.id, new Date('2024-12-01').toISOString(),
    'Overcast', 'Light Rain', '52°F - 65°F',
    'Foundation formwork in progress for south section. Rebar placement completed in north section.',
    JSON.stringify([{ trade: 'Concrete Crew', workers: 8, hours: 64 }, { trade: 'Laborers', workers: 4, hours: 32 }]),
    'Concrete pump truck (scheduled), Excavator, Rebar bender',
    'Rebar delivery completed at 8am.',
    'Weather delay possible for concrete pour.',
    'Wet conditions - extra caution signs posted.',
    userId, now, now, 1, 'transcript-002')

db.close()
console.log('✅ Seed complete!')
console.log('   Account:  blunts954@gmail.com')
console.log('   Password: coaijay1989')
console.log(`   Acc ID:   ${accountId}`)
console.log(`   User ID:  ${userId}`)
