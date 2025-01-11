# PhishShield: AI-Enhanced URL Protection (Gmail Extension)

## Overview
PhishGuard is a browser extension designed to enhance email security by helping users identify potential phishing links within Gmail. The system detects user interactions with email links, prompts users for permission to verify the safety of the URL, and warns them if any link is flagged as unsafe.

### Features
- Real-time user interaction tracking for Gmail links.
- Permission-based URL safety checks.
- Responsive UI for security prompts using Bootstrap.
- Hover and click detection for enhanced interaction control.
- Clean, user-friendly interface with modal-based user prompts.

### Installation
** Clone the Repository **
bash
git clone https://github.com/yourusername/phishguard-extension.git
cd phishguard-extension

1. Load the Extension in Chrome
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer Mode (toggle in the top right corner).
4. Click Load Unpacked and select the project directory.
5. The extension will be loaded and ready for use in Gmail.

### Usage
1. Open Gmail in your browser.
2. Hover over or click any email link to trigger the security check prompt.
3. Confirm if you want to check the link for safety.
4. If the link is flagged as unsafe, a warning modal will appear.

### Technologies Used
- ** JavaScript **: Core functionality for user interactions and dynamic content handling.
- ** Bootstrap **: Ensures responsive and visually appealing design for the extension's UI.
- ** Chrome Extensions API **: Integrates seamlessly with the browser to manage user interactions and permissions.
- ** Backend (Java Spring Boot) **: Manages communication between the extension and external APIs securely and efficiently.
- ** APIs ** :
- ** Google Safe Browsing API **: Detects unsafe links to protect users from phishing and malware threats.
- ** OpenAI API **: Provides intelligent analysis and recommendations for suspicious content detection.

  
