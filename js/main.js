document.addEventListener('DOMContentLoaded', function() {
  // Counters animation
  function countAnimation(targetNumber, elementId, duration) {
    const element = document.getElementById(elementId);
    if (!element) return; // Prevent error if element doesn't exist

    const steps = 100;
    const stepDuration = duration / steps; 
    const stepIncrement = targetNumber / steps; 
    
    let currentNumber = 0;
    const startTime = Date.now();

    function update() {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1); 
      currentNumber = Math.round(progress * targetNumber);

      if (elementId === 'count2') {
        element.textContent = currentNumber.toLocaleString() + '%';
      } else {
        element.textContent = currentNumber.toLocaleString() + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(update); 
      }
    }

    update(); 
  }

  // Initialize counters if they exist
  if (document.getElementById('count1')) {
    countAnimation(500, 'count1', 2000);
  }
  if (document.getElementById('count2')) {
    countAnimation(85, 'count2', 2000);
  }

  // Theme toggle functionality
  const checkbox = document.querySelector("#hide_checkbox");
  if (checkbox) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
      body.classList.add("dark");
      body.classList.remove("light");
      checkbox.checked = true;
      updateLogos('dark');
    } else {
      body.classList.add("light");
      body.classList.remove("dark");
      checkbox.checked = false;
      updateLogos('light');
    }

    // Theme toggle event listener
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        body.classList.add("dark");
        body.classList.remove("light");
        localStorage.setItem('theme', 'dark');
        updateLogos('dark');
      } else {
        body.classList.remove("dark");
        body.classList.add("light");
        localStorage.setItem('theme', 'light');
        updateLogos('light');
      }
    });
  }

  // Function to update logos based on theme
  function updateLogos(theme) {
    const gitLogo = document.getElementById("gitlogo");
    const footerLogo = document.getElementById("footerLogo");
    const topLogo = document.getElementById("topLogo");

    if (gitLogo) {
      gitLogo.src = theme === 'dark' ? "images/github-dark.webp" : "images/github-light.webp";
    }
    
    if (footerLogo) {
      footerLogo.src = theme === 'dark' ? "images/logo_dark.webp" : "images/logo.webp";
    }
    
    // Don't update the top logo as it's using favicon.ico in original code
  }

  // Search functionality
  const searchButton = document.getElementById('searchButton');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');
  
  if (searchButton && searchContainer && searchInput && searchIcon) {
    searchButton.addEventListener('click', () => {
      searchButton.style.display = 'none';
      searchContainer.style.display = 'flex';
      searchInput.classList.add('expanded');
      searchInput.focus();
    });

    searchIcon.addEventListener('click', () => {
      performSearch();
      closeSearchBox();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
        closeSearchBox();
      }
    });

    function closeSearchBox() {
      searchButton.style.display = 'block';
      searchContainer.style.display = 'none';
      searchInput.classList.remove('expanded');
      searchInput.blur();
    }

    function performSearch() {
      const query = searchInput.value.trim().toUpperCase();
      if (query) {
        // Redirect to the data bank page with the query
        window.location.href = `pages/Murzymes Data Bank/Murzymes Data Bank.html?query=${query}`;
      }
    }
  }

  // Generate literature cards for homepage
  function generateLiteratureCards() {
    const advSection = document.getElementById('advSection');
    if (!advSection) return;

    // Literature database
    const articles = [
      { title: "Heme redox-enzymology via DRS", link: "https://doi.org/10.1016/j.biochi.2016.03.003" },
      { title: "Flavin redox-enzymology via DRS", link: "https://doi.org/10.1371/journal.pone.0013272" },
      { title: "Electron transfer outside active site", link: "https://doi.org/10.1021/bi7022656" },
      { title: "Moiety-transfer by DRS", link: "https://doi.org/10.1016/j.bbapap.2006.05.012" },
      { title: "Inter-molecular biological electron transfers by DRS", link: "https://doi.org/10.1016/j.bbrc.2014.10.137" },
      { title: "Intra-molecular biological electron transfers by DRS", link: "https://doi.org/10.1002/cbf.3682" },
      { title: "Even mM H2O2 doesn't deactivate CPO", link: "https://doi.org/10.1016/S0167-4838(01)00210-2" },
      { title: "Diversity of substrates and inhibitions of murzymes", link: "https://doi.org/10.1371/journal.pone.0010601" },
      { title: "Unusual stoichiometry/dose responses", link: "https://doi.org/10.1177/1559325818774421" },
      { title: "Drug/xenobiotic metabolism & homeostasis", link: "https://doi.org/10.3389/fphar.2016.00161" },
      { title: "Respiration & homeostasis", link: "https://doi.org/10.1016/j.pbiomolbio.2021.05.010" },
      { title: "Fat and overall energy metabolism", link: "https://doi.org/10.14748/adipo.v10.6534" }
    ];

    // Function to get a random image
    function getRandomImage() {
      const images = [
        'images/1.jpg', 
        'images/2.jpg', 
        'images/3.jpg', 
        'images/4.jpg'
      ];
      return images[Math.floor(Math.random() * images.length)];
    }

    // Generate HTML for each article
    advSection.innerHTML = '';
    
    articles.forEach(article => {
      const advCard = document.createElement('div');
      advCard.className = 'adv-card';

      advCard.innerHTML = `
        <a href="${article.link}" target="_blank" class="adv-card-link">
          <div class="image-container">
            <img src="${getRandomImage()}" alt="${article.title}" />
          </div>
          <div class="adv-desc margin-0">${article.title}</div>
        </a>
      `;

      advSection.appendChild(advCard);
    });
  }

  // Initialize literature cards if on the homepage
  generateLiteratureCards();
});