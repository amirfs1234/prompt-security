document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById('status');
    const issues = document.getElementById('issues');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      chrome.storage.local.get(['scanHistoryByUrl'], (result) => {
        const scans = (result.scanHistoryByUrl && result.scanHistoryByUrl[url]) || [];
        if (scans.length === 0) {
          status.textContent = 'No recent scans';
          return;
        }
        const anySecrets = scans.some(scan => scan.secretsDetected);
        status.textContent = anySecrets ? '🚨 Secret(s) found!' : '✅ No secrets detected.';
        issues.innerHTML = '';
        scans.slice(-10).reverse().forEach(scan => {
          const li = document.createElement('li');
          li.textContent = `${scan.fileName} (${scan.secretsDetected ? '🚨 Secret(s) found' : '✅ Clean'}) [${new Date(scan.timestamp).toLocaleString()}]`;
          issues.appendChild(li);
        });
      });
    });
  });
  