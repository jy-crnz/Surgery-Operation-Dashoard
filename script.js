// GLOBAL STATE
let allData = [];
let currentData = [];
let myBarChart = null;
let myPieChart = null;
let sortDirection = 1;

// 1. SMART PARSE FUNCTION
function smartParse(csvText) {
    if (!csvText) return [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const colMap = {
        procedure: headers.findIndex(h => h.includes('procedure') || h.includes('service') || h.includes('cpt')),
        surgeon: headers.findIndex(h => h.includes('surgeon') || h.includes('doctor') || h.includes('provider')),
        duration: headers.findIndex(h => h.includes('duration') || h.includes('min') || h.includes('elapsed')),
        turnover: headers.findIndex(h => h.includes('turnover')),
        startTime: headers.findIndex(h => h.includes('start') || h.includes('wheels in')),
        endTime: headers.findIndex(h => h.includes('end') || h.includes('wheels out'))
    };

    const results = [];
    const randomSurgeons = ['Dr. Grey', 'Dr. Yang', 'Dr. Shepherd', 'Dr. Karev', 'Dr. Bailey'];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (row.length < 2) continue;

        const getVal = (idx) => (idx > -1 && row[idx]) ? row[idx].replace(/^"|"$/g, '').trim() : null;

        let procedure = getVal(colMap.procedure) || "Unknown Procedure";
        let surgeon = getVal(colMap.surgeon);
        if (!surgeon) surgeon = randomSurgeons[i % randomSurgeons.length]; 

        let duration = parseInt(getVal(colMap.duration));
        if (isNaN(duration) && colMap.startTime > -1 && colMap.endTime > -1) {
            const s = new Date(getVal(colMap.startTime));
            const e = new Date(getVal(colMap.endTime));
            duration = Math.round((e - s) / 60000);
        }
        if (isNaN(duration)) duration = 0;

        let turnover = parseInt(getVal(colMap.turnover));
        if (isNaN(turnover)) turnover = Math.floor(Math.random() * (55 - 20) + 20);

        results.push({ procedure, surgeon, duration, turnover });
    }
    return results;
}

// 2. INITIALIZATION
function loadDashboard(customCSV = null) {
    const dataSource = customCSV || csvData;
    allData = smartParse(dataSource);
    populateFilter();
    currentData = [...allData];
    renderDashboard();
}

// 3. POPULATE FILTER DROPDOWN
function populateFilter() {
    const filterSelect = document.getElementById('surgeon-filter');
    if (!filterSelect) return; 

    const currentSelection = filterSelect.value;
    const surgeons = [...new Set(allData.map(d => d.surgeon))].sort();
    
    filterSelect.innerHTML = '<option value="all">All Surgeons</option>';
    surgeons.forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.innerText = s;
        filterSelect.appendChild(option);
    });

    if(surgeons.includes(currentSelection)) {
        filterSelect.value = currentSelection;
    }
}

// 4. UNIFIED FILTER LOGIC (The "Master" Filter)
function applyFilters() {
    const surgeonSelect = document.getElementById('surgeon-filter');
    const searchInput = document.getElementById('search-input');
    
    // Safety checks
    if (!surgeonSelect) return; 

    const selectedSurgeon = surgeonSelect.value;
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

    // A. Start with ALL data
    let result = allData;

    // B. Apply Surgeon Filter
    if (selectedSurgeon !== 'all') {
        result = result.filter(item => item.surgeon === selectedSurgeon);
    }

    // C. Apply Search Filter
    if (searchTerm) {
        result = result.filter(item => 
            item.procedure.toLowerCase().includes(searchTerm) || 
            item.surgeon.toLowerCase().includes(searchTerm)
        );
    }

    // D. Update State & Render
    currentData = result;
    renderDashboard();
}

// EVENT LISTENERS (Connected to the unified logic)
const filterDropdown = document.getElementById('surgeon-filter');
const searchBox = document.getElementById('search-input');

if (filterDropdown) {
    filterDropdown.addEventListener('change', applyFilters);
}

if (searchBox) {
    searchBox.addEventListener('input', applyFilters);
}

// 5. SORT LOGIC
function handleSort(key) {
    sortDirection *= -1; 
    currentData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return -1 * sortDirection;
        if (valA > valB) return 1 * sortDirection;
        return 0;
    });
    renderDashboard();
}

// 6. RENDER DASHBOARD
function renderDashboard() {
    let totalDur = 0, totalTurn = 0, count = 0;
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return; 
    tableBody.innerHTML = '';

    // Handle Empty Results
    if (currentData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#64748b;">No records found.</td></tr>';
        
        // Clear stats to 0
        document.getElementById('total-cases').innerText = "0";
        document.getElementById('avg-duration').innerText = "--";
        document.getElementById('avg-turnover').innerText = "--";
        
        // Clear charts
        if (myBarChart) { myBarChart.destroy(); myBarChart = null; }
        if (myPieChart) { myPieChart.destroy(); myPieChart = null; }
        return;
    }

    currentData.forEach(item => {
        if(item.duration > 0) {
            totalDur += item.duration;
            totalTurn += item.turnover;
            count++;
        }

        const row = document.createElement('tr');
        const alertClass = item.turnover > 30 ? 'high-alert' : ''; 
        
        row.innerHTML = `
            <td>${item.procedure}</td>
            <td>${item.surgeon}</td>
            <td>${item.duration} min</td>
            <td class="${alertClass}">${item.turnover} min</td>
        `;
        tableBody.appendChild(row);
    });

    const avgDur = count ? (totalDur / count).toFixed(1) : 0;
    const avgTurn = count ? (totalTurn / count).toFixed(1) : 0;

    const elTotal = document.getElementById('total-cases');
    const elAvgDur = document.getElementById('avg-duration');
    const elAvgTurn = document.getElementById('avg-turnover');
    
    if(elTotal) elTotal.innerText = currentData.length;
    if(elAvgDur) elAvgDur.innerText = avgDur + ' min';
    if(elAvgTurn) elAvgTurn.innerText = avgTurn + ' min';

    const statusEl = document.getElementById('turnover-status');
    if (statusEl) {
        if (parseFloat(avgTurn) <= 25) {
            statusEl.innerText = "Efficient";
            statusEl.className = "status-badge green";
        } else {
            statusEl.innerText = "Needs Improvement";
            statusEl.className = "status-badge red";
        }
    }

    renderCharts(currentData);
}

// 7. CHART RENDERING
function renderCharts(data) {
    const ctxBarEl = document.getElementById('surgeonChart');
    const ctxPieEl = document.getElementById('procedureChart');

    if (ctxBarEl) {
        const surgeonStats = {};
        data.forEach(s => {
            if (!surgeonStats[s.surgeon]) surgeonStats[s.surgeon] = { total: 0, count: 0 };
            surgeonStats[s.surgeon].total += s.duration;
            surgeonStats[s.surgeon].count++;
        });
        const barLabels = Object.keys(surgeonStats);
        const barData = barLabels.map(k => (surgeonStats[k].total / surgeonStats[k].count).toFixed(1));

        if (myBarChart) myBarChart.destroy();
        myBarChart = new Chart(ctxBarEl.getContext('2d'), {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: 'Avg Duration (min)',
                    data: barData,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } } // Hide redundant legend
            }
        });
    }

    if (ctxPieEl) {
        const procCounts = {};
        data.forEach(s => { procCounts[s.procedure] = (procCounts[s.procedure] || 0) + 1; });
        const sorted = Object.entries(procCounts).sort((a,b) => b[1] - a[1]);
        let pieLabels = [], pieData = [];
        
        if (sorted.length > 6) {
            const top5 = sorted.slice(0, 5);
            pieLabels = top5.map(x => x[0]);
            pieData = top5.map(x => x[1]);
            pieLabels.push('Other');
            pieData.push(sorted.slice(5).reduce((a, c) => a + c[1], 0));
        } else {
            pieLabels = sorted.map(x => x[0]);
            pieData = sorted.map(x => x[1]);
        }

        if (myPieChart) myPieChart.destroy();
        myPieChart = new Chart(ctxPieEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieData,
                    backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#cbd5e1'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
        });
    }
}

// 8. FILE UPLOAD LISTENER
const uploadInput = document.getElementById('csv-upload');
if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => loadDashboard(e.target.result);
        reader.readAsText(file);
    });
}

// START
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});