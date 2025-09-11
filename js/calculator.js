// CareFuse ROI Calculator

// Calculator state
let calculatorData = {
    monthlyVolume: 150,
    approvalRate: 85,
    lowBenefit: 25,
    episodeCost: 25000,
    adminCostPerCase: 150,
    p2pCostPerCase: 300,
    overturnRate: 15
};

// Initialize ROI Calculator
function initializeROICalculator() {
    const calculator = document.querySelector('.roi-calculator');
    if (!calculator) return;
    
    // Get all input elements
    const inputs = {
        monthlyVolume: document.getElementById('monthly-volume'),
        approvalRate: document.getElementById('approval-rate'),
        lowBenefit: document.getElementById('low-benefit'),
        episodeCost: document.getElementById('episode-cost')
    };
    
    // Sync initial DOM input values into calculatorData so initial calculation
    // and displays use the actual values shown in the inputs (prevents
    // mismatches where formatted suffixes like "M"/"k" only appear after
    // the user first interacts with a control).
    Object.entries(inputs).forEach(([key, input]) => {
        if (input) {
            // Use the current input.value if present; fall back to existing state
            const v = parseFloat(input.value);
            if (!Number.isNaN(v)) calculatorData[key] = v;
        }
    });

    // Initialize range value displays
    updateRangeDisplays();
    
    // Add event listeners
    Object.entries(inputs).forEach(([key, input]) => {
        if (input) {
            input.addEventListener('input', () => {
                updateCalculatorData(key, input.value);
                updateRangeDisplays();
                calculateROI();
            });
        }
    });
    
    // Initial calculation
    calculateROI();
    
    console.log('ROI Calculator initialized');
}

// Update calculator data
function updateCalculatorData(key, value) {
    calculatorData[key] = parseFloat(value) || 0;
}

// Update range input displays
function updateRangeDisplays() {
    const approvalRateDisplay = document.querySelector('#approval-rate + .range-value');
    const lowBenefitDisplay = document.querySelector('#low-benefit + .range-value');
    
    if (approvalRateDisplay) {
        approvalRateDisplay.textContent = calculatorData.approvalRate + '%';
    }
    
    if (lowBenefitDisplay) {
        lowBenefitDisplay.textContent = calculatorData.lowBenefit + '%';
    }
}

// Main ROI calculation function
function calculateROI() {
    const results = performROICalculation(calculatorData);
    updateROIDisplay(results);
}

// Perform ROI calculations
function performROICalculation(data) {
    // Annual volume
    const annualVolume = data.monthlyVolume * 12;
    
    // Current approved cases
    const currentApprovedCases = annualVolume * (data.approvalRate / 100);
    
    // Cases identified as low benefit by CareFuse
    const lowBenefitCases = currentApprovedCases * (data.lowBenefit / 100);
    
    // Avoided surgeries (assuming 75% of low benefit cases can be avoided)
    const avoidanceRate = 0.75;
    const avoidedSurgeries = Math.round(lowBenefitCases * avoidanceRate);
    
    // Medical cost savings
    const medicalSavings = avoidedSurgeries * data.episodeCost;
    
    // Administrative savings
    // Reduced P2P reviews (assume 30% reduction in P2P cases)
    const currentP2PCases = annualVolume * 0.20; // 20% of cases go to P2P
    const reducedP2PCases = currentP2PCases * 0.30;
    const p2pSavings = reducedP2PCases * data.p2pCostPerCase;
    
    // Reduced overturn costs (legal and administrative)
    const currentOverturns = (annualVolume - currentApprovedCases) * (data.overturnRate / 100);
    const reducedOverturns = currentOverturns * 0.40; // 40% reduction in overturns
    const overturnSavings = reducedOverturns * 2000; // $2000 per overturn case
    
    // Total administrative savings
    const adminSavings = p2pSavings + overturnSavings;
    
    // CareFuse implementation costs (estimated)
    const implementationCost = 50000; // One-time setup
    const annualLicenseCost = Math.min(annualVolume * 25, 200000); // $25 per case, capped at $200k
    const totalAnnualCost = implementationCost + annualLicenseCost;
    
    // Net ROI
    const totalSavings = medicalSavings + adminSavings;
    const netROI = totalSavings - totalAnnualCost;
    
    // ROI percentage
    const roiPercentage = ((netROI / totalAnnualCost) * 100);
    
    // Payback period (months)
    const monthlyROI = netROI / 12;
    const paybackPeriod = totalAnnualCost / monthlyROI;
    
    return {
        avoidedSurgeries,
        medicalSavings,
        adminSavings,
        totalSavings,
        totalCost: totalAnnualCost,
        netROI,
        roiPercentage,
        paybackPeriod: Math.max(paybackPeriod, 0),
        
        // Detailed breakdown
        breakdown: {
            annualVolume,
            currentApprovedCases,
            lowBenefitCases,
            avoidanceRate,
            p2pSavings,
            overturnSavings,
            implementationCost,
            annualLicenseCost
        }
    };
}

// Update ROI display
function updateROIDisplay(results) {
    // Update main result cards
    updateResultCard('avoided-surgeries', results.avoidedSurgeries);
    updateResultCard('medical-savings', formatCurrency(results.medicalSavings));
    updateResultCard('admin-savings', formatCurrency(results.adminSavings));
    updateResultCard('net-roi', formatCurrency(results.netROI));
    
    // Update additional metrics if they exist
    updateMetric('total-savings', formatCurrency(results.totalSavings));
    updateMetric('roi-percentage', formatPercentage(results.roiPercentage));
    updateMetric('payback-period', formatMonths(results.paybackPeriod));
    updateMetric('annual-volume', results.breakdown.annualVolume);
    
    // Store results for export
    window.currentROIResults = results;
}

// Update individual result card
function updateResultCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Animate the value change
        animateValueChange(element, value);
    }
}

// Update metric display
function updateMetric(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Animate value changes
function animateValueChange(element, newValue) {
    const currentValue = element.textContent;
    
    // Add animation class
    element.classList.add('updating');
    
    setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove('updating');
        element.classList.add('updated');
        
        setTimeout(() => {
            element.classList.remove('updated');
        }, 300);
    }, 150);
}

// Formatting functions
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(0) + 'k';
    } else {
        return '$' + amount.toLocaleString();
    }
}

function formatPercentage(percentage) {
    return percentage.toFixed(1) + '%';
}

function formatMonths(months) {
    if (months < 12) {
        return months.toFixed(1) + ' months';
    } else {
        return (months / 12).toFixed(1) + ' years';
    }
}

// Export ROI data to CSV
function exportROIToCSV() {
    if (!window.currentROIResults) {
        alert('Please calculate ROI first');
        return;
    }
    
    const results = window.currentROIResults;
    const data = calculatorData;
    
    const csvContent = generateROICSV(data, results);
    downloadCSV(csvContent, 'carefuse-roi-analysis.csv');
}

// Generate CSV content
function generateROICSV(inputData, results) {
    const rows = [
        ['CareFuse ROI Analysis', ''],
        ['Generated on', new Date().toLocaleDateString()],
        ['', ''],
        ['INPUT PARAMETERS', ''],
        ['Monthly TKA/THA Volume', inputData.monthlyVolume],
        ['Baseline Approval Rate', inputData.approvalRate + '%'],
        ['Predicted Low Benefit %', inputData.lowBenefit + '%'],
        ['Average Episode Cost', '$' + inputData.episodeCost.toLocaleString()],
        ['', ''],
        ['CALCULATED RESULTS', ''],
        ['Annual Volume', results.breakdown.annualVolume],
        ['Avoided Surgeries per Year', results.avoidedSurgeries],
        ['Medical Cost Savings', '$' + results.medicalSavings.toLocaleString()],
        ['Administrative Savings', '$' + results.adminSavings.toLocaleString()],
        ['Total Annual Savings', '$' + results.totalSavings.toLocaleString()],
        ['Implementation Cost', '$' + results.breakdown.implementationCost.toLocaleString()],
        ['Annual License Cost', '$' + results.breakdown.annualLicenseCost.toLocaleString()],
        ['Net Annual ROI', '$' + results.netROI.toLocaleString()],
        ['ROI Percentage', results.roiPercentage.toFixed(1) + '%'],
        ['Payback Period', formatMonths(results.paybackPeriod)],
        ['', ''],
        ['DETAILED BREAKDOWN', ''],
        ['P2P Review Savings', '$' + results.breakdown.p2pSavings.toLocaleString()],
        ['Overturn Cost Savings', '$' + results.breakdown.overturnSavings.toLocaleString()],
        ['Avoidance Rate Applied', (results.breakdown.avoidanceRate * 100) + '%']
    ];
    
    return rows.map(row => row.join(',')).join('\n');
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Generate ROI report (PDF simulation)
function generateROIReport() {
    if (!window.currentROIResults) {
        alert('Please calculate ROI first');
        return;
    }
    
    const results = window.currentROIResults;
    const reportContent = generateReportContent(calculatorData, results);
    
    // In a real implementation, this would generate a PDF
    // For now, we'll show the content in a modal or new window
    showROIReport(reportContent);
}

// Generate report content
function generateReportContent(inputData, results) {
    return `
    <div class="roi-report">
        <h1>CareFuse ROI Analysis Report</h1>
        <p class="report-date">Generated on ${new Date().toLocaleDateString()}</p>
        
        <section class="executive-summary">
            <h2>Executive Summary</h2>
            <p>Based on your organization's parameters, CareFuse is projected to deliver:</p>
            <ul>
                <li><strong>${formatCurrency(results.netROI)}</strong> in net annual ROI</li>
                <li><strong>${results.avoidedSurgeries}</strong> avoided unnecessary procedures per year</li>
                <li><strong>${formatPercentage(results.roiPercentage)}</strong> return on investment</li>
                <li><strong>${formatMonths(results.paybackPeriod)}</strong> payback period</li>
            </ul>
        </section>
        
        <section class="input-parameters">
            <h2>Input Parameters</h2>
            <table>
                <tr><td>Monthly TKA/THA Volume:</td><td>${inputData.monthlyVolume}</td></tr>
                <tr><td>Baseline Approval Rate:</td><td>${inputData.approvalRate}%</td></tr>
                <tr><td>Predicted Low Benefit %:</td><td>${inputData.lowBenefit}%</td></tr>
                <tr><td>Average Episode Cost:</td><td>${formatCurrency(inputData.episodeCost)}</td></tr>
            </table>
        </section>
        
        <section class="financial-impact">
            <h2>Financial Impact Analysis</h2>
            <h3>Cost Savings</h3>
            <table>
                <tr><td>Medical Cost Savings:</td><td>${formatCurrency(results.medicalSavings)}</td></tr>
                <tr><td>Administrative Savings:</td><td>${formatCurrency(results.adminSavings)}</td></tr>
                <tr><td>Total Annual Savings:</td><td>${formatCurrency(results.totalSavings)}</td></tr>
            </table>
            
            <h3>Implementation Costs</h3>
            <table>
                <tr><td>One-time Implementation:</td><td>${formatCurrency(results.breakdown.implementationCost)}</td></tr>
                <tr><td>Annual License Cost:</td><td>${formatCurrency(results.breakdown.annualLicenseCost)}</td></tr>
                <tr><td>Total Annual Cost:</td><td>${formatCurrency(results.totalCost)}</td></tr>
            </table>
        </section>
        
        <section class="assumptions">
            <h2>Key Assumptions</h2>
            <ul>
                <li>75% of identified low-benefit cases can be successfully avoided</li>
                <li>30% reduction in P2P review cases</li>
                <li>40% reduction in denial overturn cases</li>
                <li>$2,000 average cost per overturn case</li>
                <li>$300 average cost per P2P review</li>
            </ul>
        </section>
        
        <section class="next-steps">
            <h2>Recommended Next Steps</h2>
            <ol>
                <li>Schedule a detailed demo to see CareFuse in action</li>
                <li>Conduct a pilot program with a subset of cases</li>
                <li>Develop implementation timeline and change management plan</li>
                <li>Establish success metrics and monitoring procedures</li>
            </ol>
        </section>
    </div>
    `;
}

// Show ROI report in modal
function showROIReport(content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('roi-report-modal');
    if (!modal) {
        modal = createROIReportModal();
    }
    
    // Update modal content
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = content;
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Create ROI report modal
function createROIReportModal() {
    const modal = document.createElement('div');
    modal.id = 'roi-report-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3 class="modal-title">ROI Analysis Report</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="printROIReport()">Print Report</button>
                <button class="btn btn-secondary" onclick="closeROIReportModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeROIReportModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeROIReportModal();
    });
    
    return modal;
}

// Close ROI report modal
function closeROIReportModal() {
    const modal = document.getElementById('roi-report-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Print ROI report
function printROIReport() {
    const reportContent = document.querySelector('#roi-report-modal .modal-body').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CareFuse ROI Analysis Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #1F7A7A; }
                h2 { color: #2A9999; border-bottom: 2px solid #1F7A7A; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                td:first-child { font-weight: bold; }
                ul, ol { margin: 15px 0; }
                .report-date { color: #666; font-style: italic; }
            </style>
        </head>
        <body>
            ${reportContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Scenario analysis
function runScenarioAnalysis() {
    const scenarios = [
        { name: 'Conservative', lowBenefit: 15, avoidanceRate: 0.6 },
        { name: 'Base Case', lowBenefit: 25, avoidanceRate: 0.75 },
        { name: 'Optimistic', lowBenefit: 35, avoidanceRate: 0.85 }
    ];
    
    const results = scenarios.map(scenario => {
        const scenarioData = { ...calculatorData, lowBenefit: scenario.lowBenefit };
        const result = performROICalculation(scenarioData);
        return {
            name: scenario.name,
            ...result
        };
    });
    
    return results;
}

// Sensitivity analysis
function runSensitivityAnalysis() {
    const baseResults = performROICalculation(calculatorData);
    const variables = ['monthlyVolume', 'approvalRate', 'lowBenefit', 'episodeCost'];
    const variations = [-20, -10, 0, 10, 20]; // Percentage changes
    
    const sensitivity = {};
    
    variables.forEach(variable => {
        sensitivity[variable] = variations.map(variation => {
            const modifiedData = { ...calculatorData };
            modifiedData[variable] = calculatorData[variable] * (1 + variation / 100);
            
            const result = performROICalculation(modifiedData);
            const roiChange = ((result.netROI - baseResults.netROI) / baseResults.netROI) * 100;
            
            return {
                variation,
                netROI: result.netROI,
                roiChange
            };
        });
    });
    
    return sensitivity;
}

// Note: initialization is triggered from main.js to keep startup centralized.

// Export functions for global access
window.ROICalculator = {
    calculateROI,
    exportROIToCSV,
    generateROIReport,
    runScenarioAnalysis,
    runSensitivityAnalysis,
    closeROIReportModal,
    printROIReport
};

