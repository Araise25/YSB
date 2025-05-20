let shortsBlocked = true;

// Function to hide or show YouTube Shorts based on toggle state
function toggleYouTubeShorts() {
  // Hide Shorts shelves by title
  const shortsShelves = document.querySelectorAll('ytd-rich-shelf-renderer');
  shortsShelves.forEach(shelf => {
    const titleElement = shelf.querySelector('#title');
    if (titleElement && titleElement.textContent.trim() === 'Shorts') {
      shelf.style.display = shortsBlocked ? 'none' : '';
    }
  });

  // Hide individual Shorts items
  const shortsItems = document.querySelectorAll(
    'ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2, ytd-reel-shelf-renderer, ytd-shorts, [is-shorts]'
  );
  shortsItems.forEach(item => {
    item.style.display = shortsBlocked ? 'none' : '';
  });

  // Hide Shorts navigation link
  const shortsNav = document.querySelector('a[title="Shorts"]');
  if (shortsNav) {
    shortsNav.parentElement.style.display = shortsBlocked ? 'none' : '';
  }

  // Hide Shorts videos in search, recommendations, or grids
  const shortsVideos = document.querySelectorAll(
    'ytd-video-renderer:has([is-shorts]), ytd-grid-video-renderer:has([is-shorts]), ytd-video-renderer:has(badge-shape .badge-shape-wiz__text), ytd-grid-video-renderer:has(badge-shape .badge-shape-wiz__text)'
  );
  shortsVideos.forEach(video => {
    video.style.display = shortsBlocked ? 'none' : '';
  });
}

// Load initial state from storage
chrome.storage.local.get(['shortsBlocked'], (result) => {
  shortsBlocked = result.shortsBlocked !== undefined ? result.shortsBlocked : true;
  toggleYouTubeShorts();
});

// Listen for storage changes to toggle Shorts dynamically
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.shortsBlocked) {
    shortsBlocked = changes.shortsBlocked.newValue;
    toggleYouTubeShorts();
  }
});

// Use MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(toggleYouTubeShorts);
observer.observe(document.body, { childList: true, subtree: true });