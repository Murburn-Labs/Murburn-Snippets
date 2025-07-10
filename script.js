document.addEventListener('DOMContentLoaded', function() {
  // Typing animation effect for the homepage
  const typedTextSpan = document.querySelector(".typed_text");
  if (typedTextSpan) {
    const textArray = ["Cellular Biology", "Redox Reactions", "Enzyme Research", "Minutes!"];
    const typingDelay = 150;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        // Text finished typing, wait before erasing
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        // Text completely erased, move to next text
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    // Start the typing animation
    setTimeout(type, newTextDelay + 250);
  }

  // Theme toggle functionality
  const checkbox = document.querySelector("#hide_checkbox");
  if (checkbox) {
    const body = document.body;
    const footerLogo = document.getElementById('footerLogo');
    const gitLogo = document.getElementById('gitlogo');
    const headerLogo = document.querySelector('.logo img') || document.getElementById('headerLogo');
    
    // Function to fix paths for different pages
    function getCorrectPath(imagePath) {
      // Check if we're in a subpage by looking for '../' in the current src
      if (headerLogo && headerLogo.src && headerLogo.src.includes('/pages/')) {
        return '../../' + imagePath;
      }
      return imagePath;
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add("dark");
      body.classList.remove("light");
      checkbox.checked = true;
      
      // Update logos for dark theme
      if (footerLogo) footerLogo.src = getCorrectPath('images/logo_dark.webp');
      if (gitLogo) gitLogo.src = getCorrectPath('images/github-dark.webp');
      if (headerLogo) headerLogo.src = getCorrectPath('images/logo_dark.webp');
    }

    // Theme toggle event listener
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        body.classList.add("dark");
        body.classList.remove("light");
        localStorage.setItem('theme', 'dark');
        
        // Update logos for dark theme
        if (footerLogo) footerLogo.src = getCorrectPath('images/logo_dark.webp');
        if (gitLogo) gitLogo.src = getCorrectPath('images/github-dark.webp');
        if (headerLogo) headerLogo.src = getCorrectPath('images/logo_dark.webp');
      } else {
        body.classList.remove("dark");
        body.classList.add("light");
        localStorage.setItem('theme', 'light');
        
        // Update logos for light theme
        if (footerLogo) footerLogo.src = getCorrectPath('images/logo.webp');
        if (gitLogo) gitLogo.src = getCorrectPath('images/github-light.webp');
        if (headerLogo) headerLogo.src = getCorrectPath('images/favicon.ico');
      }
    });
  }

  // Search functionality
  const searchButton = document.getElementById('searchButton');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');

  if (searchButton && searchContainer && searchInput) {
    searchButton.addEventListener('click', function() {
      searchButton.style.display = 'none';
      searchContainer.style.display = 'flex';
      searchInput.classList.add('expanded');
      searchInput.focus();
      searchInput.value = ''; // Clear input when opening
    });

    document.addEventListener('click', function(e) {
      // Close search if clicked outside
      if (!searchContainer.contains(e.target) && e.target !== searchButton) {
        searchButton.style.display = 'block';
        searchContainer.style.display = 'none';
        searchInput.classList.remove('expanded');
        searchInput.value = ''; // Clear input when closed
      }
    });

    if (searchIcon) {
      searchIcon.addEventListener('click', function() {
        performSearch();
      });
    }

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    function performSearch() {
      const query = searchInput.value.trim();
      if (query) {
        // Clear input and hide search before navigating
        searchInput.value = '';
        searchContainer.style.display = 'none';
        searchButton.style.display = 'block';
        window.location.href = 'pages/Murzymes Data Bank/Murzymes Data Bank.html?query=' + encodeURIComponent(query);
      } else {
        alert('Please enter a PDB ID to search');
      }
    }
  }

  // Generate literature cards
  generateLiteratureCards();

  // Count animations
  const countElements = document.querySelectorAll('[id^="count"]');
  if (countElements.length > 0) {
    countElements.forEach(element => {
      const target = element.textContent;
      countAnimation(parseInt(target), element.id, 2000);
    });
  }
});

// Count animation function
function countAnimation(targetNumber, elementId, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let startTime = null;
  const startValue = 0;
  
  function update(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    let currentValue;
    if (targetNumber.toString().includes('%')) {
      // Handle percentage
      const numericTarget = parseInt(targetNumber);
      currentValue = Math.floor(startValue + (numericTarget - startValue) * progress) + '%';
    } else {
      // Handle regular numbers
      currentValue = Math.floor(startValue + (targetNumber - startValue) * progress);
    }
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Generate literature cards dynamically
function generateLiteratureCards() {
  const literatureSection = document.getElementById('advSection');
  if (!literatureSection) return;
  
  const literatureData = [
    {
      title: "Murburn precepts for redox metabolism and aging",
      author: "Kelath Murali Manoj",
      journal: "Biogerontology (2018)",
      link: "https://pubmed.ncbi.nlm.nih.gov/29222773/"
    },
    {
      title: "Murburn concept: A paradigm shift in cellular metabolism and physiology",
      author: "Kelath Murali Manoj et al.",
      journal: "Biomol Concepts (2019)",
      link: "https://pubmed.ncbi.nlm.nih.gov/31815677/"
    },
    {
      title: "Murburn scheme for mitochondrial thermogenesis",
      author: "Kelath Murali Manoj",
      journal: "Bioenergetics (2017)",
      link: "https://pubmed.ncbi.nlm.nih.gov/29075058/"
    },
    {
      title: "Murburn model for cellular respiration: Redefining the role of mitochondria",
      author: "Kelath Murali Manoj et al.",
      journal: "Journal of Bioenergetics (2020)",
      link: "https://pubmed.ncbi.nlm.nih.gov/32500508/"
    },
    {
      title: "Chemiosmosis principle: Critique and reevaluation of the murburn concept",
      author: "Kelath Murali Manoj et al.",
      journal: "Biophysical Chemistry (2021)",
      link: "https://pubmed.ncbi.nlm.nih.gov/33723586/"
    },
    {
      title: "Oxygen-centered radical dynamics in cellular physiology",
      author: "Kelath Murali Manoj",
      journal: "Reactive Oxygen Species (2020)",
      link: "https://pubmed.ncbi.nlm.nih.gov/32558906/"
    }
  ];
  
  literatureData.forEach((paper) => {
    const card = document.createElement('div');
    card.className = 'literature-card';
    
    card.innerHTML = `
      <h3>${paper.title}</h3>
      <p class="author">${paper.author}</p>
      <p class="journal">${paper.journal}</p>
      <a href="${paper.link}" target="_blank" class="read-more">Read Paper</a>
    `;
    
    literatureSection.appendChild(card);
  });
}