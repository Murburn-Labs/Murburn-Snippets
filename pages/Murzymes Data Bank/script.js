document.addEventListener('DOMContentLoaded', function() {
  // Get theme elements
  const checkbox = document.querySelector("#hide_checkbox");
  const body = document.body;
  const footerLogo = document.getElementById("footerLogo");
  const headerLogo = document.getElementById("headerLogo");
  const gitLogo = document.getElementById("gitlogo");

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add("dark");
    body.classList.remove("light");
    checkbox.checked = true;
    // Update logos for dark theme
    if (footerLogo) footerLogo.src = "../../images/logo_dark.webp";
    if (headerLogo) headerLogo.src = "../../images/logo_dark.webp";
    if (gitLogo) gitLogo.src = "../../images/github-dark.webp";
  }

  // Theme toggle event listener
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      body.classList.add("dark");
      body.classList.remove("light");
      localStorage.setItem('theme', 'dark');
      // Update logos for dark theme
      if (footerLogo) footerLogo.src = "../../images/logo_dark.webp";
      if (headerLogo) headerLogo.src = "../../images/logo_dark.webp";
      if (gitLogo) gitLogo.src = "../../images/github-dark.webp";
    } else {
      body.classList.remove("dark");
      body.classList.add("light");
      localStorage.setItem('theme', 'light');
      // Update logos for light theme
      if (footerLogo) footerLogo.src = "../../images/logo.webp";
      if (headerLogo) headerLogo.src = "../../images/favicon.ico";
      if (gitLogo) gitLogo.src = "../../images/github-light.webp";
    }
  });
  
  // Header search functionality
  const searchBtn = document.getElementById('searchButton');
  const searchContainer = document.getElementById('searchContainer');
  const searchInputHeader = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');

  if (searchBtn && searchContainer && searchInputHeader) {
    // Toggle search container visibility
    searchBtn.addEventListener('click', function() {
      searchBtn.style.display = 'none';
      searchContainer.style.display = 'flex';
      searchInputHeader.focus();
      searchInputHeader.value = ''; // Clear input when opening
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(event) {
      if (!searchContainer.contains(event.target) && event.target !== searchBtn) {
        searchContainer.style.display = 'none';
        searchBtn.style.display = 'block';
        searchInputHeader.value = ''; // Clear input when closed
      }
    });
    
    // Handle search icon click
    if (searchIcon) {
      searchIcon.addEventListener('click', function() {
        const query = searchInputHeader.value.trim();
        if (query) {
          // Clear the search input after searching
          searchInputHeader.value = '';
          
          // Close search container and show button
          searchContainer.style.display = 'none';
          searchBtn.style.display = 'block';
          
          // Set the main search input value
          const pdbSearchInput = document.getElementById('pdbSearchInput');
          if (pdbSearchInput) {
            pdbSearchInput.value = query;
            // Use the right scope for performSearch
            const searchButton = document.getElementById('pdbSearchButton');
            if (searchButton) {
              searchButton.click(); // Trigger the search button click
            }
          }
        }
      });
    }
    
    // Handle enter key press in header search
    searchInputHeader.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        const query = searchInputHeader.value.trim();
        if (query) {
          // Clear the search input after searching
          searchInputHeader.value = '';
          
          // Close search container and show button
          searchContainer.style.display = 'none';
          searchBtn.style.display = 'block';
          
          // Set the main search input value
          const pdbSearchInput = document.getElementById('pdbSearchInput');
          if (pdbSearchInput) {
            pdbSearchInput.value = query;
            // Use the right scope for performSearch
            const searchButton = document.getElementById('pdbSearchButton');
            if (searchButton) {
              searchButton.click(); // Trigger the search button click
            }
          }
        }
      }
    });
  }

  // Handle any query parameters (for search redirects)
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  if (query) {
    const pdbSearchInput = document.getElementById('pdbSearchInput');
    if (pdbSearchInput) {
      pdbSearchInput.value = query;
      
      // Execute search after a small delay to ensure the page is ready
      setTimeout(() => {
        const searchButton = document.getElementById('pdbSearchButton');
        if (searchButton) {
          searchButton.click(); // Use button click to trigger search
        } else {
          // If button not found, try to execute search directly
          async function directSearch() {
            try {
              const API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
              const response = await fetch(`${API_BASE_URL}/search_datapoint/${query}`);
              
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              
              const data = await response.json();
              
              if (data && Array.isArray(data) && data.length > 0) {
                const searchResults = document.getElementById('searchResults');
                if (searchResults) {
                  // Display results directly
                  searchResults.innerHTML = '';
                  const resultsHeading = document.createElement('h2');
                  resultsHeading.textContent = `Search Results (${data.length})`;
                  searchResults.appendChild(resultsHeading);
                  
                  data.forEach(result => {
                    const [pdbId, features, classification] = result;
                    
                    const resultCard = document.createElement('div');
                    resultCard.className = 'result-card';
                    
                    resultCard.innerHTML = `
                      <h3>${pdbId}</h3>
                      <div class="result-details">
                        <div class="detail-group">
                          <span class="detail-label">Classification:</span>
                          <span class="detail-value ${classification.toLowerCase() === 'murzyme' ? 'classification-murzyme' : 'classification-non-murzyme'}">${classification}</span>
                        </div>
                        <div class="detail-group">
                          <span class="detail-label">Features:</span>
                          <span class="detail-value">This protein has ${features.length} feature sets</span>
                        </div>
                      </div>
                      <div class="result-actions">
                        <a href="https://www.rcsb.org/structure/${pdbId}" target="_blank" class="action-button view-button">View on RCSB PDB</a>
                        <button class="action-button download-button" data-id="${pdbId}">Download PDB File</button>
                      </div>
                    `;
                    
                    searchResults.appendChild(resultCard);
                    
                    // Add download button handler
                    const downloadButton = resultCard.querySelector('.download-button');
                    downloadButton.addEventListener('click', () => {
                      window.open(`https://files.rcsb.org/download/${pdbId}.pdb`, '_blank');
                    });
                  });
                  
                  // Scroll to results
                  searchResults.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                const searchResults = document.getElementById('searchResults');
                if (searchResults) {
                  searchResults.innerHTML = `<div class="error-message">No results found for ${query}</div>`;
                  searchResults.scrollIntoView({ behavior: 'smooth' });
                }
              }
            } catch (error) {
              console.error('Error in direct search:', error);
              const searchResults = document.getElementById('searchResults');
              if (searchResults) {
                searchResults.innerHTML = `<div class="error-message">Failed to search for ${query}</div>`;
                searchResults.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
          
          directSearch();
        }
      }, 300);
    }
  }

  // Search functionality
  const searchInput = document.getElementById('pdbSearchInput');
  const searchButton = document.getElementById('pdbSearchButton');
  const searchResults = document.getElementById('searchResults');
  const API_BASE_URL = window.location.protocol + '//' + window.location.hostname; // Backend API base URL

  if (searchButton && searchInput && searchResults) {
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim().toUpperCase();
      if (query) {
        performSearch(query);
      } else {
        showError('Please enter a PDB ID to search');
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim().toUpperCase();
        if (query) {
          performSearch(query);
        } else {
          showError('Please enter a PDB ID to search');
        }
      }
    });

    async function performSearch(query) {
      searchResults.innerHTML = '<div class="loading">Searching for PDB ID: ' + query + '...</div>';
      
      try {
        // Call the backend API to search for datapoints
        const response = await fetch(`${API_BASE_URL}/search_datapoint/${query}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          displaySearchResults(data);
        } else {
          showError('No results found for ' + query);
        }
      } catch (error) {
        console.error('Error searching for datapoint:', error);
        showError('Failed to fetch data. Please try again later.');
      }
    }

    function displaySearchResults(results) {
      searchResults.innerHTML = '';
      
      if (results.length === 0) {
        showError('No results found');
        return;
      }
      
      const resultsHeading = document.createElement('h2');
      resultsHeading.textContent = `Search Results (${results.length})`;
      searchResults.appendChild(resultsHeading);
      
      results.forEach(result => {
        const [pdbId, features, classification] = result;
        
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        
        resultCard.innerHTML = `
          <h3>${pdbId}</h3>
          <div class="result-details">
            <div class="detail-group">
              <span class="detail-label">Classification:</span>
              <span class="detail-value ${classification.toLowerCase() === 'murzyme' ? 'classification-murzyme' : 'classification-non-murzyme'}">${classification}</span>
            </div>
            <div class="detail-group">
              <span class="detail-label">Features:</span>
              <span class="detail-value">This protein has ${features.length} feature sets</span>
            </div>
          </div>
          <div class="result-actions">
            <a href="https://www.rcsb.org/structure/${pdbId}" target="_blank" class="action-button view-button">View on RCSB PDB</a>
            <button class="action-button download-button" data-id="${pdbId}">Download PDB File</button>
          </div>
        `;
        
        searchResults.appendChild(resultCard);
        
        // Add event listener for download button
        const downloadButton = resultCard.querySelector('.download-button');
        downloadButton.addEventListener('click', () => {
          window.open(`https://files.rcsb.org/download/${pdbId}.pdb`, '_blank');
        });
      });
    }

    function showError(message) {
      searchResults.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }

  // Load all PDBs from API
  async function loadFeaturedPDBs() {
    const container = document.getElementById('adv-cards-container');
    if (!container) return;
    
    container.innerHTML = '<h3>PDB Structures Database</h3><div class="loading">Loading PDB structures...</div>';
    
    try {
      const API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
      const response = await fetch(`${API_BASE_URL}/getAllDatapoints`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      displayFeaturedPDBs(data);
    } catch (error) {
      console.error('Error loading featured PDBs:', error);
      container.innerHTML = '<h3>PDB Structures Database</h3><div class="error-message">Failed to load PDB structures. Please refresh the page.</div>';
      
      // Fallback to sample data if API fails
      const fallbackData = {
        murzymes: [
          ['1AKD', Array(4).fill([])],
          ['1BVR', Array(4).fill([])],
          ['1CPO', Array(4).fill([])],
          ['1DXW', Array(4).fill([])]
        ],
        'non-murzymes': [
          ['3A5K', Array(4).fill([])],
          ['4B2N', Array(4).fill([])],
          ['5EK0', Array(4).fill([])]
        ]
      };
      displayFeaturedPDBs(fallbackData);
    }
  }
  
  // Display PDBs from API data with pagination
  function displayFeaturedPDBs(data) {
    const container = document.getElementById('adv-cards-container');
    if (!container) return;
    
    // Store all data in a global variable for pagination
    window.allPdbData = data;
    
    // Create container for database stats
    const statsContainer = document.createElement('div');
    statsContainer.className = 'database-stats';
    statsContainer.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${data.murzymes.length}</div>
        <div class="stat-label">Murzymes</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${data['non-murzymes'].length}</div>
        <div class="stat-label">Non-Murzymes</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${data.murzymes.length + data['non-murzymes'].length}</div>
        <div class="stat-label">Total Entries</div>
      </div>
    `;
    
    // Create category tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'category-tabs';
    tabsContainer.innerHTML = `
      <button class="tab-button active" data-category="all">All</button>
      <button class="tab-button" data-category="murzyme">Murzymes</button>
      <button class="tab-button" data-category="non-murzyme">Non-Murzymes</button>
    `;
    
    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'pdb-cards-container';
    
    // Create pagination controls
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-controls';
    paginationContainer.innerHTML = `
      <button id="prev-page" disabled>Previous</button>
      <span id="page-indicator">Page 1</span>
      <button id="next-page">Next</button>
    `;
    
    // Clear and add new elements to container
    container.innerHTML = '<h3>PDB Structures Database</h3>';
    container.appendChild(statsContainer);
    container.appendChild(tabsContainer);
    container.appendChild(cardsContainer);
    container.appendChild(paginationContainer);
    
    // Initialize pagination state
    window.pdbPagination = {
      currentPage: 1,
      itemsPerPage: 8,
      currentCategory: 'all'
    };
    
    // Display first page of items
    displayPdbPage();
    
    // Add event listeners for tabs
    const tabs = container.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update category and reset to first page
        window.pdbPagination.currentCategory = tab.getAttribute('data-category');
        window.pdbPagination.currentPage = 1;
        
        // Update display
        displayPdbPage();
      });
    });
    
    // Add event listeners for pagination
    const prevButton = container.querySelector('#prev-page');
    const nextButton = container.querySelector('#next-page');
    
    prevButton.addEventListener('click', () => {
      if (window.pdbPagination.currentPage > 1) {
        window.pdbPagination.currentPage--;
        displayPdbPage();
      }
    });
    
    nextButton.addEventListener('click', () => {
      const totalPages = Math.ceil(getFilteredItems().length / window.pdbPagination.itemsPerPage);
      if (window.pdbPagination.currentPage < totalPages) {
        window.pdbPagination.currentPage++;
        displayPdbPage();
      }
    });
  }
  
  // Helper function to get filtered items based on current category
  function getFilteredItems() {
    const data = window.allPdbData;
    if (!data) return [];
    
    let items = [];
    if (window.pdbPagination.currentCategory === 'all' || window.pdbPagination.currentCategory === 'murzyme') {
      items = items.concat(data.murzymes.map(item => ({...item, type: 'Murzyme'})));
    }
    
    if (window.pdbPagination.currentCategory === 'all' || window.pdbPagination.currentCategory === 'non-murzyme') {
      items = items.concat(data['non-murzymes'].map(item => ({...item, type: 'Non-Murzyme'})));
    }
    
    return items;
  }
  
  // Function to display the current page of PDB items
  function displayPdbPage() {
    const cardsContainer = document.querySelector('.pdb-cards-container');
    const pageIndicator = document.getElementById('page-indicator');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (!cardsContainer || !window.allPdbData) return;
    
    // Get filtered items
    const items = getFilteredItems();
    
    // Calculate pagination
    const { currentPage, itemsPerPage } = window.pdbPagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    // Update page indicator
    if (pageIndicator) {
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    // Update button states
    if (prevButton) {
      prevButton.disabled = currentPage <= 1;
    }
    
    if (nextButton) {
      nextButton.disabled = currentPage >= totalPages;
    }
    
    // Clear container
    cardsContainer.innerHTML = '';
    
    // Get current page items
    const currentItems = items.slice(startIndex, endIndex);
    
    // Display current page items
    if (currentItems.length === 0) {
      cardsContainer.innerHTML = '<div class="no-results">No PDB structures found</div>';
      return;
    }
    
    currentItems.forEach(item => {
      const pdbId = item[0];
      const type = item.type;
      
      const card = document.createElement('div');
      card.className = 'pdb-card';
      card.innerHTML = `
        <div class="pdb-id">${pdbId}</div>
        <div class="pdb-type ${type.toLowerCase() === 'murzyme' ? 'type-murzyme' : 'type-non-murzyme'}">${type}</div>
        <div class="pdb-actions">
          <button class="view-details" data-id="${pdbId}">View Details</button>
          <a href="https://www.rcsb.org/structure/${pdbId}" target="_blank" class="external-link">
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      `;
      
      cardsContainer.appendChild(card);
      
      // Add event listener for view details button
      const viewButton = card.querySelector('.view-details');
      viewButton.addEventListener('click', () => {
        const searchInput = document.getElementById('pdbSearchInput');
        if (searchInput) {
          searchInput.value = pdbId;
          
          // Use the search button click to trigger search
          const searchButton = document.getElementById('pdbSearchButton');
          if (searchButton) {
            searchButton.click();
            
            // Scroll to results
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
              searchResults.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // Initialize featured PDBs
  loadFeaturedPDBs();
});