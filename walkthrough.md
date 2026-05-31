# Walkthrough: Member Login & Google Sheets Integration

We have successfully integrated a complete, secure email/password authentication system, a premium Team Analytics Dashboard, and a real-time Google Sheets calendar CMS integration into the FinEzy compliance portal application.

---

## Changes Implemented

### 1. Member Login & Team Analytics Dashboard
- **Navigation Updates**: Added dynamic conditional links in the navbar (Member Login button for guest users, and Layout Dashboard / Sign Out buttons for team members).
- **Authentication**: Added a login/register card form connected to Supabase Auth.
- **Team CRM Dashboard**: Displays stats (total inquiries, weekly inquiries, top category), service breakdown charts (using CSS progress bars), and a consultations log table displaying submissions.

### 2. Google Sheets Integration (Calendar CMS)
- **Dynamic Calendar State**: Added a `calendarItems` state variable in [app/page.js](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/app/page.js) initialized with static defaults.
- **CSV Fetcher & Parser**:
  - Implemented a custom client-side CSV parser `parseCSV` in [app/page.js](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/app/page.js) that splits CSV files by rows and columns, handling double quotes and embedded commas correctly.
  - Implemented `fetchGoogleSheetCalendar` to fetch a published Google Sheet CSV URL from `process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL`.
  - Added error-handling with automatic fallback to local offline calendar entries if the network is down or the URL is invalid.
- **Mounted Fetching Hook**: Hooked the fetch function to the root `useEffect` on mount.

---

## Verification & Configuration Guidelines

### 1. Setup Your Google Sheet Calendar
1. Create a new Google Sheet.
2. Set up headers in Row 1:
   - `date` (e.g., `05`, `11`, `15`)
   - `form` (e.g., `GSTR-3B`, `GSTR-1`)
   - `desc` (e.g., `GST monthly return for April supplies`)
   - `cat` (must be one of: `gst`, `it`, `tds`, `mca`, `pf`)
   - `catLabel` (e.g., `GST`, `Income Tax`, `TDS`, `MCA`, `PF/ESI`)
3. Add some deadlines in the subsequent rows.
4. Click **File** -> **Share** -> **Publish to web** -> Select your sheet -> Select **Comma-separated values (.csv)** -> Click **Publish**.
5. Copy the generated CSV link and paste it into your [.env.local](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/.env.local) file:
   ```env
   NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL="YOUR_PUBLISHED_CSV_LINK_HERE"
   ```

### 2. Run Locally
- Start the dev server in your command prompt:
  ```cmd
  cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && npm run dev"
  ```
- Open `http://localhost:3000/#calendar` and verify that the compliance dates match your Google Sheet spreadsheet!
- Make a change in the sheet, wait 2–5 minutes (Google Sheet's default refresh rate), reload, and check the calendar update.
