// document.addEventListener('DOMContentLoaded', function() {
//     // Get buttons and results container
//     const compareBtn = document.getElementById('compare-models-btn');
//     const resetBtn = document.getElementById('reset-models-btn');
//     const resultsContainer = document.getElementById('results-container');
    
//     // Compare models button click handler
//     compareBtn.addEventListener('click', function() {
//         // Get all parameter values and structure them like the Python models
//         const model1 = {
//             proposal: {
//                 ShapeChange: parseInt(document.getElementById('A-ShapeChange').value),
//                 Serial: parseInt(document.getElementById('A-Serial').value),
//                 Complexity: parseInt(document.getElementById('A-Complexity').value),
//                 MechanisticSteps: parseInt(document.getElementById('A-MechanisticSteps').value),
//                 Probability: parseInt(document.getElementById('A-Probability').value),
//                 Intermediates: parseInt(document.getElementById('A-Intermediates').value)
//             },
//             structural: {
//                 ActiveSiteAccess: parseInt(document.getElementById('A-ActiveSiteAccess').value) === 0 ? "limited" : "unlimited",
//                 SubstrateSize: parseInt(document.getElementById('A-SubstrateSize').value) === 0 ? "small" : "large"
//             },
//             experimental: {
//                 Selectivity: parseInt(document.getElementById('A-Selectivity').value) === 1,
//                 Specificity: parseInt(document.getElementById('A-Specificity').value) === 1,
//                 NonIntStoichiometry: parseInt(document.getElementById('A-NonIntStoichiometry').value) === 1,
//                 KmKd: parseInt(document.getElementById('A-KmKd').value) === 1,
//                 ZerothOrderKinetics: parseInt(document.getElementById('A-ZerothOrderKinetics').value)
//             }
//         };
        
//         const model2 = {
//             proposal: {
//                 ShapeChange: parseInt(document.getElementById('B-ShapeChange').value),
//                 Serial: parseInt(document.getElementById('B-Serial').value),
//                 Complexity: parseInt(document.getElementById('B-Complexity').value),
//                 MechanisticSteps: parseInt(document.getElementById('B-MechanisticSteps').value),
//                 Probability: parseInt(document.getElementById('B-Probability').value),
//                 Intermediates: parseInt(document.getElementById('B-Intermediates').value)
//             },
//             structural: {
//                 ActiveSiteAccess: parseInt(document.getElementById('B-ActiveSiteAccess').value) === 0 ? "limited" : "unlimited",
//                 SubstrateSize: parseInt(document.getElementById('B-SubstrateSize').value) === 0 ? "small" : "large"
//             },
//             experimental: {
//                 Selectivity: parseInt(document.getElementById('B-Selectivity').value) === 1,
//                 Specificity: parseInt(document.getElementById('B-Specificity').value) === 1,
//                 NonIntStoichiometry: parseInt(document.getElementById('B-NonIntStoichiometry').value) === 1,
//                 KmKd: parseInt(document.getElementById('B-KmKd').value) === 1,
//                 ZerothOrderKinetics: parseInt(document.getElementById('B-ZerothOrderKinetics').value)
//             }
//         };
        
//         // Call the analysis functions
//         const simplerModel = OccamsRazor(model1, model2);
//         const consistency1 = consistency_check(model1);
//         const consistency2 = consistency_check(model2);
        
//         // Calculate consistency percentages
//         const consistency1Percent = Math.round(((consistency1.checks_made - consistency1.inconsistency_score) / consistency1.checks_made) * 100);
//         const consistency2Percent = Math.round(((consistency2.checks_made - consistency2.inconsistency_score) / consistency2.checks_made) * 100);
        
//         // Prepare results for display
//         const results = {
//             simplerModel: simplerModel === 1 ? "Model A" : simplerModel === 2 ? "Model B" : "Both Models are equally simple",
//             model1: {
//                 inconsistency: consistency1.inconsistency_score,
//                 checksMade: consistency1.checks_made,
//                 consistency: consistency1Percent
//             },
//             model2: {
//                 inconsistency: consistency2.inconsistency_score,
//                 checksMade: consistency2.checks_made,
//                 consistency: consistency2Percent
//             }
//         };
        
//         // Display the results
//         displayResults(results);
        
//         // Show results container if hidden
//         resultsContainer.classList.remove('hidden');
//     });
    
//     // Reset button click handler
//     resetBtn.addEventListener('click', function() {
//         // Reset all inputs to default values
//         document.querySelectorAll('select, input[type="number"]').forEach(element => {
//             if (element.tagName === 'SELECT') {
//                 element.selectedIndex = 0;
//             } else if (element.type === 'number') {
//                 element.value = '0';
//             }
//         });
        
//         // Hide results container
//         resultsContainer.classList.add('hidden');
//     });
    
//     // Implementation of OccamsRazor function
//     function OccamsRazor(model1, model2) {
//         // Simple comparison based on proposal values
//         const model1_complexity = Object.values(model1.proposal).reduce((a, b) => a + b, 0);
//         const model2_complexity = Object.values(model2.proposal).reduce((a, b) => a + b, 0);
        
//         if (model1_complexity < model2_complexity) {
//             return 1;
//         } else if (model2_complexity < model1_complexity) {
//             return 2;
//         } else {
//             return 0;
//         }
//     }
    
//     // Implementation of consistency_check function
//     function consistency_check(model) {
//         let inconsistency_score = 0;
//         let checks_made = 0;
        
//         // Check 1: If Active Site Access is limited, Substrate Size should be small
//         checks_made += 1;
//         if (model.structural.ActiveSiteAccess === "limited" && model.structural.SubstrateSize === "large") {
//             inconsistency_score += 1;
//         }
        
//         // Check 2: If Serial is 1, MechanisticSteps should be > 1
//         checks_made += 1;
//         if (model.proposal.Serial === 1 && model.proposal.MechanisticSteps <= 1) {
//             inconsistency_score += 1;
//         }
        
//         // Check 3: If Complexity is 1, either ShapeChange or Intermediates should be 1
//         checks_made += 1;
//         if (model.proposal.Complexity === 1 && (model.proposal.ShapeChange === 0 && model.proposal.Intermediates === 0)) {
//             inconsistency_score += 1;
//         }
        
//         // Check 4: If Specificity is True, Selectivity should also be True
//         checks_made += 1;
//         if (model.experimental.Specificity === true && model.experimental.Selectivity === false) {
//             inconsistency_score += 1;
//         }
        
//         // Check 5: If ZerothOrderKinetics is 1, KmKd should be False
//         checks_made += 1;
//         if (model.experimental.ZerothOrderKinetics === 1 && model.experimental.KmKd === true) {
//             inconsistency_score += 1;
//         }
        
//         return {
//             inconsistency_score: inconsistency_score,
//             checks_made: checks_made
//         };
//     }
    
//     // Display the analysis results
//     function displayResults(results) {
//         // Update simpler model result
//         document.getElementById('simpler-model-result').textContent = 
//             `Simpler Model: ${results.simplerModel}`;
        
//         // Update model A results
//         document.getElementById('model-a-score').textContent = 
//             `Consistency: ${results.model1.consistency}% (${results.model1.checksMade - results.model1.inconsistency}/${results.model1.checksMade} checks passed)`;
//         document.getElementById('model-a-bar').style.width = `${results.model1.consistency}%`;
        
//         // Update model B results
//         document.getElementById('model-b-score').textContent = 
//             `Consistency: ${results.model2.consistency}% (${results.model2.checksMade - results.model2.inconsistency}/${results.model2.checksMade} checks passed)`;
//         document.getElementById('model-b-bar').style.width = `${results.model2.consistency}%`;
        
//         // Generate interpretive summary
//         let summaryText = `Analysis Summary:\n\n`;
//         summaryText += `- ${results.simplerModel} is simpler (lower proposal complexity)\n`;
//         summaryText += `- Model A passed ${results.model1.checksMade - results.model1.inconsistency} out of ${results.model1.checksMade} consistency checks\n`;
//         summaryText += `- Model B passed ${results.model2.checksMade - results.model2.inconsistency} out of ${results.model2.checksMade} consistency checks\n\n`;
        
//         if (results.simplerModel.includes("Model A") && results.model1.consistency > results.model2.consistency) {
//             summaryText += `Conclusion: Model A is both simpler and more consistent with known data, making it the preferred choice according to Occam's Razor.`;
//         } else if (results.simplerModel.includes("Model B") && results.model2.consistency > results.model2.consistency) {
//             summaryText += `Conclusion: Model B is both simpler and more consistent with known data, making it the preferred choice according to Occam's Razor.`;
//         } else if (results.simplerModel.includes("Both")) {
//             summaryText += `Conclusion: Both models are equally simple. Consider consistency scores to determine which aligns better with experimental data.`;
//         } else {
//             summaryText += `Conclusion: The simpler model (${results.simplerModel}) doesn't have the highest consistency score. Further investigation is recommended.`;
//         }
        
//         document.getElementById('analysis-summary-text').textContent = summaryText;
//     }
// });



document.addEventListener('DOMContentLoaded', function() {
    // Get buttons and results container
    const compareBtn = document.getElementById('compare-models-btn');
    const resetBtn = document.getElementById('reset-models-btn');
    const resultsContainer = document.getElementById('results-container');
    
    // Compare models button click handler
    compareBtn.addEventListener('click', function() {
        // Get all parameter values and structure them like the Python models
        const model1 = {
            proposal: {
                ShapeChange: parseInt(document.getElementById('A-ShapeChange').value),
                Serial: parseInt(document.getElementById('A-Serial').value),
                Complexity: parseInt(document.getElementById('A-Complexity').value),
                MechanisticSteps: parseInt(document.getElementById('A-MechanisticSteps').value),
                Probability: parseInt(document.getElementById('A-Probability').value),
                Intermediates: parseInt(document.getElementById('A-Intermediates').value),
                LongDistanceOSET: parseInt(document.getElementById('A-LongDistanceOSET').value || 0),
                HighAffinityESComplex: parseInt(document.getElementById('A-HighAffinityESComplex').value || 0),
                SubstrateBound: parseInt(document.getElementById('A-SubstrateBound').value || 0) === 1
            },
            structural: {
                ActiveSiteAccess: parseInt(document.getElementById('A-ActiveSiteAccess').value) === 0 ? "limited" : "unlimited",
                SubstrateSize: parseInt(document.getElementById('A-SubstrateSize').value) === 0 ? "small" : "large",
                Heme: null,
                Flavin: null,
                FeS: null
            },
            theoretical: {
                Redox: null,
                Exergonic: null
            },
            experimental: {
                Selectivity: parseInt(document.getElementById('A-Selectivity').value) === 1,
                Specificity: parseInt(document.getElementById('A-Specificity').value) === 1,
                Diversity: parseInt(document.getElementById('A-Diversity').value || 0) === 1,
                NonIntStoichiometry: parseInt(document.getElementById('A-NonIntStoichiometry').value) === 1,
                VariableStoichiometry: parseInt(document.getElementById('A-VariableStoichiometry').value || 0) === 1,
                KmKd: parseInt(document.getElementById('A-KmKd').value) === 1,
                DiffusionLimits: parseInt(document.getElementById('A-DiffusionLimits').value || 0) === 1,
                ZerothOrderKinetics: parseInt(document.getElementById('A-ZerothOrderKinetics').value),
                CatalyticRate: parseFloat(document.getElementById('A-CatalyticRate').value || 0),
                IntKIE: document.getElementById('A-IntKIE').value || "LOW"
            }
        };
        
        const model2 = {
            proposal: {
                ShapeChange: parseInt(document.getElementById('B-ShapeChange').value),
                Serial: parseInt(document.getElementById('B-Serial').value),
                Complexity: parseInt(document.getElementById('B-Complexity').value),
                MechanisticSteps: parseInt(document.getElementById('B-MechanisticSteps').value),
                Probability: parseInt(document.getElementById('B-Probability').value),
                Intermediates: parseInt(document.getElementById('B-Intermediates').value),
                LongDistanceOSET: parseInt(document.getElementById('B-LongDistanceOSET').value || 0),
                HighAffinityESComplex: parseInt(document.getElementById('B-HighAffinityESComplex').value || 0),
                SubstrateBound: parseInt(document.getElementById('B-SubstrateBound').value || 0) === 1
            },
            structural: {
                ActiveSiteAccess: parseInt(document.getElementById('B-ActiveSiteAccess').value) === 0 ? "limited" : "unlimited",
                SubstrateSize: parseInt(document.getElementById('B-SubstrateSize').value) === 0 ? "small" : "large",
                Heme: null,
                Flavin: null,
                FeS: null
            },
            theoretical: {
                Redox: null,
                Exergonic: null
            },
            experimental: {
                Selectivity: parseInt(document.getElementById('B-Selectivity').value) === 1,
                Specificity: parseInt(document.getElementById('B-Specificity').value) === 1,
                Diversity: parseInt(document.getElementById('B-Diversity').value || 0) === 1,
                NonIntStoichiometry: parseInt(document.getElementById('B-NonIntStoichiometry').value) === 1,
                VariableStoichiometry: parseInt(document.getElementById('B-VariableStoichiometry').value || 0) === 1,
                KmKd: parseInt(document.getElementById('B-KmKd').value) === 1,
                DiffusionLimits: parseInt(document.getElementById('B-DiffusionLimits').value || 0) === 1,
                ZerothOrderKinetics: parseInt(document.getElementById('B-ZerothOrderKinetics').value),
                CatalyticRate: parseFloat(document.getElementById('B-CatalyticRate').value || 0),
                IntKIE: document.getElementById('B-IntKIE').value || "LOW"
            }
        };
        
        // Call the analysis functions
        const simplerModel = OccamsRazor(model1, model2);
        const consistency1 = consistency_check(model1);
        const consistency2 = consistency_check(model2);
        
        // Calculate consistency percentages
        const consistency1Percent = Math.round(((consistency1.checks_made - consistency1.inconsistency_score) / consistency1.checks_made) * 100);
        const consistency2Percent = Math.round(((consistency2.checks_made - consistency2.inconsistency_score) / consistency2.checks_made) * 100);
        
        // Prepare results for display
        const results = {
            simplerModel: simplerModel === 1 ? "Model A" : simplerModel === 2 ? "Model B" : "Both Models are equally simple",
            model1: {
                inconsistency: consistency1.inconsistency_score,
                checksMade: consistency1.checks_made,
                consistency: consistency1Percent
            },
            model2: {
                inconsistency: consistency2.inconsistency_score,
                checksMade: consistency2.checks_made,
                consistency: consistency2Percent
            }
        };
        
        // Display the results
        displayResults(results);
        
        // Show results container if hidden
        resultsContainer.classList.remove('hidden');
    });
    
    // Reset button click handler
    resetBtn.addEventListener('click', function() {
        // Reset all inputs to default values
        document.querySelectorAll('select, input[type="number"]').forEach(element => {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            } else if (element.type === 'number') {
                element.value = '0';
            }
        });
        
        // Hide results container
        resultsContainer.classList.add('hidden');
    });
    
    // Implementation of OccamsRazor function - Updated to match Python logic
    function OccamsRazor(model1, model2) {
        let simplicity_cnt_1 = 0;
        let simplicity_cnt_2 = 0;
        
        // Model 1 simplicity checks
        if (model1.proposal.ShapeChange === 0) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.Serial === 0) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.Complexity === 0) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.Probability === 1) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.Intermediates === 0) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.LongDistanceOSET === 0) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.HighAffinityESComplex === 0) {
            simplicity_cnt_1 += 1;
        }
        
        // Model 2 simplicity checks
        if (model2.proposal.ShapeChange === 0) {
            simplicity_cnt_2 += 1;
        }
        if (model2.proposal.Serial === 0) {
            simplicity_cnt_2 += 1;
        }
        if (model2.proposal.Complexity === 0) {
            simplicity_cnt_2 += 1;
        }
        if (model2.proposal.Probability === 1) {
            simplicity_cnt_2 += 1;
        }
        if (model2.proposal.Intermediates === 1) { // Note: Python has 1 here, not 0
            simplicity_cnt_2 += 1;
        }
        if (model2.proposal.LongDistanceOSET === 0) {
            simplicity_cnt_2 += 1;
        }
        if (model2.proposal.HighAffinityESComplex === 0) {
            simplicity_cnt_2 += 1;
        }
        
        // MechanisticSteps comparison
        if (model1.proposal.MechanisticSteps < model2.proposal.MechanisticSteps) {
            simplicity_cnt_1 += 1;
        }
        if (model1.proposal.MechanisticSteps > model2.proposal.MechanisticSteps) {
            simplicity_cnt_2 += 1;
        }
        
        // Return result
        if (simplicity_cnt_1 > simplicity_cnt_2) {
            return 1;
        }
        if (simplicity_cnt_1 < simplicity_cnt_2) {
            return 2;
        }
        
        return 0;
    }
    
    // Implementation of consistency_check function - Updated to match Python logic
    function consistency_check(model) {
        const access = model.structural.ActiveSiteAccess;
        const selectivity = model.experimental.Selectivity;
        const specificity = model.experimental.Specificity;
        const diversity = model.experimental.Diversity;
        const non_int_stoich = model.experimental.NonIntStoichiometry;
        const substrate_size = model.structural.SubstrateSize;
        const kmkd = model.experimental.KmKd;
        const zeroth_order_kinetics = model.experimental.ZerothOrderKinetics;
        const catalytic_rate = model.experimental.CatalyticRate;
        const substrate_bound = model.proposal.SubstrateBound;
        const int_KIE = model.experimental.IntKIE;
        
        let inconsistency_score = 0;
        let checks_made = 0;
        
        // Check 1: If Active Site Access is limited, Selectivity should be True
        checks_made += 1;
        if (access === "limited" && selectivity === false) {
            inconsistency_score += 1;
        }
        
        // Check 2: If Active Site Access is limited, Specificity should be True
        checks_made += 1;
        if (access === "limited" && specificity === false) {
            inconsistency_score += 1;
        }
        
        // Check 3: If Selectivity is False, NonIntStoichiometry should be False
        checks_made += 1;
        if (selectivity === false && non_int_stoich === true) {
            inconsistency_score += 1;
        }
        
        // Check 4: If KmKd is True (Km < Kd), it's inconsistent
        checks_made += 1;
        if (kmkd === true) {
            inconsistency_score += 1;
        }
        
        // Check 5: If SubstrateSize is large, it's inconsistent
        checks_made += 1;
        if (substrate_size === "large") {
            inconsistency_score += 1;
        }
        
        // Check 6: If ZerothOrderKinetics is 1, it's inconsistent
        checks_made += 1;
        if (zeroth_order_kinetics === 1) {
            inconsistency_score += 1;
        }
        
        // Check 7: If CatalyticRate > 1e9, it's inconsistent
        checks_made += 1;
        if (catalytic_rate > 1e9) {
            inconsistency_score += 1;
        }
        
        // Check 8: If SubstrateBound is True and IntKIE is "HIGH", it's inconsistent
        checks_made += 1;
        if (substrate_bound === true && int_KIE === "HIGH") {
            inconsistency_score += 1;
        }
        
        return {
            inconsistency_score: inconsistency_score,
            checks_made: checks_made
        };
    }
    
    // Display the analysis results
    function displayResults(results) {
        // Update simpler model result
        document.getElementById('simpler-model-result').textContent = 
            `Simpler Model: ${results.simplerModel}`;
        
        // Update model A results
        document.getElementById('model-a-score').textContent = 
            `Consistency: ${results.model1.consistency}% (${results.model1.checksMade - results.model1.inconsistency}/${results.model1.checksMade} checks passed)`;
        document.getElementById('model-a-bar').style.width = `${results.model1.consistency}%`;
        
        // Update model B results
        document.getElementById('model-b-score').textContent = 
            `Consistency: ${results.model2.consistency}% (${results.model2.checksMade - results.model2.inconsistency}/${results.model2.checksMade} checks passed)`;
        document.getElementById('model-b-bar').style.width = `${results.model2.consistency}%`;
        
        // Generate interpretive summary
        let summaryText = `Analysis Summary:\n\n`;
        summaryText += `- ${results.simplerModel} is simpler (based on simplicity criteria)\n`;
        summaryText += `- Model A passed ${results.model1.checksMade - results.model1.inconsistency} out of ${results.model1.checksMade} consistency checks\n`;
        summaryText += `- Model B passed ${results.model2.checksMade - results.model2.inconsistency} out of ${results.model2.checksMade} consistency checks\n\n`;
        
        if (results.simplerModel.includes("Model A") && results.model1.consistency > results.model2.consistency) {
            summaryText += `Conclusion: Model A is both simpler and more consistent with known data, making it the preferred choice according to Occam's Razor.`;
        } else if (results.simplerModel.includes("Model B") && results.model2.consistency > results.model1.consistency) {
            summaryText += `Conclusion: Model B is both simpler and more consistent with known data, making it the preferred choice according to Occam's Razor.`;
        } else if (results.simplerModel.includes("Both")) {
            summaryText += `Conclusion: Both models are equally simple. Consider consistency scores to determine which aligns better with experimental data.`;
        } else {
            summaryText += `Conclusion: The simpler model (${results.simplerModel}) doesn't have the highest consistency score. Further investigation is recommended.`;
        }
        
        document.getElementById('analysis-summary-text').textContent = summaryText;
    }
    
    // Test function to verify the implementation matches Python example
    function testImplementation() {
        // Create test models matching the Python example
        const testModel1 = {
            proposal: {
                ShapeChange: 1,
                Serial: 1,
                Complexity: 0,
                MechanisticSteps: 3,
                Probability: 0,
                Intermediates: 1,
                LongDistanceOSET: 1,
                HighAffinityESComplex: 1
            },
            structural: {
                ActiveSiteAccess: "limited",
                SubstrateSize: "large"
            },
            experimental: {
                Selectivity: false,
                Specificity: false,
                Diversity: true,
                NonIntStoichiometry: true,
                KmKd: true,
                ZerothOrderKinetics: 1,
                CatalyticRate: 1.5e9,
                IntKIE: "HIGH"
            }
        };
        
        const testModel2 = {
            proposal: {
                ShapeChange: 0,
                Serial: 0,
                Complexity: 0,
                MechanisticSteps: 2,
                Probability: 1,
                Intermediates: 0,
                LongDistanceOSET: 0,
                HighAffinityESComplex: 0
            },
            structural: {
                ActiveSiteAccess: "unlimited",
                SubstrateSize: "small"
            },
            experimental: {
                Selectivity: true,
                Specificity: true,
                Diversity: false,
                NonIntStoichiometry: false,
                KmKd: false,
                ZerothOrderKinetics: 0,
                CatalyticRate: 1e6,
                IntKIE: "LOW"
            }
        };
        
        // Test OccamsRazor
        const result = OccamsRazor(testModel1, testModel2);
        console.log("OccamsRazor result:", result === 2 ? "model2 is simpler" : "model1 is simpler");
        
        // Test consistency_check
        const consistency = consistency_check(testModel1);
        console.log(`Consistency check: ${consistency.inconsistency_score} failures out of ${consistency.checks_made} checks`);
    }
    
    // Uncomment the line below to test the implementation
    // testImplementation();
});