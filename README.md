# prompt-security
An application that inspects PDF files for sensitive info that should not be sent to AI sites

---

## Instructions for Using the Service and Testing File Inspection

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend directory with the following content:
   ```env
   PROMPT_SECURITY_API=https://eu.prompt.security/api/protect
   APP_ID=your-app-id-here
   PORT=3000
   ```
   Replace `your-app-id-here` with your Prompt Security API App ID.
4. Start the backend server:
   ```sh
   npm start
   ```

### Chrome Extension Setup
1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode" (toggle in the top right).
3. Click "Load unpacked" and select the `chrome-extension` folder from this repo.
4. Visit a supported AI site (e.g., ChatGPT, Grok).
5. Upload a PDF file using the site's file upload input.
6. Click the extension icon to view scan results for the current conversation/page.

### Testing File Inspection
- When you upload a PDF, the extension sends the file to the backend, which inspects it using the Prompt Security API.
- If a secret is detected, you will see an alert pop up (the upload is not blocked).
- The extension popup will show the scan status and a list of recent scans for the current conversation/page, so that the info is relevant for the specific site you're in, and the conversation on that site

---

## Limitations
- Only PDF files are detected and scanned.
- Only works on sites that use standard file input elements.
- Alerts are non-blocking (user can still upload secrets).
- Scan history is per-URL; if a site does not use unique URLs per conversation, results may be shared, although I'm pretty sure
that most sites have unique URLS per conversation so that shouldn't be a problem
- Only inspects the first file in a multi-file upload.
- No authentication or rate limiting on the backend.
- No support for very large PDFs (base64 in memory).
- No production-grade error handling or logging.

---

## Possible Features/Requirements for Production Readiness
- Support for more file types like DOCX or TXT.
- Blocking uploads with secrets (not just alerting).
- More robust UI/UX for scan results and history.
- Rate limiting and abuse prevention.
- Automated tests and CI/CD pipeline.
- Monitoring and alerting for backend/API failures.

---

## Performance Improvement Ideas for Large Scale
- Use a queue or worker system for file inspection.
- Cache scan results for identical files.
- Batch API requests to Prompt Security if multi-file upload is allowed
- Use a scalable backend (serverless or containers)

---

## Example `.env` for Backend
```env
PROMPT_SECURITY_API=https://eu.prompt.security/api/protect
APP_ID=your-app-id-here
PORT=3000
```
