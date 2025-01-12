# PhishShield: AI-Enhanced URL Protection (Gmail Extension)

## Overview
**PhishShield** is a browser extension designed to enhance email security by helping users identify potential phishing links within Gmail. The system monitors user interactions with email links, prompts users for permission to verify the URL's safety, and provides warnings if a link is flagged as safe, suspicious, or phishing.

### Features
- Real-time user interaction tracking for Gmail links.
- Permission-based URL safety checks.
- Responsive UI for security prompts using Bootstrap.
- Hover and click detection for enhanced interaction control.
- Clean, user-friendly interface with modal-based user prompts.

### Installation
**Clone the Repository**
1. git clone https://github.com/JonArbell/phish-shield.git
2. cd phish-shield-extension

**Install the Extension**
1. Load the Extension in Chrome
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer Mode (toggle in the top right corner).
4. Click Load Unpacked and select the project directory.
5. The extension will be loaded and ready for use in Gmail.

### Usage
1. Open Gmail in your browser.
2. Hover over any email link to trigger the security check prompt.
3. Confirm if you want to check the link for safety.
4. If the link is flagged as suspicious, a warning modal will appear. If the link is flagged as phishing, a red warning modal will appear. If the link is flagged as safe, a safe status modal will appear.

### Technologies Used
- **JavaScript**: Core functionality for user interactions and dynamic content handling.
- **Bootstrap**: Ensures responsive and visually appealing design for the extension's UI.
- **Chrome Extensions API**: Integrates seamlessly with the browser to manage user interactions and permissions.
- **Backend (Java Spring Boot)**: Manages communication between the extension and external APIs securely and efficiently.
### APIs
- **Google Safe Browsing API**: Detects unsafe links to protect users from phishing and malware threats.
- **OpenAI API**: Secondary verification of URL safety, enhancing confidence in flagged results

  
