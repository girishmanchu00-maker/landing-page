# Checklist for Google Sheets Integration

- `[x]` Define `calendarItems` state and environment variable `NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL` in `app/page.js`
- `[x]` Implement robust `parseCSV` helper function in `app/page.js`
- `[x]` Implement `fetchGoogleSheetCalendar` in `app/page.js` to fetch and parse sheet data
- `[x]` Add `fetchGoogleSheetCalendar` to `useEffect` mount in `app/page.js`
- `[x]` Update rendering components to display the dynamic list in `app/page.js`
- `[x]` Verify local execution and fallback functionality
