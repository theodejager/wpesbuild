if (!window.IS_PRODUCTION) {
	const esbuildHost = 'http://localhost:3001';
	const eventSource = new EventSource(`${esbuildHost}/esbuild`);

	eventSource.addEventListener('change', e => {
	  console.log('Change event received:', e.data);

	  const { added, removed, updated } = JSON.parse(e.data);

	  let cssUpdated = false;

	  updated.forEach(updatedFile => {
		 if (updatedFile.endsWith('.css')) {
			cssUpdated = true;
			updateCSS(updatedFile);
		 } else if (updatedFile.endsWith('.js')) {
			console.log('Reloading page for JS update...');
			location.reload();
			return; // Exit function to avoid further processing
		 }
	  });

	  // If only CSS was updated, log and continue without reloading page
	  if (cssUpdated) {
		 console.log('CSS updated, no page reload needed.');
		 return;
	  }

	  // If no updates detected, fallback to full page reload
	  console.log('No updates detected, reloading page...');
	  location.reload();
	});

	eventSource.addEventListener('error', err => {
	  //console.error('EventSource error:', err);
	});
 }

// Function to update CSS dynamically
function updateCSS(updatedFile) {
	const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');

	cssLinks.forEach(link => {
	  if (link.href.includes(updatedFile)) {
		 console.log('Updating CSS:', updatedFile);

		 const newLinkUrl = updateUrlForCacheBusting(link.href);
		 const newLink = document.createElement('link');
		 newLink.href = newLinkUrl;
		 newLink.rel = 'stylesheet';

		 newLink.onload = () => {
			if (link.parentNode) {
			  link.parentNode.insertBefore(newLink, link.nextSibling);
			  setTimeout(() => {
				if ( link.parentNode) {
					link.parentNode.removeChild(link);
				}

				 console.log('CSS updated:', updatedFile);
			  }, 100); // Adjust delay if necessary
			} else {
			  console.warn('Parent node of link element is null, cannot replace CSS.');
			}
		 };

		 document.head.appendChild(newLink);
	  }
	});
 }

 // Function to update URL with cache-busting parameter
 function updateUrlForCacheBusting(url) {
	const urlObj = new URL(url);
	urlObj.searchParams.set('_', Date.now());
	return urlObj.href;
 }
