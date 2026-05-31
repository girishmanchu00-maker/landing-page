# Implementation Plan: Full Google Sheets CMS Integration

This plan details how to connect the remaining static modules of the FinEzy application (GST Rate Finder, Checklists, and Due Date Tracker) to separate tabs of your Google Sheet. If you edit any sheet tab, the corresponding website window will update in real-time.

---

## Google Sheet Structure

You will configure **4 separate tabs** inside your single Google Sheet document:

### Tab 1: Calendar (`Sheet1`)
Used for the compliance deadlines.
- **Headers**: `date`, `form`, `desc`, `cat`, `catLabel`
- **Fallback**: Local `calData` array.

### Tab 2: GST Finder (`Sheet2`)
Used for the HSN lookup database.
- **Headers**: `hsn`, `desc`, `rate`, `cat`
- **Fallback**: Local `gstItems` array.

### Tab 3: Checklists (`Sheet3`)
Used for document requirements lists. Since checklists contain multiple items, group them by sharing the same `title` and `icon` on multiple rows.
- **Headers**: `title`, `icon`, `item`
- **Fallback**: Local `checklists` array.

### Tab 4: Tracker (`Sheet4`)
Used for the due dates countdown grid.
- **Headers**: `title`, `form`, `dueDate` (Date format: `YYYY-MM-DD` or standard date string)
- **Fallback**: Local `trackerItems` array.

---

## User Review Required

> [!IMPORTANT]
> **Step 1: Publish Each Tab to Web as CSV**
> In your Google Sheet, click **File** -> **Share** -> **Publish to web**.
> 1. Select the specific tab name (e.g. `GST`) in the dropdown.
> 2. Select **Comma-separated values (.csv)** in the next dropdown.
> 3. Click **Publish** and copy the generated link.
> 4. Repeat this step for each of the 4 tabs to get 4 unique CSV URLs.
> 
> **Step 2: Update Your Environment Variables**
> Open your [.env.local](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/.env.local) file and append the variables:
> ```env
> NEXT_PUBLIC_GOOGLE_SHEET_CALENDAR_URL="PASTE_CALENDAR_CSV_URL"
> NEXT_PUBLIC_GOOGLE_SHEET_GST_URL="PASTE_GST_CSV_URL"
> NEXT_PUBLIC_GOOGLE_SHEET_CHECKLIST_URL="PASTE_CHECKLIST_CSV_URL"
> NEXT_PUBLIC_GOOGLE_SHEET_TRACKER_URL="PASTE_TRACKER_CSV_URL"
> ```

---

## Proposed Changes

### [MODIFY] [page.js](file:///c:/Coading%20-%20Seperate%20folder/Landing%20page/landing-page/app/page.js)
- Update state variables inside `Page()`:
  - `gstListItems`: Initialized with `gstItems` fallback.
  - `checklistItems`: Initialized with `checklists` fallback.
  - `trackerDateItems`: Initialized with `trackerItems` fallback.
- Implement specialized parsers:
  - `parseGstCSV(text)`: Parses HSN, description, rate (integer), and category.
  - `parseChecklistCSV(text)`: Groups rows with the same `title` and `icon` into nested arrays under that checklist object.
  - `parseTrackerCSV(text)`: Parses title, form, and due date strings into JS Date objects.
- Implement fetching functions:
  - `fetchGstSheet()`: Queries `NEXT_PUBLIC_GOOGLE_SHEET_GST_URL`.
  - `fetchChecklistSheet()`: Queries `NEXT_PUBLIC_GOOGLE_SHEET_CHECKLIST_URL`.
  - `fetchTrackerSheet()`: Queries `NEXT_PUBLIC_GOOGLE_SHEET_TRACKER_URL`.
- Update `useEffect` on mount to call all 4 fetchers.
- Update JSX rendering blocks and search filters to consume state items (`gstListItems`, `checklistItems`, `trackerDateItems`).

---

## Verification Plan

### Manual Verification
- Verify that without configuring the environment variables, the default local fallbacks load and display perfectly.
- Set up a test Google Sheet with the 4 tabs and configure the variables in `.env.local`.
- Reload localhost and confirm that editing any values in the sheet updates the respective module (Calendar, GST finder, Checklists, or Tracker) in real-time.
