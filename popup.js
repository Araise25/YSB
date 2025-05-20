document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const confirmMessage = document.getElementById('confirmMessage');
    const timerDiv = document.getElementById('timer');
    const messageDiv = document.getElementById('message');
    let countdownInterval = null;
    const showDuration = 30;
    let isConfirming = false;
  
    // Load initial state from storage
    chrome.storage.local.get(['shortsBlocked'], (result) => {
      const isBlocked = result.shortsBlocked !== undefined ? result.shortsBlocked : true;
      toggleButton.textContent = isBlocked ? 'Show Shorts' : 'Hide Shorts';
    });
  
    // Function to move button to a random position within the popup
    function moveButtonRandomly() {
      const maxX = 150;
      const maxY = 50;
      const randomX = Math.random() * maxX - maxX / 2;
      const randomY = Math.random() * maxY - maxY / 2;
      toggleButton.style.left = `${randomX}px`;
      toggleButton.style.top = `${randomY}px`;
    }
  
    // Function to start countdown timer
    function startCountdown() {
      let timeLeft = showDuration;
      timerDiv.style.display = 'block';
      timerDiv.textContent = `Shorts visible for ${timeLeft} seconds`;
  
      countdownInterval = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Shorts visible for ${timeLeft} seconds`;
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          timerDiv.style.display = 'none';
          chrome.storage.local.set({ shortsBlocked: true }, () => {
            toggleButton.style.left = '0px';
            toggleButton.style.top = '0px';
            toggleButton.textContent = 'Show Shorts';
            messageDiv.style.display = 'block';
            messageDiv.innerHTML = `
              <span class="highlight">TIMEOUT HACKER</span> Shorts are 404d again<br>
              Your RAM just sighed in relief and your uptime is back to <span class="highlight">1337 percent</span><br>
              No more 30 second traps go ping the universe instead
            `;
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                chrome.tabs.reload(tabs[0].id);
              }
            });
          });
        }
      }, 1000);
    }
  
    // Handle button click
    toggleButton.addEventListener('click', () => {
      if (!isConfirming) {
        isConfirming = true;
        confirmMessage.style.display = 'block';
        messageDiv.style.display = 'none';
        timerDiv.style.display = 'none';
        moveButtonRandomly();
      } else {
        isConfirming = false;
        confirmMessage.style.display = 'none';
        toggleButton.style.left = '0px';
        toggleButton.style.top = '0px';
  
        chrome.storage.local.get(['shortsBlocked'], (result) => {
          const isBlocked = result.shortsBlocked !== undefined ? result.shortsBlocked : true;
          const newState = !isBlocked;
  
          chrome.storage.local.set({ shortsBlocked: newState }, () => {
            toggleButton.textContent = newState ? 'Show Shorts' : 'Hide Shorts';
  
            if (countdownInterval) {
              clearInterval(countdownInterval);
              timerDiv.style.display = 'none';
            }
  
            if (!newState) {
              messageDiv.style.display = 'block';
              messageDiv.innerHTML = `
                <span class="highlight">OH NO HACKER</span> Youve un 404d the Shorts<br>
                Your CPU is crying in binary and your uptime just dropped to <span class="highlight">0.0001 percent</span><br>
                Hope you enjoy the 30 second chaos dont say I didnt warn you
              `;
              startCountdown();
            } else {
              messageDiv.style.display = 'block';
              messageDiv.innerHTML = `
                <span class="highlight">TIMEOUT HACKER</span> Shorts are 404d again<br>
                Your RAM just sighed in relief and your uptime is back to <span class="highlight">1337 percent</span><br>
                No more 30 second traps go ping the universe instead
              `;
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                  chrome.tabs.reload(tabs[0].id);
                }
              });
            }
          });
        });
      }
    });
  });
