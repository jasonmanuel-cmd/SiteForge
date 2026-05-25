-- SQLite version of the migration

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "planType" TEXT NOT NULL DEFAULT 'trial',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "qbRealmId" TEXT UNIQUE,
    "qbAccessToken" TEXT,
    "qbRefreshToken" TEXT,
    "qbTokenExpiry" DATETIME,
    "emailProvider" TEXT,
    "emailAccessToken" TEXT,
    "emailRefreshToken" TEXT,
    "emailTokenExpiry" DATETIME
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "estimatedBudget" REAL,
    "actualCost" REAL NOT NULL DEFAULT 0,
    "qbJobId" TEXT,
    "qbClassName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "companyName" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rfis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "rfiNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "fromContactId" TEXT,
    "toContactId" TEXT,
    "dueDate" DATETIME,
    "sentDate" DATETIME,
    "responseDate" DATETIME,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aiGenerated" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" REAL,
    "sourceEmailId" TEXT,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("fromContactId") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("toContactId") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("createdById") REFERENCES "users" ("id")
);

-- CreateTable
CREATE TABLE "change_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "coNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "priceImpact" REAL NOT NULL DEFAULT 0,
    "scheduleImpact" INTEGER NOT NULL DEFAULT 0,
    "contactId" TEXT,
    "submittedDate" DATETIME,
    "approvedDate" DATETIME,
    "rejectedDate" DATETIME,
    "rejectionReason" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aiGenerated" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" REAL,
    "sourceEmailId" TEXT,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("contactId") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("createdById") REFERENCES "users" ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "vendorId" TEXT,
    "invoiceNumber" TEXT,
    "invoiceDate" DATETIME,
    "dueDate" DATETIME,
    "subtotal" REAL NOT NULL DEFAULT 0,
    "tax" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "category" TEXT,
    "costCode" TEXT,
    "qbTxnId" TEXT UNIQUE,
    "qbSyncedAt" DATETIME,
    "isMultiJob" INTEGER NOT NULL DEFAULT 0,
    "allocations" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aiExtracted" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" REAL,
    "rawExtraction" TEXT,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("vendorId") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT,
    FOREIGN KEY ("invoiceId") REFERENCES "invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "daily_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "reportDate" DATETIME NOT NULL,
    "weatherAM" TEXT,
    "weatherPM" TEXT,
    "temperature" TEXT,
    "workPerformed" TEXT,
    "laborSummary" TEXT,
    "equipmentUsed" TEXT,
    "deliveries" TEXT,
    "delays" TEXT,
    "safetyIssues" TEXT,
    "photos" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "voiceRecorded" INTEGER NOT NULL DEFAULT 0,
    "transcriptId" TEXT,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("createdById") REFERENCES "users" ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "storageUrl" TEXT,
    "linkedEntityType" TEXT,
    "linkedEntityId" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "rawInput" TEXT NOT NULL,
    "aiProvider" TEXT,
    "aiModel" TEXT,
    "aiPrompt" TEXT,
    "aiResponse" TEXT,
    "aiConfidence" REAL,
    "createdEntityType" TEXT,
    "createdEntityId" TEXT,
    "processingTime" INTEGER,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndexes
CREATE INDEX "users_accountId_idx" ON "users"("accountId");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "projects_accountId_idx" ON "projects"("accountId");
CREATE INDEX "projects_status_idx" ON "projects"("status");
CREATE INDEX "contacts_accountId_idx" ON "contacts"("accountId");
CREATE INDEX "contacts_email_idx" ON "contacts"("email");
CREATE INDEX "rfis_accountId_idx" ON "rfis"("accountId");
CREATE INDEX "rfis_projectId_idx" ON "rfis"("projectId");
CREATE INDEX "rfis_status_idx" ON "rfis"("status");
CREATE INDEX "change_orders_accountId_idx" ON "change_orders"("accountId");
CREATE INDEX "change_orders_projectId_idx" ON "change_orders"("projectId");
CREATE INDEX "change_orders_status_idx" ON "change_orders"("status");
CREATE INDEX "invoices_accountId_idx" ON "invoices"("accountId");
CREATE INDEX "invoices_projectId_idx" ON "invoices"("projectId");
CREATE INDEX "invoices_status_idx" ON "invoices"("status");
CREATE INDEX "invoice_line_items_invoiceId_idx" ON "invoice_line_items"("invoiceId");
CREATE INDEX "daily_reports_accountId_idx" ON "daily_reports"("accountId");
CREATE INDEX "daily_reports_projectId_idx" ON "daily_reports"("projectId");
CREATE INDEX "daily_reports_reportDate_idx" ON "daily_reports"("reportDate");
CREATE INDEX "files_accountId_idx" ON "files"("accountId");
CREATE INDEX "files_projectId_idx" ON "files"("projectId");
CREATE INDEX "files_linkedEntityType_linkedEntityId_idx" ON "files"("linkedEntityType", "linkedEntityId");
CREATE INDEX "ai_events_accountId_idx" ON "ai_events"("accountId");
CREATE INDEX "ai_events_eventType_idx" ON "ai_events"("eventType");
CREATE INDEX "ai_events_status_idx" ON "ai_events"("status");
CREATE INDEX "ai_events_createdAt_idx" ON "ai_events"("createdAt");
