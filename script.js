/* ==========================================
   1. GLOBAL STATE
   ========================================== */
let allData = [];
let currentData = [];
let myBarChart = null;
let myPieChart = null;
let myLineChart = null; 
let sortDirection = 1;
let currentPage = 1;
const rowsPerPage = 8; 

/* ==========================================
   2. SMART PARSE (Tuned for Service Line Analysis)
   ========================================== */
function smartParse(csvText) {
    if (!csvText) return [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    
    const colMap = {
        procedure: headers.indexOf('cpt description'), 
        service: headers.indexOf('service'),           
        date: headers.indexOf('date'),
        wheelsIn: headers.indexOf('wheels in'),        
        wheelsOut: headers.indexOf('wheels out'),      
        bookedTime: headers.findIndex(h => h.includes('booked time')) 
    };

    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (row.length < 2) continue;

        const getVal = (idx) => (idx > -1 && row[idx]) ? row[idx].replace(/^"|"$/g, '').trim() : null;

        let procedure = getVal(colMap.procedure) || "Unknown Procedure";
        let surgeon = getVal(colMap.service) || "General"; 

        let duration = 0;
        const tIn = getVal(colMap.wheelsIn);
        const tOut = getVal(colMap.wheelsOut);
        
        if (tIn && tOut) {
            const d1 = new Date(tIn);
            const d2 = new Date(tOut);
            if (!isNaN(d1) && !isNaN(d2)) {
                duration = Math.round((d2 - d1) / 60000); 
            }
        }
        if (duration === 0 || isNaN(duration)) {
            duration = parseInt(getVal(colMap.bookedTime)) || 60;
        }

        // Simulated Turnover
        let turnover = Math.floor(Math.random() * (60 - 15) + 15);

        let surgeryDate = new Date();
        if(colMap.date > -1 && getVal(colMap.date)) {
             surgeryDate = new Date(getVal(colMap.date));
        }

        results.push({ 
            procedure, 
            surgeon, 
            duration, 
            turnover,
            date: surgeryDate 
        });
    }
    
    // Sort Descending (Newest First)
    return results.sort((a, b) => b.date - a.date);
}

/* ==========================================
   3. INITIALIZATION & DATA LOADING
   ========================================== */
function loadDashboard(customCSV = null) {
    let dataSource = customCSV;
    if (!dataSource) {
        if (typeof csvData !== 'undefined') {
            dataSource = csvData; 
        } else {
            console.error("ERROR: csvData not found in database.js.");
            return;
        }
    }
    
    // Force exactly 327 rows for performance demo
    allData = smartParse(dataSource).slice(0, 327);
    
    populateFilters();
    setDateBoundaries(); // <--- LIMITS DATE PICKERS
    
    currentData = [...allData];
    renderDashboard();
}

/* ==========================================
   HELPER: DROPDOWNS & DATES
   ========================================== */
function updateProcedureOptions(selectedService) {
    const procedureSelect = document.getElementById('search-input');
    if (!procedureSelect) return;

    let relevantData = allData;
    if (selectedService !== 'all') {
        relevantData = allData.filter(d => d.surgeon === selectedService);
    }

    const procedures = [...new Set(relevantData.map(d => d.procedure))].sort();

    procedureSelect.innerHTML = '<option value="">All Procedures</option>';
    procedures.forEach(p => {
        const option = document.createElement('option');
        option.value = p;
        option.innerText = p;
        procedureSelect.appendChild(option);
    });
    procedureSelect.value = "";
}

function populateFilters() {
    const surgeonSelect = document.getElementById('surgeon-filter');
    if (surgeonSelect) {
        const services = [...new Set(allData.map(d => d.surgeon))].sort();
        surgeonSelect.innerHTML = '<option value="all">All Services</option>';
        services.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.innerText = s;
            surgeonSelect.appendChild(option);
        });
    }
    updateProcedureOptions('all');
}

function setDateBoundaries() {
    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');
    
    if (!allData.length || !startInput || !endInput) return;

    // Data is sorted Newest -> Oldest
    const maxDateObj = allData[0].date; 
    const minDateObj = allData[allData.length - 1].date;

    const toISODate = (d) => {
        return d instanceof Date && !isNaN(d) ? d.toISOString().split('T')[0] : '';
    };

    const minStr = toISODate(minDateObj);
    const maxStr = toISODate(maxDateObj);

    if (minStr && maxStr) {
        startInput.min = minStr;
        startInput.max = maxStr;
        endInput.min = minStr;
        endInput.max = maxStr;
    }
}

/* ==========================================
   4. FILTER ENGINE
   ========================================== */
function applyFilters() {
    currentPage = 1; 
    
    const surgeonSelect = document.getElementById('surgeon-filter');
    const procedureSelect = document.getElementById('search-input');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    const selectedService = surgeonSelect ? surgeonSelect.value : 'all';
    const selectedProcedure = procedureSelect ? procedureSelect.value : "";
    
    const startVal = startDateInput && startDateInput.value ? new Date(startDateInput.value) : null;
    const endVal = endDateInput && endDateInput.value ? new Date(endDateInput.value) : null;
    
    if (endVal) endVal.setHours(23, 59, 59, 999);

    let result = allData;

    if (selectedService !== 'all') {
        result = result.filter(item => item.surgeon === selectedService);
    }
    
    if (selectedProcedure !== "") {
        result = result.filter(item => item.procedure === selectedProcedure);
    }
    
    if (startVal) result = result.filter(item => item.date >= startVal);
    if (endVal) result = result.filter(item => item.date <= endVal);

    currentData = result;
    renderDashboard();
}

/* ==========================================
   5. PAGINATION LOGIC (EDITABLE)
   ========================================== */
function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInput = document.getElementById('page-input');
    const totalPagesSpan = document.getElementById('total-pages');
    
    if (!prevBtn || !nextBtn || !pageInput) return;

    const totalPages = Math.ceil(currentData.length / rowsPerPage) || 1;

    // Update Input Value
    pageInput.value = currentPage;
    pageInput.max = totalPages;
    totalPagesSpan.innerText = `of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
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
    headers.forEach(th => {
        th.style.color = 'var(--secondary)';
        if (th.innerText.includes('↑') || th.innerText.includes('↓')) {
             th.innerText = th.innerText.replace(' ↑', ' ↕').replace(' ↓', ' ↕');
        }
    });

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
    
    // Status Badge (Turnover)
    const statusEl = document.getElementById('turnover-status');
    if (statusEl) {
        const turnVal = parseFloat(avgTurn);
        if (turnVal <= 30) {
            statusEl.innerText = "Efficient";
            statusEl.className = "status-badge green";
        } else if (turnVal <= 50) {
            statusEl.innerText = "Standard";
            statusEl.className = "status-badge blue";
        } else {
            statusEl.innerText = "Needs Improvement";
            statusEl.className = "status-badge red";
        }
    }

    // SMART BADGE (Duration)
    const durationBadge = document.querySelector('.card:nth-of-type(2) .status-badge');
    const surgeonSelect = document.getElementById('surgeon-filter');
    const procedureSelect = document.getElementById('search-input');
    const isFiltered = (surgeonSelect && surgeonSelect.value !== 'all') || 
                       (procedureSelect && procedureSelect.value !== '');

    if (durationBadge) {
        if (isFiltered) {
            durationBadge.innerText = "Filtered View";
            durationBadge.style.opacity = "0.9";
            durationBadge.className = "status-badge blue"; 
        } else {
            durationBadge.innerText = "All Cases";
            durationBadge.style.opacity = "1";
        }
    }

    // B. RENDER TABLE
    if (currentData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No records found.</td></tr>';
        updatePaginationControls();
        if (myBarChart) { myBarChart.destroy(); myBarChart = null; }
        if (myPieChart) { myPieChart.destroy(); myPieChart = null; }
        if (myLineChart) { myLineChart.destroy(); myLineChart = null; }
        return;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = currentData.slice(startIndex, endIndex);

    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        const alertClass = item.turnover > 50 ? 'high-alert' : ''; 
        
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
    const ctxLineEl = document.getElementById('trendChart');

    // 1. SERVICE EFFICIENCY BAR CHART
    if (ctxBarEl) {
        const stats = {};
        data.forEach(s => {
            if (!stats[s.surgeon]) stats[s.surgeon] = { total: 0, count: 0 };
            stats[s.surgeon].total += s.duration;
            stats[s.surgeon].count++;
        });
        const barLabels = Object.keys(stats);
        const barData = barLabels.map(k => (stats[k].total / stats[k].count).toFixed(1));

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
                        const selectedService = barLabels[index];
                        document.getElementById('surgeon-filter').value = selectedService;
                        updateProcedureOptions(selectedService);
                        applyFilters();
                    }
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
                        
                        const drop = document.getElementById('search-input');
                        if(drop) {
                             drop.value = selectedProc;
                             if(drop.value !== selectedProc) drop.value = "";
                        }
                        applyFilters();
                    }
                }
            }
        });
    }
    
    // 3. TREND LINE CHART
    if (ctxLineEl) {
        const timeline = {};
        data.forEach(item => {
            if (item.date instanceof Date && !isNaN(item.date)) {
                const dateKey = item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!timeline[dateKey]) timeline[dateKey] = { total: 0, count: 0, rawDate: item.date };
                timeline[dateKey].total += item.turnover;
                timeline[dateKey].count++;
            }
        });

        const sortedTimeline = Object.entries(timeline)
            .map(([label, val]) => ({
                label,
                avg: (val.total / val.count).toFixed(1),
                rawDate: val.rawDate
            }))
            .sort((a, b) => a.rawDate - b.rawDate);

        const finalData = sortedTimeline.slice(-15); 
        const lineLabels = finalData.map(d => d.label);
        const lineValues = finalData.map(d => d.avg);

        if (myLineChart) myLineChart.destroy();
        myLineChart = new Chart(ctxLineEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: lineLabels,
                datasets: [{
                    label: 'Avg Turnover (min)',
                    data: lineValues,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#10b981',
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { 
                    y: { 
                        beginAtZero: true,
                        grid: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#334155' : '#e2e8f0' }
                    },
                    x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

/* ==========================================
   9. CARD DETAILS (MODALS)
   ========================================== */
function openDetailModal(type) {
    const modal = document.getElementById('details-modal');
    const titleEl = document.getElementById('detail-modal-title');
    const bodyEl = document.getElementById('detail-modal-body');
    
    if (!modal || !currentData.length) return;

    let content = '';
    const formatNum = (n) => new Intl.NumberFormat().format(n);

    if (type === 'turnover') {
        const fastCases = currentData.filter(d => d.turnover < 30).length;
        const slowCases = currentData.filter(d => d.turnover > 50).length;
        
        const totalTurn = currentData.reduce((acc, curr) => acc + curr.turnover, 0);
        const avgTurn = Math.round(totalTurn / currentData.length);
        const savedHours = Math.round(currentData.length * 5 / 60);

        let insightTitle = "💡 Efficiency Opportunity";
        let insightMsg = `Reducing average turnover by just 5 minutes would save approximately <strong>${savedHours} hours</strong> of total Operating Room time.`;
        let insightColor = "var(--primary)";

        if (avgTurn <= 30) {
            insightTitle = "🚀 High Performance";
            insightMsg = `Your team is operating at peak efficiency! Maintaining this <strong>${avgTurn} min</strong> average maximizes your daily case volume.`;
            insightColor = "var(--success)";
        }

        titleEl.innerHTML = `⏱️ Turnover Analysis`;
        content = `
            <div class="modal-stat-grid">
                <div class="modal-stat-box">
                    <div class="modal-stat-label" style="color:var(--success)">Efficient (<30m)</div>
                    <div class="modal-stat-value" style="color:var(--success)">${fastCases}</div>
                    <div style="font-size:0.8rem; opacity:0.7; margin-top:5px;">Cases</div>
                </div>
                <div class="modal-stat-box">
                    <div class="modal-stat-label" style="color:var(--danger)">Slow (>50m)</div>
                    <div class="modal-stat-value" style="color:var(--danger)">${slowCases}</div>
                    <div style="font-size:0.8rem; opacity:0.7; margin-top:5px;">Cases</div>
                </div>
            </div>
            
            <div class="insight-box" style="border-left-color: ${insightColor}">
                <strong style="color:${insightColor}">${insightTitle}</strong><br>
                ${insightMsg}
            </div>
        `;
    } 
    else if (type === 'duration') {
        const sorted = [...currentData].sort((a,b) => b.duration - a.duration);
        const longest = sorted[0];
        const shortest = sorted[sorted.length - 1];
        const median = sorted[Math.floor(sorted.length/2)].duration;

        titleEl.innerHTML = `⚡ Surgery Duration Breakdown`;
        content = `
            <div class="duration-list">
                <div class="duration-item">
                    <div>
                        <span class="duration-tag tag-long">Longest</span>
                        <div style="font-weight:600; margin-top:5px;">${longest.procedure}</div>
                    </div>
                    <div style="font-size:1.2rem; font-weight:700;">${longest.duration}m</div>
                </div>
                <div class="duration-item">
                    <div>
                        <span class="duration-tag tag-med">Median</span>
                        <div style="font-weight:600; margin-top:5px;">Typical Case Duration</div>
                    </div>
                    <div style="font-size:1.2rem; font-weight:700;">${median}m</div>
                </div>
                <div class="duration-item">
                    <div>
                        <span class="duration-tag tag-short">Shortest</span>
                        <div style="font-weight:600; margin-top:5px;">${shortest.procedure}</div>
                    </div>
                    <div style="font-size:1.2rem; font-weight:700;">${shortest.duration}m</div>
                </div>
            </div>
        `;
    } 
    else if (type === 'cases') {
        // --- IMPROVED VOLUME ANALYSIS ---
        const totalCases = currentData.length;
        const uniqueServices = new Set(currentData.map(d => d.surgeon)).size;
        const uniqueProcs = new Set(currentData.map(d => d.procedure)).size;
        
        const totalDuration = currentData.reduce((acc, curr) => acc + curr.duration, 0);
        const totalHours = (totalDuration / 60).toFixed(1); 
        const avgCaseDuration = totalCases > 0 ? Math.round(totalDuration / totalCases) : 0;

        titleEl.innerHTML = `📄 Case Volume Analysis`;
        content = `
            <div class="modal-stat-grid" style="grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="modal-stat-box" style="background: rgba(37, 99, 235, 0.05); border-color: var(--primary);">
                    <div class="modal-stat-label" style="color:var(--primary)">Total Cases</div>
                    <div class="modal-stat-value" style="color:var(--primary); font-size: 2.2rem;">${totalCases}</div>
                </div>
                <div class="modal-stat-box">
                    <div class="modal-stat-label">Total OR Time</div>
                    <div class="modal-stat-value">${formatNum(totalHours)}<span style="font-size:1rem; color:var(--secondary);"> hrs</span></div>
                </div>
                <div class="modal-stat-box">
                    <div class="modal-stat-label">Procedure Types</div>
                    <div class="modal-stat-value">${uniqueProcs}</div>
                </div>
                <div class="modal-stat-box">
                    <div class="modal-stat-label">Avg Case Dur.</div>
                    <div class="modal-stat-value">${avgCaseDuration}<span style="font-size:1rem; color:var(--secondary);"> min</span></div>
                </div>
            </div>
            <p style="text-align:center; margin-top:10px; color:var(--secondary); font-size:0.85rem;">
                <span style="display:inline-block; width:8px; height:8px; background:var(--primary); border-radius:50%; margin-right:5px;"></span>
                Active Service Line: <strong>${uniqueServices === 1 ? currentData[0].surgeon : 'Multiple'}</strong>
            </p>
        `;
    }
    bodyEl.innerHTML = content;
    modal.classList.remove('hidden');
}

/* ==========================================
   10. LEADERBOARD & EXPORT
   ========================================== */
function showLeaderboard() {
    const stats = {};
    allData.forEach(d => {
        if(!stats[d.surgeon]) stats[d.surgeon] = { totalTurn: 0, count: 0 };
        stats[d.surgeon].totalTurn += d.turnover;
        stats[d.surgeon].count++;
    });

    const leaders = Object.keys(stats).map(name => ({
        name: name,
        avg: Math.round(stats[name].totalTurn / stats[name].count)
    })).sort((a,b) => a.avg - b.avg).slice(0, 5);

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
    document.getElementById('leaderboard-modal').classList.remove('hidden');
}

function exportToCSV() {
    if (!currentData.length) { alert("No data to export!"); return; }
    const headers = ['Date', 'Procedure', 'Service', 'Duration (min)', 'Turnover (min)'];
    const rows = currentData.map(row => {
        let dateStr = row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date;
        return [dateStr, `"${row.procedure}"`, `"${row.surgeon}"`, row.duration, row.turnover].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'or_efficiency_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================
   11. EVENT LISTENERS
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    const loader = document.getElementById('loader-overlay');
    setTimeout(() => { if (loader) loader.classList.add('loader-hidden'); }, 1500);

    const themeBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(window.Chart) { Chart.defaults.color = '#f1f5f9'; Chart.defaults.borderColor = '#334155'; }
    }
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const html = document.documentElement;
            const isLight = html.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if(window.Chart) {
                Chart.defaults.color = isLight ? '#f1f5f9' : '#64748b';
                Chart.defaults.borderColor = isLight ? '#334155' : '#e2e8f0';
                renderDashboard();
            }
        });
    }
});

// Dependent Dropdown Listener
document.getElementById('surgeon-filter')?.addEventListener('change', (e) => {
    updateProcedureOptions(e.target.value);
    applyFilters();
});

document.getElementById('search-input')?.addEventListener('change', applyFilters);
document.getElementById('start-date')?.addEventListener('change', applyFilters);
document.getElementById('end-date')?.addEventListener('change', applyFilters);
document.getElementById('prev-btn')?.addEventListener('click', prevPage);
document.getElementById('next-btn')?.addEventListener('click', nextPage);
document.getElementById('export-btn')?.addEventListener('click', exportToCSV);
document.getElementById('leaderboard-btn')?.addEventListener('click', showLeaderboard);
document.getElementById('info-btn')?.addEventListener('click', () => document.getElementById('info-modal').classList.remove('hidden'));
document.getElementById('clear-btn')?.addEventListener('click', () => {
    document.getElementById('surgeon-filter').value = 'all';
    document.getElementById('search-input').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    
    // Reset dependent dropdown to full list
    updateProcedureOptions('all');
    
    currentPage = 1;
    applyFilters();
});

/* NEW: JUMP TO PAGE LISTENER */
const pageInput = document.getElementById('page-input');
if (pageInput) {
    pageInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        const totalPages = Math.ceil(currentData.length / rowsPerPage) || 1;

        if (isNaN(val) || val < 1) val = 1;
        if (val > totalPages) val = totalPages;

        currentPage = val;
        renderDashboard();
        e.target.blur(); 
    });
}