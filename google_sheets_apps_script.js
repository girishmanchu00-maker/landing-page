/**
 * ============================================================================
 * FINTEZY GOOGLE APPS SCRIPT WEBHOOK (ROW-BY-ROW / LINE-BY-LINE VERSION)
 * ============================================================================
 * 
 * Features:
 * 1. Inserts data ROW BY ROW (Line by Line):
 *    - Row 1: Headers (Date & Time, Full Name, Phone, Email, User Type/Service, Description, Ack Sent, Ack Time)
 *    - Row 2: User 1
 *    - Row 3: User 2, and so on.
 * 2. Automatic Tab Routing:
 *    - payload.formType === "connect"      -> Appends to "Connect" sheet
 *    - payload.formType === "consultation" -> Appends to "Book Consultation" sheet
 * 3. Formats Header row nicely with light blue background, bold blue text, and frozen header row.
 * 4. Sends automated statutory acknowledgement email before recording status.
 * ============================================================================
 */

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // 1. Identify which form sent the data (case-insensitive for safety)
    const formType = (payload.formType || "").toString().trim().toLowerCase(); 
    
    const name = payload.fullName || "N/A";
    const phone = payload.phoneNumber || "N/A";
    const email = payload.emailId || "N/A";
    const selection = payload.selection || payload.requiredService || payload.user || "N/A"; 
    const description = payload.description || "N/A";
    
    // Format the incoming time
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet;

    // 2. Route to the correct tab
    if (formType === "connect") {
      sheet = ss.getSheetByName("Connect");
    } else if (formType === "consultation") {
      sheet = ss.getSheetByName("Book Consultation"); 
    } else {
      throw new Error(`Unknown form source: '${formType}'. Expected 'connect' or 'consultation'.`);
    }

    if (!sheet) {
      throw new Error(`Sheet tab for '${formType}' not found. Please create it in your spreadsheet.`);
    }

    // 3. Send Email FIRST to confirm Acknowledgement status
    let subject, body;
    let ackSent = "No";
    let ackTime = "-";

    try {
      if (formType === "connect") {
        subject = "Welcome to the Fintezy Network!";
        body = `Hi ${name},\n\nWelcome to the Fintezy family! We have received your request to join as a ${selection}.\n\nBest Regards,\nThe Fintezy Team`;
      } else {
        subject = "Consultation Request Received";
        body = `Hi ${name},\n\nThank you for booking a consultation for: ${selection}. Our team will review your details and contact you at ${phone}.\n\nBest Regards,\nThe Fintezy Team`;
      }
      
      MailApp.sendEmail({ to: email, subject: subject, body: body });
      
      // If email succeeds, update acknowledgement tracking
      ackSent = "Yes";
      ackTime = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    } catch (mailError) {
      ackSent = "Failed"; // If user provided an invalid email or quota exceeded
    }

    // 4. Set up Horizontal Headers and Row Data (Line-by-Line)
    const headers = [
      "Date & Time", 
      "Full Name", 
      "Phone Number", 
      "Email ID", 
      "User Type / Service", 
      "Description", 
      "Acknowledgement Sent", 
      "Acknowledgement Time"
    ];

    const userData = [
      timestamp, 
      name, 
      phone, 
      email, 
      selection, 
      description, 
      ackSent, 
      ackTime
    ];

    // 5. Check if sheet is empty and insert data Row by Row
    const lastRow = sheet.getLastRow();

    if (lastRow === 0) {
      // SCENARIO A: Sheet is completely blank
      
      // Insert Headers into Row 1 (A1:H1)
      sheet.appendRow(headers);
      
      // Apply clean formatting to the Headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#e8f0fe"); // Light blue background
      headerRange.setFontColor("#1a73e8");
      sheet.setFrozenRows(1); // Freeze the top header row
      
      // Insert first user into Row 2 (A2:H2)
      sheet.appendRow(userData);
      
      // Auto-resize columns so all data and headers fit nicely
      for (let c = 1; c <= headers.length; c++) {
        sheet.autoResizeColumn(c);
      }
      
    } else {
      // SCENARIO B: Sheet already has header / data rows
      
      // Append new user as the next line / row
      sheet.appendRow(userData);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: `Data logged to ${formType} successfully.` }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
