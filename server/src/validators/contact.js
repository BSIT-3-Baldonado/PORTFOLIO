import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(5).max(5000),
  // Honeypot: should be empty
  hp_field: z.string().optional().default(''),
});

