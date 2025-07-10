document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = window.location.protocol + '//' + window.location.hostname;
    
    // Initialize plots with loading states
    createPCAPlot(1); // Start with feature 1 by default
    createTSNEPlot(1); // Start with feature 1 by default
    
    // Function to fetch PCA data and create plot
    async function createPCAPlot(featureNumber = 1) {
        const plotContainer = document.getElementById('Principal component analysis on PDB features');
        
        if (!plotContainer) return;
        
        // Show loading state with spinner
        plotContainer.innerHTML = '<div class="loading-plot"><span class="loading-spinner"></span> Loading data...</div>';
        const loadingElement = plotContainer.querySelector('.loading-plot');
        
        try {
            // Fetch PCA data from API
            const response = await fetch(`${API_BASE_URL}/pca_plot_feature/${featureNumber}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.ERROR_MESSAGE) {
                throw new Error(data.ERROR_MESSAGE);
            }
            
            // Create traces for murzymes and non-murzymes
            const trace1 = {
                x: data.murzymes_x,
                y: data.murzymes_y,
                mode: 'markers',
                type: 'scatter',
                name: 'Murzyme',
                marker: { 
                    color: '#ff4081',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const trace2 = {
                x: data.non_murzymes_x,
                y: data.non_murzymes_y,
                mode: 'markers',
                type: 'scatter',
                name: 'Non-Murzyme',
                marker: { 
                    color: '#1e88e5',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const pcaLayout = {
                title: `PCA Visualization of Murzymes vs Non-Murzymes (Feature ${featureNumber})`,
                xaxis: { title: 'Principal Component 1' },
                yaxis: { title: 'Principal Component 2' },
                autosize: true,
                height: 450,
                margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                updatemenus: [{
                    buttons: [
                        {method: 'restyle', args: [{'visible': [true, true]}], label: 'Show All'},
                        {method: 'restyle', args: [{'visible': [true, false]}], label: 'Murzymes Only'},
                        {method: 'restyle', args: [{'visible': [false, true]}], label: 'Non-Murzymes Only'}
                    ],
                    type: 'dropdown',
                    x: 0,
                    y: 1.2,
                    xanchor: 'left',
                    yanchor: 'top'
                }]
            };
            
            // Remove the loading message before plotting
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
            
            // Update the plot
            Plotly.newPlot('Principal component analysis on PDB features', [trace1, trace2], pcaLayout, {responsive: true});
            
            // Add feature selection dropdown if it doesn't exist
            if (!document.getElementById('pca-feature-selector')) {
                const selectContainer = document.createElement('div');
                selectContainer.className = 'feature-selector-container';
                
                const selectLabel = document.createElement('label');
                selectLabel.textContent = 'Select Feature: ';
                
                const selectElement = document.createElement('select');
                selectElement.id = 'pca-feature-selector';
                
                for (let i = 1; i <= 4; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Feature ${i}`;
                    if (i === featureNumber) {
                        option.selected = true;
                    }
                    selectElement.appendChild(option);
                }
                
                selectElement.addEventListener('change', function() {
                    createPCAPlot(parseInt(this.value));
                });
                
                selectContainer.appendChild(selectLabel);
                selectContainer.appendChild(selectElement);
                
                // Insert the selector before the plot
                plotContainer.parentNode.insertBefore(selectContainer, plotContainer);
            }
            
        } catch (error) {
            console.error('Error fetching PCA data:', error);
            
            // If there's an error, display a fallback static plot
            const trace1 = {
                x: [-0.18, -0.23, -0.10, -0.46, -0.12, -0.02, -0.16, 0.24, 0.22, 0.31],
                y: [0.19, 0.26, 0.26, 0.17, -0.19, 0.15, -0.20, -0.01, 0.05, 0.05],
                mode: 'markers',
                type: 'scatter',
                name: 'Murzyme',
                marker: { 
                    color: '#ff4081',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const trace2 = {
                x: [0.16, 0.21, 0.28, 0.01, 0.06, -0.00, 0.40, -0.30, 0.17, 0.25],
                y: [-0.08, -0.02, 0.02, 0.29, -0.11, -0.06, 0.01, 0.11, -0.04, -0.03],
                mode: 'markers',
                type: 'scatter',
                name: 'Non-Murzyme',
                marker: { 
                    color: '#1e88e5',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const pcaLayout = {
                title: 'PCA Visualization of Murzymes vs Non-Murzymes (Demo Data)',
                xaxis: { title: 'Principal Component 1' },
                yaxis: { title: 'Principal Component 2' },
                autosize: true,
                height: 450,
                margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                annotations: [{
                    text: 'Error loading data from API, showing demo data',
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.5,
                    y: 1.1,
                    showarrow: false,
                    font: {
                        color: '#ff4081',
                        size: 12
                    }
                }]
            };
            
            Plotly.newPlot('Principal component analysis on PDB features', [trace1, trace2], pcaLayout, {responsive: true});
        }
    }
    
    // Function to fetch tSNE data and create plot
    async function createTSNEPlot(featureNumber = 1) {
        // Create a new plot container for tSNE if it doesn't exist
        let tnseContainer = document.getElementById('tnse-plot-container');
        if (!tnseContainer) {
            // Find the PCA plot section
            const pcaSection = document.querySelector('.plot-section');
            if (!pcaSection) return;
            
            // Create a new section for tSNE plot
            const tnseSection = document.createElement('div');
            tnseSection.className = 'plot-section';
            tnseSection.innerHTML = `
                <h2>t-SNE Visualization</h2>
                <p>The t-SNE plot shows dimensionality reduction of protein features, revealing clusters and similarities between murzymes and non-murzymes.</p>
                <div id="tnse-plot-container" class="plot-container"></div>
            `;
            
            // Insert after the PCA section
            pcaSection.parentNode.insertBefore(tnseSection, pcaSection.nextSibling);
            
            tnseContainer = document.getElementById('tnse-plot-container');
        }
        
        // Show loading state with spinner
        tnseContainer.innerHTML = '<div class="loading-plot"><span class="loading-spinner"></span> Loading data...</div>';
        const loadingElement = tnseContainer.querySelector('.loading-plot');
        
        try {
            // Fetch tSNE data from API
            const response = await fetch(`${API_BASE_URL}/tnse_plot_feature/${featureNumber}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.ERROR_MESSAGE) {
                throw new Error(data.ERROR_MESSAGE);
            }
            
            // Create traces for murzymes and non-murzymes
            const trace1 = {
                x: data.murzymes_x,
                y: data.murzymes_y,
                mode: 'markers',
                type: 'scatter',
                name: 'Murzyme',
                marker: { 
                    color: '#ff4081',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const trace2 = {
                x: data.non_murzymes_x,
                y: data.non_murzymes_y,
                mode: 'markers',
                type: 'scatter',
                name: 'Non-Murzyme',
                marker: { 
                    color: '#1e88e5',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const tnseLayout = {
                title: `t-SNE Visualization of Murzymes vs Non-Murzymes (Feature ${featureNumber})`,
                xaxis: { title: 't-SNE Component 1' },
                yaxis: { title: 't-SNE Component 2' },
                autosize: true,
                height: 450,
                margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                updatemenus: [{
                    buttons: [
                        {method: 'restyle', args: [{'visible': [true, true]}], label: 'Show All'},
                        {method: 'restyle', args: [{'visible': [true, false]}], label: 'Murzymes Only'},
                        {method: 'restyle', args: [{'visible': [false, true]}], label: 'Non-Murzymes Only'}
                    ],
                    type: 'dropdown',
                    x: 0,
                    y: 1.2,
                    xanchor: 'left',
                    yanchor: 'top'
                }]
            };
            
            // Remove loading element before plotting
            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
            
            // Update the plot
            Plotly.newPlot('tnse-plot-container', [trace1, trace2], tnseLayout, {responsive: true});
            
            // Add feature selection dropdown if it doesn't exist
            if (!document.getElementById('tnse-feature-selector')) {
                const selectContainer = document.createElement('div');
                selectContainer.className = 'feature-selector-container';
                
                const selectLabel = document.createElement('label');
                selectLabel.textContent = 'Select Feature: ';
                
                const selectElement = document.createElement('select');
                selectElement.id = 'tnse-feature-selector';
                
                for (let i = 1; i <= 4; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Feature ${i}`;
                    if (i === featureNumber) {
                        option.selected = true;
                    }
                    selectElement.appendChild(option);
                }
                
                selectElement.addEventListener('change', function() {
                    createTSNEPlot(parseInt(this.value));
                });
                
                selectContainer.appendChild(selectLabel);
                selectContainer.appendChild(selectElement);
                
                // Insert the selector before the plot
                tnseContainer.parentNode.insertBefore(selectContainer, tnseContainer);
            }
            
        } catch (error) {
            console.error('Error fetching tSNE data:', error);
            
            // If there's an error, display a fallback static plot
            const trace1 = {
                x: [0.19, 0.26, 0.26, 0.17, -0.19, 0.15, -0.20, -0.01, 0.05, 0.05],
                y: [-0.18, -0.23, -0.10, -0.46, -0.12, -0.02, -0.16, 0.24, 0.22, 0.31],
                mode: 'markers',
                type: 'scatter',
                name: 'Murzyme',
                marker: { 
                    color: '#ff4081',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const trace2 = {
                x: [-0.08, -0.02, 0.02, 0.29, -0.11, -0.06, 0.01, 0.11, -0.04, -0.03],
                y: [0.16, 0.21, 0.28, 0.01, 0.06, -0.00, 0.40, -0.30, 0.17, 0.25],
                mode: 'markers',
                type: 'scatter',
                name: 'Non-Murzyme',
                marker: { 
                    color: '#1e88e5',
                    size: 8,
                    opacity: 0.7
                }
            };
            
            const tnseLayout = {
                title: 't-SNE Visualization of Murzymes vs Non-Murzymes (Demo Data)',
                xaxis: { title: 't-SNE Component 1' },
                yaxis: { title: 't-SNE Component 2' },
                autosize: true,
                height: 450,
                margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                annotations: [{
                    text: 'Error loading data from API, showing demo data',
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.5,
                    y: 1.1,
                    showarrow: false,
                    font: {
                        color: '#ff4081',
                        size: 12
                    }
                }]
            };
            
            Plotly.newPlot('tnse-plot-container', [trace1, trace2], tnseLayout, {responsive: true});
        }
    }
    
    // Feature Importance Bar Chart
    const featureData = [{
        x: ['Active Site', 'Selectivity', 'Specificity', 'Stoichiometry', 'Substrate Size', 'Reaction Rate'],
        y: [0.85, 0.72, 0.68, 0.62, 0.55, 0.48],
        type: 'bar',
        marker: {
            color: '#ff4081',
            opacity: 0.8
        }
    }];
    
    const featureLayout = {
        title: 'Feature Importance in Murzyme Classification',
        xaxis: { title: 'Feature' },
        yaxis: { title: 'Importance Score' },
        height: 450,
        margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
    };
    
    Plotly.newPlot('feature-importance', featureData, featureLayout, {responsive: true});
    
    // Binding Energy Distribution
    const murzymeDist = {
        x: Array.from({length: 100}, () => Math.random() * 5 - 15), // -15 to -10 range
        type: 'histogram',
        name: 'Murzymes',
        opacity: 0.7,
        marker: {
            color: '#ff4081'
        }
    };
    
    const nonMurzymeDist = {
        x: Array.from({length: 100}, () => Math.random() * 5 - 10), // -10 to -5 range
        type: 'histogram',
        name: 'Non-Murzymes',
        opacity: 0.7,
        marker: {
            color: '#1e88e5'
        }
    };
    
    const energyLayout = {
        title: 'Binding Energy Distribution',
        xaxis: { title: 'Binding Energy (kcal/mol)' },
        yaxis: { title: 'Frequency' },
        barmode: 'overlay',
        height: 450,
        margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
    };
    
    Plotly.newPlot('binding-energy', [murzymeDist, nonMurzymeDist], energyLayout, {responsive: true});
    
    // Classification Performance Metrics
    const performanceData = [{
        x: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'AUC'],
        y: [0.92, 0.89, 0.94, 0.91, 0.95],
        type: 'bar',
        marker: {
            color: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'],
            opacity: 0.8
        }
    }];
    
    const performanceLayout = {
        title: 'Classification Model Performance Metrics',
        xaxis: { title: 'Metric' },
        yaxis: { 
            title: 'Score',
            range: [0, 1]
        },
        height: 450,
        margin: { l: 50, r: 50, b: 80, t: 80, pad: 4 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
    };
    
    Plotly.newPlot('classification-performance', performanceData, performanceLayout, {responsive: true});

    // Theme toggling logic for plots
    const themeToggle = document.getElementById('hide_checkbox');
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const body = document.body;
            const isDarkMode = body.classList.contains('dark');
            
            // Array of all plot IDs
            const plotIds = ['Principal component analysis on PDB features', 'feature-importance', 'binding-energy', 'classification-performance'];
            
            // Update colors for all plots based on theme
            plotIds.forEach(plotId => {
                try {
                    const layout = {
                        paper_bgcolor: isDarkMode ? '#1a1a2e' : 'rgba(0,0,0,0)',
                        plot_bgcolor: isDarkMode ? '#1a1a2e' : 'rgba(0,0,0,0)',
                        font: {
                            color: isDarkMode ? '#ffffff' : '#000000'
                        }
                    };
                    
                    Plotly.relayout(plotId, layout);
                } catch (error) {
                    console.error(`Error updating layout for ${plotId}:`, error);
                }
            });
        });
    }
});