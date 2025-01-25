chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed or updated.");
  });
  
  chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started.");
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("mail.google.com")) {
      console.log("Gmail is opened!");
    }
  });
  



const getApiKey = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/get-api-key');
        if (!response.ok) throw new Error('Failed to fetch API key');
        const apiKey = await response.text();
        console.log('API Key retrieved:', apiKey);
        return apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
}