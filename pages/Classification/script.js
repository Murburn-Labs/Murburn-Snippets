document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    const resultContainer = document.getElementById('resultContainer');
    const resultTitle = document.getElementById('resultTitle');
    const resultDetails = document.getElementById('resultDetails');
    const uploadBox = document.querySelector('.upload-box');
    
    // Maximum file size: 10MB in bytes
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    
    // Allowed file extensions
    const ALLOWED_EXTENSIONS = ['.pdb'];

    // Create error popup elements
    const errorPopupContainer = document.createElement('div');
    errorPopupContainer.className = 'error-popup-container';
    errorPopupContainer.style.display = 'none';
    
    const errorPopup = document.createElement('div');
    errorPopup.className = 'error-popup';
    
    const errorTitle = document.createElement('h3');
    errorTitle.textContent = 'Error';
    
    const errorMessage = document.createElement('p');
    errorMessage.id = 'error-message';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'close-error-btn';
    
    errorPopup.appendChild(errorTitle);
    errorPopup.appendChild(errorMessage);
    errorPopup.appendChild(closeButton);
    errorPopupContainer.appendChild(errorPopup);
    document.body.appendChild(errorPopupContainer);
    
    // Add event listener for closing the error popup
    closeButton.addEventListener('click', () => {
        errorPopupContainer.style.display = 'none';
    });
    
    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorPopupContainer.style.display = 'flex';
    }
    
    // Function to validate file
    function validateFile(file) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            showError(`File size exceeds the maximum limit of 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
            return false;
        }
        
        // Check file extension
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
            showError(`Unsupported file type. Only PDB files (.pdb) are allowed.`);
            return false;
        }
        
        return true;
    }

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            if (validateFile(file)) {
                fileName.textContent = file.name;
                fileInfo.style.display = 'flex';
                processPDBFile(file);
            } else {
                fileInput.value = '';
            }
        }
    });

    removeFile.addEventListener('click', () => {
        fileInput.value = "";
        fileInfo.style.display = 'none';
        resultContainer.style.display = 'none';
    });

    uploadBox.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadBox.classList.add('dragover');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
    });

    uploadBox.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadBox.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (file) {
            if (validateFile(file)) {
                fileInput.files = event.dataTransfer.files;
                fileName.textContent = file.name;
                fileInfo.style.display = 'flex';
                processPDBFile(file);
            }
        }
    });

    // Function to process and classify the PDB file using the real API
    function processPDBFile(file) {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('pdbFile', file);
        
        // Show loading state
        resultTitle.textContent = "Processing...";
        resultDetails.innerHTML = "Analyzing PDB file structure...";
        resultContainer.style.display = 'block';
        
        // Send the file to the server for classification
        fetch('/classify_pdb', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error processing PDB file');
            }
            return response.json();
        })
        .then(data => {
            // Display the classification result
            if (data.error) {
                showError(data.error);
                resultContainer.style.display = 'none';
                return;
            }
            
            const classification = data.classification;
            const details = data.details;
            
            // Update the result container
            resultTitle.textContent = classification === "Murzyme" ? 
                "It's a Murzyme 🌟" : 
                "It's NOT a Murzyme ❌";
            
            // Format the details
            let detailsHTML = "";
            
            // Don't show confidence score, but still show notes if available
            if (data.note) {
                detailsHTML += `<em>${data.note}</em><br><br>`;
            } else {
                detailsHTML += `<br>`;
            }
            
            if (details.pdb_id && details.pdb_id !== "Unknown") {
                detailsHTML += `PDB ID: ${details.pdb_id}<br>`;
            }
            if (details.title) {
                detailsHTML += `TITLE: ${details.title}<br>`;
            }
            if (details.title_continuation) {
                detailsHTML += `TITLE 2: ${details.title_continuation}<br>`;
            }
            if (details.keywords) {
                detailsHTML += `KEYWORDS: ${details.keywords}`;
            }
            
            resultDetails.innerHTML = detailsHTML;
        })
        .catch(error => {
            showError("Error processing file: " + error.message);
            resultContainer.style.display = 'none';
        });
    }
});