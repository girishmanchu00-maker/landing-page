# Implementation Plan: Supabase Auth & Team Analytics Dashboard

This plan details the implementation of a secure user login system (email and password based) for team members, leading to an analytics dashboard that displays contact/consultation inquiries from the Supabase database.

---

## User Review Required

> [!IMPORTANT]
> **Database Security Policies (RLS)**:
> Since the dashboard displays data from the `consultations` table, you need to configure your Supabase policies so that only logged-in team members can query this data, while anonymous visitors can still submit the form. 
> 
> Please run the following SQL commands in your **Supabase Dashboard SQL Editor**:
> 
> ```sql
> -- 1. Enable Row Level Security (if not already enabled)
> ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
> 
> -- 2. Allow anyone (public/anonymous) to submit the consultation form
> CREATE POLICY "Allow public inserts" ON consultations 
>   FOR INSERT 
>   TO anon 
>   WITH CHECK (true);
> 
> -- 3. Allow only logged-in team members to read/view consultation records
> CREATE POLICY "Allow authenticated read" ON consultations 
>   FOR SELECT 
>   TO authenticated 
>   USING (true);
> ```

---

## Proposed Changes

### Next.js Client Application

#### [MODIFY] [page.js](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/app/page.js)
- Add state variables to track:
  - `user`: Authenticated user session object (`null` if logged out).
  - `authEmail`, `authPassword`: Inputs for the login/signup form.
  - `authMode`: `'login'` or `'signup'` toggle.
  - `consultations`: Array of database records loaded for the dashboard.
  - `loadingConsultations`: Loading state boolean for database queries.
- Add authentication hooks and listeners:
  - Monitor auth state changes using `supabase.auth.onAuthStateChange`.
  - Fetch active session on component mount.
- Add handler functions:
  - `handleAuth`: Handles Email/Password sign-in and sign-up using the Supabase auth client.
  - `handleSignOut`: Calls `supabase.auth.signOut()` and resets active page state.
  - `fetchConsultationsData`: Loads consultation records from Supabase table once user is authenticated.
- Update Navigation:
  - Replace the static "Consultation" button with a dynamic conditional layout:
    - If logged out: Show "Login" button and "Consultation" CTA.
    - If logged in: Show "Dashboard" tab button and "Sign Out" button.
- Create UI Views:
  - **Login / Sign Up page**: Form with custom styling adhering to the design rules.
  - **Dashboard page**: Displays:
    - Team Welcome header card.
    - Analytics widgets: Total submissions count, breakdowns of inquiries by service type, and recent activity levels.
    - Consultations CRM table: Rows displaying Name, Email, Phone, Service, Message, and submission timestamp.

#### [MODIFY] [globals.css](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/app/globals.css)
- Add `.auth-container` and `.auth-card` styles for the login form interface.
- Add dashboard layout classes: `.db-header`, `.db-stats-grid`, `.db-table-section`, `.service-chart-bar` styling components.
- Ensure light and dark mode colors are inherited correctly via CSS variables.

---

## Verification Plan

### Automated & Client-side Verification
- Inspect browser console logs during session checks.
- Test authentication workflows:
  - Sign up a new user using a test email and password.
  - Sign out.
  - Sign in using the created account.
  - Attempt to sign in with incorrect password to verify error handling and toast output.
- Verify database security:
  - Log out and check that consultation records are not visible.
  - Log in and verify that consultation records successfully load and match database records.
