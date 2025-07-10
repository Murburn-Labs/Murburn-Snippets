/**
 * Responsive navigation script for Murburn Explorer
 * Handles mobile menu, hamburger toggle, and responsive adjustments
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get or create hamburger menu button for mobile
  const navLinks = document.querySelector('.nav-links');
  const headerContainer = document.querySelector('.header-container');
  
  // Check if mobile menu toggle already exists
  let mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
  
  // If not, create it
  if (!mobileMenuBtn) {
    mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-toggle');
    mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
    
    // Insert the button in the right position
    if (headerContainer) {
      // Insert right after the theme toggle container with no space
      const toggleContainer = headerContainer.querySelector('.toggle-container');
      if (toggleContainer) {
        // This ensures the menu is immediately adjacent to the toggle
        toggleContainer.insertAdjacentElement('afterend', mobileMenuBtn);
      } else {
        // Fallback: insert before nav links
        headerContainer.insertBefore(mobileMenuBtn, navLinks);
      }
    }
  }
  
  // Toggle mobile menu on click
  mobileMenuBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent the click from bubbling
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = navLinks && navLinks.contains(event.target);
    const isClickOnToggle = mobileMenuBtn && mobileMenuBtn.contains(event.target);
    
    if (navLinks && !isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
  });
  
  // Make search box responsive
  const searchButton = document.getElementById('searchButton');
  const searchContainer = document.getElementById('searchContainer');
  
  if (searchButton && searchContainer) {
    // Adjust search functionality for mobile
    searchButton.addEventListener('click', function(e) {
      e.stopPropagation();
      searchButton.style.display = 'none';
      searchContainer.style.display = 'flex';
      const searchInput = searchContainer.querySelector('input');
      if (searchInput) {
        searchInput.classList.add('expanded');
        searchInput.focus();
      }
      
      // On mobile, close the nav menu when opening search
      if (window.innerWidth <= 768 && navLinks) {
        navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
      if (searchContainer && !searchContainer.contains(e.target) && e.target !== searchButton) {
        searchButton.style.display = 'block';
        searchContainer.style.display = 'none';
        const searchInput = searchContainer.querySelector('input');
        if (searchInput) {
          searchInput.classList.remove('expanded');
          searchInput.value = ''; // Clear input when closed
        }
      }
    });
  }
  
  // Make plot selection responsive on plots page
  const featureSelects = document.querySelectorAll('.feature-select');
  if (featureSelects.length > 0) {
    featureSelects.forEach(select => {
      // Ensure touch-friendly select boxes
      select.classList.add('touch-friendly');
    });
  }
  
  // Add swipe functionality for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleGesture() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left - close menus
      if (navLinks) navLinks.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      if (searchContainer) searchContainer.style.display = 'none';
      if (searchButton) searchButton.style.display = 'block';
    }
  }
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });
  
  // Force mobile menu to appear on small screens
  if (window.innerWidth <= 768) {
    // Ensure the mobile menu button is visible
    if (mobileMenuBtn) {
      mobileMenuBtn.style.display = 'block';
    }
  }
});