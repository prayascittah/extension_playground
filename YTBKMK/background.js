chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   if (
      tab.url &&
      tab.url.includes('youtube.com/watch') &&
      changeInfo.status === 'complete'
   ) {
      const queryParameters = tab.url.split('?')[1];
      const urlParameters = new URLSearchParams(queryParameters);

      // Add error handling for message sending
      chrome.tabs
         .sendMessage(tabId, {
            type: 'NEW',
            videoId: urlParameters.get('v'),
         })
         .catch((error) => {
            // Silently handle the error - content script might not be ready yet
            console.log('Content script not ready yet:', error.message);
         });
   }
});
