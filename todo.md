# Project TODO

## Lead Capture System (Completed)
- [x] Create leads table in database schema
- [x] Add database helpers (saveLead, markLeadEmailSent)
- [x] Configure Resend API key as environment variable
- [x] Implement email service for lead notifications
- [x] Create tRPC procedure for lead capture (leads.capture)
- [x] Integrate LeadModal with tRPC backend
- [x] Integrate InvestorTestModal with tRPC backend
- [x] Write unit tests for lead capture system
- [x] Write integration tests for email service
- [x] Verify all tests pass

## Implementation Details

### Database Schema
- **Table**: `leads`
- **Fields**: id, name, email, whatsapp, country, source, emailSent, createdAt
- **Location**: `/drizzle/schema.ts`

### Backend Services
- **Email Service**: `/server/email.ts` - Sends email notifications via Resend API
- **Database Helpers**: `/server/db.ts` - saveLead(), markLeadEmailSent()
- **tRPC Router**: `/server/routers.ts` - leads.capture mutation

### Frontend Integration
- **LeadModal**: `/client/src/components/LeadModal.tsx` - Captures leads for resources
- **InvestorTestModal**: `/client/src/components/InvestorTestModal.tsx` - Captures leads for test
- **Both components**: Use `trpc.leads.capture.useMutation()` to send data to backend

### Environment Variables
- `RESEND_API_KEY` - API key for Resend email service (configured via webdev_request_secrets)

### Email Configuration
- **From**: noreply@melissa-cuartas.com
- **To**: melissacuartas1113@gmail.com
- **Subject**: "Nuevo Lead: {name}"
- **Template**: HTML email with lead information

### Tests
- `/server/leads.capture.test.ts` - Unit tests for lead capture flow
- `/server/email.integration.test.ts` - Integration tests for email service
- `/server/auth.logout.test.ts` - Existing authentication tests

## How It Works

1. **User fills form** in LeadModal or InvestorTestModal
2. **Frontend validates** form data
3. **Frontend calls** `trpc.leads.capture.mutateAsync()` with lead data
4. **Backend saves** lead to database
5. **Backend sends** email notification to melissacuartas1113@gmail.com
6. **Backend marks** email as sent in database
7. **Frontend shows** success toast notification

## Lead Sources
- `landing-page` - From resource download forms
- `investor-test` - From investor profile test
- Any other custom source can be added

## Next Steps (Optional)
- Add lead management dashboard
- Implement lead analytics
- Add automated follow-up emails
- Create lead export functionality
- Add lead segmentation by source

## Compound Interest Calculator Integration (Completed)
- [x] Create CompoundInterestCalculator component with Melissa's design
- [x] Adapt color palette and typography from main site
- [x] Integrate calculator into Home.tsx as new section after Mentoring
- [x] Add responsive layout matching site design
- [x] Test calculator functionality across devices
- [x] Verify form inputs and calculations work correctly
- [x] Fix division by zero error when annual rate is 0
- [x] Write Vitest unit tests for calculator math (9 tests)
- [x] All tests passing (23 total tests)
- [x] Save checkpoint with calculator integrated

## PDF Export for Calculator (Completed)
- [x] Install html2pdf or similar library for PDF generation
- [x] Create PDF export function with calculator results
- [x] Add Download PDF button to calculator
- [x] Include charts and summary data in PDF
- [x] Test PDF download functionality
- [x] Add bilingual labels (ES/EN) for PDF button
- [x] Write 7 unit tests for PDF export feature
- [x] All tests passing (30 total tests)


## Admin Dashboard - Leads Management (Completed)
- [x] Create admin leads page component at `/client/src/pages/AdminLeads.tsx`
- [x] Add tRPC procedure `leads.getAll` with optional filters (dateFrom, dateTo, source)
- [x] Add tRPC procedure `leads.exportCsv` to generate CSV download
- [x] Create LeadsTable component with sortable columns
- [x] Add date range filter (from/to dates)
- [x] Add source filter (budget, beliefs, test, all)
- [x] Implement CSV export functionality
- [x] Add admin-only route protection in App.tsx
- [x] Write unit tests for leads.getAll and leads.exportCsv procedures
- [x] Write unit tests for LeadsTable component
- [x] Test CSV export with sample data
- [x] Verify admin access control (only admin users can view)


## Cloudflare Deployment Fix (Completed)
- [x] Identificar error de "Invalid URL" en Cloudflare
- [x] Proteger Map.tsx para validar API_KEY y FORGE_BASE_URL
- [x] Proteger const.ts para validar VITE_OAUTH_PORTAL_URL y VITE_APP_ID
- [x] Agregar manejo de errores cuando variables de entorno están vacías
- [x] Verificar que todos los tests pasan (43 tests)
- [x] Verificar que el servidor local sigue funcionando
