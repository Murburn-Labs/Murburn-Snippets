function countAnimation(targetNumber, elementId, duration) {
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
      document.getElementById(elementId).textContent = currentNumber.toLocaleString() + '%';
    } else {
      document.getElementById(elementId).textContent = currentNumber.toLocaleString() + '+';
    }

    if (progress < 1) {
      requestAnimationFrame(update); 
    }
  }

  update(); 
}


countAnimation(500, 'count1', 2000);
countAnimation(85, 'count2', 2000);

const checkbox = document.querySelector("#hide_checkbox");
let gitLogo = document.getElementById("gitlogo");
let footerLogo = document.getElementById("footerLogo");
let topLogo = document.getElementById("topLogo");

checkbox.addEventListener("change", () => {
  const body = document.body;

  if (checkbox.checked) {
    body.classList.add("dark");
    body.classList.remove("light");
    gitLogo.src = "images/github-dark.webp";
    footerLogo.src = "images/logo_dark.webp";
    topLogo.src = "images/logo_dark.webp";
   
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    gitLogo.src = "images/github-light.webp";
    footerLogo.src = "images/logo.webp";
    topLogo.src = "images/logo.webp";
  }
});


/*
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');
  const closeSearchIcon = document.getElementById('closeSearchIcon');
  const content = document.getElementById('content');
  const results = document.getElementById('results');

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

  closeSearchIcon.addEventListener('click', () => {
    closeSearchBox();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed'); 
      performSearch();
      closeSearchBox();
    }
  });

  function closeSearchBox() {
    console.log('Closing search box'); 
    searchButton.style.display = 'block';
    searchContainer.style.display = 'none';
    searchInput.classList.remove('expanded');
    searchInput.blur();
  }

  async function performSearch() {
    const query = searchInput.value.trim().toUpperCase();
    console.log('Search query:', query); 

    if (!query) {
      console.error('Error: Search input is empty');
      results.innerHTML = '<p>Error: Please enter a PDB ID to search.</p>';
      content.style.display = 'none';
      results.style.display = 'block';
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/get_pdb_details_from_rcsb/${query}`);
      console.log('Response status:', response.status); 
      if (!response.ok) {
        throw new Error('PDB ID not found');
      }

      const data = await response.json();
      console.log('Fetched data:', data); 
      displayResults([{ id: query }]);
    } catch (error) {
      console.error('Error fetching PDB details:', error);
      results.innerHTML = `<p>Error fetching PDB details: ${error.message}. Please try again.</p>`;
      content.style.display = 'none';
      results.style.display = 'block';
    }
  }

  function displayResults(resultsArray) {
    results.innerHTML = '';
    resultsArray.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
        <div>
          <h2>ID: ${result.id}</h2>
          <p></p>
        </div>
        <a href="#" class="download-button" data-id="${result.id}">Download</a>
      `;
      results.appendChild(resultItem);
    });
    content.style.display = 'none';
    results.style.display = 'block';

    // Add event listeners for download buttons
    document.querySelectorAll('.download-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const pdbId = button.getAttribute('data-id');
        await downloadFile(pdbId);
      });
    });
  }

  async function downloadFile(pdbId) {
    try {
      const response = await fetch(`http://localhost:8000/get_pdb_details_from_rcsb/${pdbId}`);
      console.log('Response status:', response.status); 
      if (!response.ok) {
        throw new Error('File not found');
      }

      const data = await response.json();
      const fileContent = data['file-content'];
      const blob = new Blob([atob(fileContent)], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdbId}.pdb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  }
});
 */
  // Sample data array for dynamic content
  const articles = [
    { title: "Heme redox-enzymology via DRS", link: " https://doi.org/10.1016/j.biochi.2016.03.003." },
    { title: "Flavin redox-enzymology via DRS", link: "https://doi.org/10.1371/journal.pone.0013272." },
    { title: "Electron transfer outside active site", link: "https://doi.org/10.1021/bi7022656." },
    { title: "Moiety-transfer by DRS", link: "https://doi.org/10.1016/j.bbapap.2006.05.012" },
    { title: "Inter-molecular biological electron transfers by DRS", link: "https://doi.org/10.1016/j.bbrc.2014.10.137" },
    { title: "Intra-molecular biological electron transfers by DRS", link: "https://doi.org/10.1002/cbf.3682" },
    { title: "Even mM H2O2 doesn’t deactivate CPO", link: "https://doi.org/10.1016/S0167-4838(01)00210-2" },
    { title: "Diversity of substrates and inhibitions of murzymes", link: "https://doi.org/10.1371/journal.pone.0010601" },
    { title: "Unusual stoichiometry/dose responses", link: "https://doi.org/10.1177/1559325818774421" },
    { title: "Drug/xenobiotic metabolism & homeostasis", link: "https://doi.org/10.3389/fphar.2016.00161" },
    { title: "Respiration & homeostasis", link: "https://doi.org/10.1016/j.pbiomolbio.2021.05.010" },
    { title: "Fat and overall energy metabolism", link: "https://doi.org/10.14748/adipo.v10.6534" },
    { title: "Acute toxicity of low amounts of cyanide", link: "https://doi.org/10.1016/j.tox.2020.152369" },
    { title: "Thermogenesis", link: "https://doi.org/10.1016/j.bbamem.2022.183981" },
    { title: "Photosynthesis", link: "https://doi.org/10.1080/07391102.2021.1953607" },
    { title: "Ionic homeostasis and electrophysiology", link: "https://doi.org/10.1002/jcp.30547" },
    { title: "Vision/photoreception and neuronal signal-relay", link: "https://doi.org/10.1002/jcp.30786" },
    { title: "Lactate dehydrogenase functioning in liver", link: "https://doi.org/10.1002/jcp.30661" },
    { title: "Hemoglobin’s role in erythrocytes", link: "https://doi.org/10.1080/07391102.2021.1925592" },
    { title: "Origin & evolution of life", link: "https://doi.org/10.14748/bmr.v29.5854; https://doi.org/10.1002/jcp.31000" },
    { title: "Dye-decolorization & haloperoxidase assay", link: "https://doi.org/10.1016/j.ab.2005.10.014" },
    { title: "Cyclooxygenase mechanism", link: "https://doi.org/10.14748/bmr.v32.8503; https://doi.org/10.31219/osf.io/t9wrn" },
    { title: "Bicarbonate-aided oxygenesis", link: "https://doi.org/10.5772/intechopen.106996" },
    { title: "Na,K-ATPase mechanism for ion-differentiation & effect of Li", link: "https://doi.org/10.1002/jcp.30925" },
    { title: "Murburn post-translational modification of proteins", link: "https://doi.org/10.1002/jcp.30954" },
    { title: "Bacterial flagella-assisted motility", link: "https://doi.org/10.1080/07391102.2023.2191146" },
    { title: "Synthesis of diverse theories/aspects of cellular function", link: "https://doi.org/10.1002/jcp.31000" },
    { title: "Futuristic crusades/agendas of murburn concept", link: "https://doi.org/10.14748/bmr.v33.9115" },
    { title: "Comprehensive view Part-1", link: "https://doi.org/10.1063/5.0171857" },
    { title: "Comprehensive view Part-2", link: "https://doi.org/10.1063/5.0171860" },
  ];

  // Function to generate a random image URL
  function getRandomImage() {
    const images = [
      'images/1.jpg', 
      'images/2.jpg', 
      'images/3.jpg', 
      'images/4.jpg'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  // Function to generate HTML for dynamic content
  function generateDynamicContent() {
    const advSection = document.getElementById('advSection');
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

  // Call the function to generate content on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    generateDynamicContent();

    // Your existing JavaScript code...
    /* function countAnimation(targetNumber, elementId, duration) {
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
          document.getElementById(elementId).textContent = currentNumber.toLocaleString() + '%';
        } else {
          document.getElementById(elementId).textContent = currentNumber.toLocaleString() + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      update();
    }

    countAnimation(500, 'count1', 2000);
    countAnimation(85, 'count2', 2000);

    const checkbox = document.querySelector("#hide_checkbox");
    let gitLogo = document.getElementById("gitlogo");
    let footerLogo = document.getElementById("footerLogo");
    let topLogo = document.getElementById("topLogo");
    let body = document.querySelector("body");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        body.classList.remove("light");
        body.classList.add("dark");
        gitLogo.src = "images/github-mark-white.webp";
        footerLogo.src = "images/logo-white.webp";
        topLogo.src = "images/logo-white.webp";
      } else {
        body.classList.remove("dark");
        body.classList.add("light");
        gitLogo.src = "images/github-light.webp";
        footerLogo.src = "images/logo.webp";
        topLogo.src = "images/logo.webp";
      }
    }); */

    const searchButton = document.getElementById('searchButton');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const closeSearchIcon = document.getElementById('closeSearchIcon');
    const content = document.getElementById('content');
    const results = document.getElementById('results');

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

    closeSearchIcon.addEventListener('click', () => {
      closeSearchBox();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        console.log('Enter key pressed');
        performSearch();
        closeSearchBox();
      }
    });

    function closeSearchBox() {
      console.log('Closing search box');
      searchButton.style.display = 'block';
      searchContainer.style.display = 'none';
      searchInput.classList.remove('expanded');
      searchInput.blur();
    }

    async function performSearch() {
      const query = searchInput.value.trim().toUpperCase();
      console.log('Search query:', query);

      if (!query) {
        console.error('Error: Search input is empty');
        results.innerHTML = '<p>Error: Please enter a PDB ID to search.</p>';
        content.style.display = 'none';
        results.style.display = 'block';
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/get_pdb_details_from_rcsb/${query}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('PDB ID not found');
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        displayResults([{ id: query }]);
      } catch (error) {
        console.error('Error fetching PDB details:', error);
        results.innerHTML = `<p>Error fetching PDB details: ${error.message}. Please try again.</p>`;
        content.style.display = 'none';
        results.style.display = 'block';
      }
    }

    function displayResults(resultsArray) {
      results.innerHTML = '';
      resultsArray.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
          <div>
            <h2>ID: ${result.id}</h2>
            <p></p>
          </div>
          <a href="#" class="download-button" data-id="${result.id}">Download</a>
        `;
        results.appendChild(resultItem);
      });
      content.style.display = 'none';
      results.style.display = 'block';

      // Add event listeners for download buttons
      document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', async (event) => {
          event.preventDefault();
          const pdbId = button.getAttribute('data-id');
          await downloadFile(pdbId);
        });
      });
    }

    async function downloadFile(pdbId) {
      try {
        const response = await fetch(`http://localhost:8000/get_pdb_details_from_rcsb/${pdbId}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('File not found');
        }

        const data = await response.json();
        const fileContent = data['file-content'];
        const blob = new Blob([atob(fileContent)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pdbId}.pdb`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file. Please try again.');
      }
    }
  });