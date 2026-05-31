# Implementation Plan: Google Sheets Integration for Compliance Calendar

This plan details how to connect a Google Sheet to your Next.js application, allowing you to edit deadlines and compliance events in a spreadsheet and have them update on the website in real-time.

---

## How It Works

We will use the **Google Sheets "Publish to Web as CSV"** method. This approach:
- Is **100% free** and requires **no Google API keys** or service accounts.
- Works in real-time (Google updates the published CSV feed within a few minutes of edits).
- Includes a local code fallback so the website never breaks if the sheet is unavailable.

---

## User Review Required

> [!IMPORTANT]
> **Step 1: Set Up Your Google Sheet**
> 1. Create a new Google Sheet.
> 2. Create the following headers in row 1 (columns A to E):
>    - **date** (e.g., `05`, `11`, `15`)
>    - **form** (e.g., `GSTR-3B`, `GSTR-1`, `PF/ESI Deposit`)
>    - **desc** (e.g., `GST monthly return for April supplies`)
>    - **cat** (must be one of: `gst`, `it`, `tds`, `mca`, `pf`)
>    - **catLabel** (e.g., `GST`, `Income Tax`, `TDS`, `MCA`, `PF/ESI`)
> 3. Fill in your rows with compliance dates.
> 
> **Step 2: Publish Your Sheet to the Web**
> 1. In your Google Sheet, click **File** -> **Share** -> **Publish to web**.
> 2. In the popup, change "Entire Document" to your specific sheet tab (e.g., `Sheet1`).
> 3. Change "Web page" to **Comma-separated values (.csv)**.
> 4. Click **Publish** and copy the generated link. It will look like this:
>    `https://docs.google.com/spreadsheets/d/e/2PACX-XXXXX/pub?gid=0&single=true&output=csv`
> 
> **Step 3: Update Environment Variables**
> Add your published CSV link to your [.env.local](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/.env.local) file:
> ```env
> NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL="YOUR_PUBLISHED_CSV_LINK_HERE"
> ```

---

## Proposed Changes

### [MODIFY] [page.js](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/app/page.js)
- Add a new environment variable check for `NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL`.
- Create a `calendarItems` state variable initialized with the hardcoded fallback list (`calData`).
- Implement a helper function `parseCSV(csvText)` that:
  - Splits text into rows and columns.
  - Safely handles commas, quotes, and whitespace.
  - Maps rows to the expected calendar object structure: `{ date, form, desc, cat, catLabel }`.
- Add a `fetchGoogleSheetCalendar()` asynchronous function to:
  - Fetch the published CSV URL.
  - Parse the text and update the `calendarItems` state.
  - Throw exceptions/log errors and display a toast alert if the spreadsheet structure is incorrect.
- Run `fetchGoogleSheetCalendar()` inside the main `useEffect` on mount.
- Update the Calendar rendering table to use `calendarItems` state instead of the static `calData` array.

---

## Verification Plan

### Automated & Manual Verification
- Test local execution:
  - Launch dev server (`npm run dev`).
  - Access the calendar page and confirm it displays the hardcoded events.
  - Add your `NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL` to `.env.local` and restart the server.
  - Verify that the calendar updates to display the entries from your Google Sheet.
  - Make a change to a date in the Google Sheet, wait 2–5 minutes, click refresh, and confirm the change is reflected in the web table.
