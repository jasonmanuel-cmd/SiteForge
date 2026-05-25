-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "planType" TEXT NOT NULL DEFAULT 'trial',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qbRealmId" TEXT,
    "qbAccessToken" TEXT,
    "qbRefreshToken" TEXT,
    "qbTokenExpiry" TIMESTAMP(3),
    "emailProvider" TEXT,
    "emailAccessToken" TEXT,
    "emailRefreshToken" TEXT,
    "emailTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "estimatedBudget" DECIMAL(12,2),
    "actualCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "qbJobId" TEXT,
    "qbClassName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "companyName" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfis" (
    "id" TEXT NOT NULL,
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
    "dueDate" TIMESTAMP(3),
    "sentDate" TIMESTAMP(3),
    "responseDate" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DECIMAL(3,2),
    "sourceEmailId" TEXT,

    CONSTRAINT "rfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_orders" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "coNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "priceImpact" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "scheduleImpact" INTEGER NOT NULL DEFAULT 0,
    "contactId" TEXT,
    "submittedDate" TIMESTAMP(3),
    "approvedDate" TIMESTAMP(3),
    "rejectedDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DECIMAL(3,2),
    "sourceEmailId" TEXT,

    CONSTRAINT "change_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "vendorId" TEXT,
    "invoiceNumber" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "category" TEXT,
    "costCode" TEXT,
    "qbTxnId" TEXT,
    "qbSyncedAt" TIMESTAMP(3),
    "isMultiJob" BOOLEAN NOT NULL DEFAULT false,
    "allocations" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiExtracted" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DECIMAL(3,2),
    "rawExtraction" JSONB,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "category" TEXT,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reports" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "weatherAM" TEXT,
    "weatherPM" TEXT,
    "temperature" TEXT,
    "workPerformed" TEXT,
    "laborSummary" JSONB,
    "equipmentUsed" TEXT,
    "deliveries" TEXT,
    "delays" TEXT,
    "safetyIssues" TEXT,
    "photos" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "voiceRecorded" BOOLEAN NOT NULL DEFAULT false,
    "transcriptId" TEXT,

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
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
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_events" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "rawInput" JSONB NOT NULL,
    "aiProvider" TEXT,
    "aiModel" TEXT,
    "aiPrompt" TEXT,
    "aiResponse" JSONB,
    "aiConfidence" DECIMAL(3,2),
    "createdEntityType" TEXT,
    "createdEntityId" TEXT,
    "processingTime" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ai_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_qbRealmId_key" ON "accounts"("qbRealmId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_accountId_idx" ON "users"("accountId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "projects_accountId_idx" ON "projects"("accountId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "contacts_accountId_idx" ON "contacts"("accountId");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "rfis_accountId_idx" ON "rfis"("accountId");

-- CreateIndex
CREATE INDEX "rfis_projectId_idx" ON "rfis"("projectId");

-- CreateIndex
CREATE INDEX "rfis_status_idx" ON "rfis"("status");

-- CreateIndex
CREATE INDEX "change_orders_accountId_idx" ON "change_orders"("accountId");

-- CreateIndex
CREATE INDEX "change_orders_projectId_idx" ON "change_orders"("projectId");

-- CreateIndex
CREATE INDEX "change_orders_status_idx" ON "change_orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_qbTxnId_key" ON "invoices"("qbTxnId");

-- CreateIndex
CREATE INDEX "invoices_accountId_idx" ON "invoices"("accountId");

-- CreateIndex
CREATE INDEX "invoices_projectId_idx" ON "invoices"("projectId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoice_line_items_invoiceId_idx" ON "invoice_line_items"("invoiceId");

-- CreateIndex
CREATE INDEX "daily_reports_accountId_idx" ON "daily_reports"("accountId");

-- CreateIndex
CREATE INDEX "daily_reports_projectId_idx" ON "daily_reports"("projectId");

-- CreateIndex
CREATE INDEX "daily_reports_reportDate_idx" ON "daily_reports"("reportDate");

-- CreateIndex
CREATE INDEX "files_accountId_idx" ON "files"("accountId");

-- CreateIndex
CREATE INDEX "files_projectId_idx" ON "files"("projectId");

-- CreateIndex
CREATE INDEX "files_linkedEntityType_linkedEntityId_idx" ON "files"("linkedEntityType", "linkedEntityId");

-- CreateIndex
CREATE INDEX "ai_events_accountId_idx" ON "ai_events"("accountId");

-- CreateIndex
CREATE INDEX "ai_events_eventType_idx" ON "ai_events"("eventType");

-- CreateIndex
CREATE INDEX "ai_events_status_idx" ON "ai_events"("status");

-- CreateIndex
CREATE INDEX "ai_events_createdAt_idx" ON "ai_events"("createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfis" ADD CONSTRAINT "rfis_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfis" ADD CONSTRAINT "rfis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfis" ADD CONSTRAINT "rfis_fromContactId_fkey" FOREIGN KEY ("fromContactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfis" ADD CONSTRAINT "rfis_toContactId_fkey" FOREIGN KEY ("toContactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfis" ADD CONSTRAINT "rfis_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_orders" ADD CONSTRAINT "change_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_events" ADD CONSTRAINT "ai_events_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
