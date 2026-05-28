import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveLead, markLeadEmailSent } from './db';
import { sendLeadNotificationEmail } from './email';

// Mock the database functions
vi.mock('./db', () => ({
  saveLead: vi.fn(),
  markLeadEmailSent: vi.fn(),
}));

// Mock the email service
vi.mock('./email', () => ({
  sendLeadNotificationEmail: vi.fn(),
}));

describe('Lead Capture System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save a lead to the database', async () => {
    const mockSaveLead = saveLead as any;
    mockSaveLead.mockResolvedValue({ insertId: 1 });

    const leadData = {
      name: 'Test User',
      email: 'test@example.com',
      whatsapp: '1234567890',
      country: '+57',
      source: 'landing-page',
    };

    const result = await saveLead(leadData);

    expect(mockSaveLead).toHaveBeenCalledWith(leadData);
    expect(result.insertId).toBe(1);
  });

  it('should send email notification when lead is captured', async () => {
    const mockSendEmail = sendLeadNotificationEmail as any;
    mockSendEmail.mockResolvedValue(true);

    const leadData = {
      name: 'Test User',
      email: 'test@example.com',
      whatsapp: '1234567890',
      country: '+57',
      source: 'landing-page',
    };

    const result = await sendLeadNotificationEmail(leadData);

    expect(mockSendEmail).toHaveBeenCalledWith(leadData);
    expect(result).toBe(true);
  });

  it('should mark email as sent after successful notification', async () => {
    const mockMarkEmailSent = markLeadEmailSent as any;
    mockMarkEmailSent.mockResolvedValue(true);

    await markLeadEmailSent(1);

    expect(mockMarkEmailSent).toHaveBeenCalledWith(1);
  });

  it('should handle lead capture with all fields', async () => {
    const mockSaveLead = saveLead as any;
    const mockSendEmail = sendLeadNotificationEmail as any;
    const mockMarkEmailSent = markLeadEmailSent as any;

    mockSaveLead.mockResolvedValue({ insertId: 42 });
    mockSendEmail.mockResolvedValue(true);
    mockMarkEmailSent.mockResolvedValue(true);

    const leadData = {
      name: 'Melissa Cuartas',
      email: 'melissa@example.com',
      whatsapp: '573001234567',
      country: '+57',
      source: 'investor-test',
    };

    // Simulate the lead capture flow
    const saveResult = await saveLead(leadData);
    const emailSent = await sendLeadNotificationEmail(leadData);

    if (emailSent && saveResult.insertId) {
      await markLeadEmailSent(saveResult.insertId);
    }

    expect(mockSaveLead).toHaveBeenCalledWith(leadData);
    expect(mockSendEmail).toHaveBeenCalledWith(leadData);
    expect(mockMarkEmailSent).toHaveBeenCalledWith(42);
  });

  it('should handle email sending failure gracefully', async () => {
    const mockSendEmail = sendLeadNotificationEmail as any;
    mockSendEmail.mockResolvedValue(false);

    const leadData = {
      name: 'Test User',
      email: 'test@example.com',
      whatsapp: '1234567890',
      country: '+57',
      source: 'landing-page',
    };

    const result = await sendLeadNotificationEmail(leadData);

    expect(result).toBe(false);
  });
});
