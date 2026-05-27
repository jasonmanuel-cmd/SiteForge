/**
 * Centralized validation schemas for all forms and API inputs
 * Using zod for runtime validation + TypeScript inference
 */

import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    businessName: z.string().min(1, 'Business name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Estimator schemas
export const estimatorSchema = z.object({
  trade: z.enum([
    'framing',
    'drywall',
    'concrete',
    'painting',
    'electrical',
    'plumbing',
    'roofing',
    'landscaping',
  ]),
  inputs: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

// Project schemas
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  estimatedBudget: z.number().min(0, 'Budget must be positive').optional(),
});

// Contact schemas
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number').optional(),
  role: z.enum(['owner', 'contractor', 'architect', 'other']).optional(),
});

// RFI schemas
export const rfiSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().datetime('Invalid date').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  projectId: z.string().uuid('Invalid project ID'),
});

// Change Order schemas
export const changeOrderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  reason: z.string().min(1, 'Reason is required'),
  projectId: z.string().uuid('Invalid project ID'),
});

// Invoice schemas
export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  projectId: z.string().uuid('Invalid project ID'),
  dueDate: z.string().datetime('Invalid date'),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Item description required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        rate: z.number().min(0, 'Rate must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
});

// Chat schemas
export const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  context: z.string().optional(),
});

// Daily Report schemas
export const dailyReportSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  date: z.string().datetime('Invalid date'),
  weather: z.string().optional(),
  workforce: z.array(z.string()).optional(),
  tasks: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// File upload schemas
export const fileUploadSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  file: z.instanceof(File, { message: 'Invalid file' }),
  type: z.enum(['document', 'image', 'plan']).optional(),
});

// Types exported from schemas for type-safe form handling
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type EstimatorInput = z.infer<typeof estimatorSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type RfiInput = z.infer<typeof rfiSchema>;
export type ChangeOrderInput = z.infer<typeof changeOrderSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
export type DailyReportInput = z.infer<typeof dailyReportSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
