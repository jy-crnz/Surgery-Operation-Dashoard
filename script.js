/* ==========================================
   1. GLOBAL STATE
   ========================================== */
let allData = [];
let currentData = [];
let myBarChart = null;
let myPieChart = null;
let sortDirection = 1;
let currentPage = 1;
const rowsPerPage = 10;

/* ==========================================
   2. SMART PARSE (Robust CSV + Randomizer)
   ========================================== */
function smartParse(csvText) {
    if (!csvText) return [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Regex to handle commas inside quotes
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

    const generateRandomDate = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 90); 
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (row.length < 2) continue;

        const getVal = (idx) => (idx > -1 && row[idx]) ? row[idx].replace(/^"|"$/g, '').trim() : null;

        let procedure = getVal(colMap.procedure) || "Unknown Procedure";
        
        // Fill missing surgeon with random
        let surgeon = getVal(colMap.surgeon);
        if (!surgeon) surgeon = randomSurgeons[i % randomSurgeons.length]; 

        // Calculate duration if missing
        let duration = parseInt(getVal(colMap.duration));
        if (isNaN(duration) && colMap.startTime > -1 && colMap.endTime > -1) {
            const s = new Date(getVal(colMap.startTime));
            const e = new Date(getVal(colMap.endTime));
            duration = Math.round((e - s) / 60000);
        }
        if (isNaN(duration)) duration = 0;

        // Generate random turnover if missing (for demo purposes)
        let turnover = parseInt(getVal(colMap.turnover));
        if (isNaN(turnover)) turnover = Math.floor(Math.random() * (55 - 20) + 20);

        let surgeryDate = generateRandomDate();

        results.push({ 
            procedure, 
            surgeon, 
            duration, 
            turnover,
            date: surgeryDate 
        });
    }
    // Default sort by date descending
    return results.sort((a, b) => b.date - a.date);
}

/* ==========================================
   3. INITIALIZATION & DATA LOADING
   ========================================== */
function loadDashboard(customCSV = null) {
    let dataSource = customCSV;
    if (!dataSource) {
        if (typeof csvData !== 'undefined') {
            dataSource = csvData; // From database.js
        } else {
            console.error("ERROR: csvData not found in database.js.");
            return;
        }
    }
    allData = smartParse(dataSource);
    populateFilter();
    currentData = [...allData];
    renderDashboard();
}

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
    
    // Preserve selection if possible
    if(surgeons.includes(currentSelection)) filterSelect.value = currentSelection;
}

/* ==========================================
   4. FILTER ENGINE
   ========================================== */
function applyFilters() {
    currentPage = 1; // Reset to page 1 on new filter
    
    const surgeonSelect = document.getElementById('surgeon-filter');
    const searchInput = document.getElementById('search-input');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    const selectedSurgeon = surgeonSelect ? surgeonSelect.value : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    
    const startVal = startDateInput && startDateInput.value ? new Date(startDateInput.value) : null;
    const endVal = endDateInput && endDateInput.value ? new Date(endDateInput.value) : null;
    
    // Adjust end date to include the full day
    if (endVal) endVal.setHours(23, 59, 59, 999);

    let result = allData;

    // 1. Surgeon Filter
    if (selectedSurgeon !== 'all') {
        result = result.filter(item => item.surgeon === selectedSurgeon);
    }
    
    // 2. Search Filter
    if (searchTerm) {
        result = result.filter(item => 
            item.procedure.toLowerCase().includes(searchTerm) || 
            item.surgeon.toLowerCase().includes(searchTerm)
        );
    }
    
    // 3. Date Range Filter
    if (startVal) result = result.filter(item => item.date >= startVal);
    if (endVal) result = result.filter(item => item.date <= endVal);

    currentData = result;
    renderDashboard();
}

/* ==========================================
   5. PAGINATION LOGIC
   ========================================== */
function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    
    if (!prevBtn || !nextBtn || !pageInfo) return;

    const totalPages = Math.ceil(currentData.length / rowsPerPage);
    pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderDashboard();
    }
}

function nextPage() {
    const totalPages = Math.ceil(currentData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderDashboard();
    }
}

/* ==========================================
   6. SORTING LOGIC
   ========================================== */
function handleSort(key) {
    sortDirection *= -1; 
    currentPage = 1;

    // Update Visual Arrows
    updateSortIcons(key, sortDirection);

    currentData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        
        if (valA instanceof Date) return (valA - valB) * sortDirection;
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return -1 * sortDirection;
        if (valA > valB) return 1 * sortDirection;
        return 0;
    });
    renderDashboard();
}

function updateSortIcons(activeKey, direction) {
    const headers = document.querySelectorAll('th');
    
    // Reset all
    headers.forEach(th => {
        th.style.color = 'var(--secondary)';
        if (th.innerText.includes('↑') || th.innerText.includes('↓')) {
             th.innerText = th.innerText.replace(' ↑', ' ↕').replace(' ↓', ' ↕');
        }
    });

    // Set active
    headers.forEach(th => {
        if (th.getAttribute('onclick') && th.getAttribute('onclick').includes(activeKey)) {
            th.style.color = 'var(--primary)'; 
            const arrow = direction === 1 ? ' ↑' : ' ↓';
            th.innerText = th.innerText.replace(' ↕', arrow);
        }
    });
}

/* ==========================================
   7. DASHBOARD RENDERER
   ========================================== */
function renderDashboard() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return; 
    tableBody.innerHTML = '';

    // A. CALCULATE KPIs
    let totalDur = 0, totalTurn = 0, count = 0;
    currentData.forEach(item => {
        if(item.duration > 0) {
            totalDur += item.duration;
            totalTurn += item.turnover;
            count++;
        }
    });

    const avgDur = count ? (totalDur / count).toFixed(0) : 0;
    const avgTurn = count ? (totalTurn / count).toFixed(0) : 0;
    
    document.getElementById('total-cases').innerText = currentData.length;
    document.getElementById('avg-duration').innerText = avgDur + ' min';
    document.getElementById('avg-turnover').innerText = avgTurn + ' min';
    
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

    // B. RENDER TABLE
    if (currentData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No records found.</td></tr>';
        updatePaginationControls();
        // Clear charts if empty
        if (myBarChart) { myBarChart.destroy(); myBarChart = null; }
        if (myPieChart) { myPieChart.destroy(); myPieChart = null; }
        return;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = currentData.slice(startIndex, endIndex);

    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        const alertClass = item.turnover > 30 ? 'high-alert' : ''; 
        
        row.innerHTML = `
            <td style="color:var(--secondary); font-size:0.85rem;">${item.date.toLocaleDateString()}</td>
            <td>${item.procedure}</td>
            <td>${item.surgeon}</td>
            <td>${item.duration} min</td>
            <td class="${alertClass}">${item.turnover} min</td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationControls();
    renderCharts(currentData);
}

/* ==========================================
   8. CHART RENDERING
   ========================================== */
function renderCharts(data) {
    const ctxBarEl = document.getElementById('surgeonChart');
    const ctxPieEl = document.getElementById('procedureChart');

    // 1. SURGEON BAR CHART
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
                    borderRadius: 4,
                    hoverBackgroundColor: '#2563eb'
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } },
                onClick: (e, activeEls) => {
                    if (activeEls.length > 0) {
                        const index = activeEls[0].index;
                        const selectedSurgeon = barLabels[index];
                        document.getElementById('surgeon-filter').value = selectedSurgeon;
                        applyFilters();
                    }
                },
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                }
            }
        });
    }

    // 2. PROCEDURE DOUGHNUT CHART
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
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
                onClick: (e, activeEls) => {
                    if (activeEls.length > 0) {
                        const index = activeEls[0].index;
                        const selectedProc = pieLabels[index];
                        if(selectedProc === 'Other') return;
                        document.getElementById('search-input').value = selectedProc;
                        applyFilters();
                    }
                },
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                }
            }
        });
    }
}

/* ==========================================
   9. NEW FEATURE: LEADERBOARD LOGIC
   ========================================== */
function showLeaderboard() {
    const stats = {};
    
    // Calculate stats based on ALL data (Global Ranking)
    // If you want filtered ranking, use currentData instead of allData
    allData.forEach(d => {
        if(!stats[d.surgeon]) stats[d.surgeon] = { totalTurn: 0, count: 0 };
        stats[d.surgeon].totalTurn += d.turnover;
        stats[d.surgeon].count++;
    });

    // Convert to Array and Sort by LOWEST Avg Turnover
    const leaders = Object.keys(stats).map(name => ({
        name: name,
        avg: Math.round(stats[name].totalTurn / stats[name].count)
    }))
    .sort((a,b) => a.avg - b.avg) // Ascending (Lower is better)
    .slice(0, 5); // Take Top 5

    const listContainer = document.getElementById('leaderboard-list');
    if(listContainer) {
        listContainer.innerHTML = '';
        leaders.forEach((l, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-row';
            div.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <div class="lb-rank rank-${index+1}">${index+1}</div>
                    <div class="lb-name">${l.name}</div>
                </div>
                <div class="lb-stat">${l.avg} min avg</div>
            `;
            listContainer.appendChild(div);
        });
    }

    // Show Modal
    const modal = document.getElementById('leaderboard-modal');
    if(modal) modal.classList.remove('hidden');
}

/* ==========================================
   10. NEW FEATURE: EXPORT CSV
   ========================================== */
function exportToCSV() {
    if (!currentData || currentData.length === 0) {
        alert("No data to export!");
        return;
    }

    // 1. Headers
    const headers = ['Date', 'Procedure', 'Surgeon', 'Duration (min)', 'Turnover (min)'];

    // 2. Rows
    const rows = currentData.map(row => {
        let dateStr = row.date;
        if (row.date instanceof Date) {
            dateStr = row.date.toISOString().split('T')[0];
        }
        
        // Escape quotes
        const safeProcedure = `"${row.procedure.replace(/"/g, '""')}"`;
        const safeSurgeon = `"${row.surgeon.replace(/"/g, '""')}"`;

        return [
            dateStr,
            safeProcedure,
            safeSurgeon,
            row.duration,
            row.turnover
        ].join(',');
    });

    // 3. Create File
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'or_efficiency_data.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================
   11. EVENT LISTENERS & STARTUP
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    // -- Remove Loader --
    const loader = document.getElementById('loader-overlay');
    setTimeout(() => {
        if (loader) {
            loader.classList.add('loader-hidden');
            setTimeout(() => { loader.style.display = 'none'; }, 500); 
        }
    }, 1500);

    // -- Theme Init --
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') enableDarkMode();

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (htmlEl.getAttribute('data-theme') === 'dark') enableLightMode();
            else enableDarkMode();
        });
    }

    function enableDarkMode() {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateChartTheme('dark');
    }

    function enableLightMode() {
        htmlEl.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateChartTheme('light');
    }

    function updateChartTheme(mode) {
        const textColor = mode === 'dark' ? '#f1f5f9' : '#64748b';
        const gridColor = mode === 'dark' ? '#334155' : '#e2e8f0';
        if (window.Chart) {
            Chart.defaults.color = textColor;
            Chart.defaults.borderColor = gridColor;
            renderDashboard(); // Re-render to apply colors
        }
    }
});

// -- FILTER INPUTS --
const filterDropdown = document.getElementById('surgeon-filter');
const searchBox = document.getElementById('search-input');
const startDateEl = document.getElementById('start-date');
const endDateEl = document.getElementById('end-date');

if (filterDropdown) filterDropdown.addEventListener('change', applyFilters);
if (searchBox) searchBox.addEventListener('input', applyFilters);
if (startDateEl) startDateEl.addEventListener('change', applyFilters);
if (endDateEl) endDateEl.addEventListener('change', applyFilters);

// -- PAGINATION --
document.getElementById('prev-btn')?.addEventListener('click', prevPage);
document.getElementById('next-btn')?.addEventListener('click', nextPage);

// -- NEW BUTTON ACTIONS --
// 1. Export
const exportBtn = document.getElementById('export-btn');
if (exportBtn) exportBtn.addEventListener('click', exportToCSV);

// 2. Leaderboard
const leaderboardBtn = document.getElementById('leaderboard-btn');
if (leaderboardBtn) leaderboardBtn.addEventListener('click', showLeaderboard);

// 3. Info Modal
const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
if (infoBtn && infoModal) {
    infoBtn.addEventListener('click', () => infoModal.classList.remove('hidden'));
}

// 4. Clear Button
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        document.getElementById('surgeon-filter').value = 'all';
        document.getElementById('search-input').value = '';
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        currentPage = 1;
        applyFilters();
    });
}