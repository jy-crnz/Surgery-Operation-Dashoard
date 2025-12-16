/* ==========================================
   1. GLOBAL STATE
   ========================================== */
let allData = [];
let currentData = [];
let myBarChart = null;
let myPieChart = null;
let sortDirection = 1;
let currentPage = 1;
const rowsPerPage = 10; // Change to 8 if you want to remove the scrollbar

/* ==========================================
   2. SMART PARSE (Handles CSV Logic)
   ========================================== */
function smartParse(csvText) {
    if (!csvText) return [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Regex to handle commas inside quotes (e.g., "Hernia Repair, Inguinal")
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    
    const colMap = {
        procedure: headers.findIndex(h => h.includes('procedure')),
        surgeon: headers.findIndex(h => h.includes('surgeon')),
        duration: headers.findIndex(h => h.includes('duration')),
        turnover: headers.findIndex(h => h.includes('turnover')),
        // Optional date parsing if your CSV has dates, otherwise we generate them below
        date: headers.findIndex(h => h.includes('date')) 
    };

    const results = [];
    
    // Helper to generate a date within the last 3 months if missing
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
        let surgeon = getVal(colMap.surgeon) || "Unknown Surgeon";
        let duration = parseInt(getVal(colMap.duration)) || 0;
        let turnover = parseInt(getVal(colMap.turnover)) || 0;

        // Use CSV date if available, otherwise generate random
        let surgeryDate;
        if(colMap.date > -1 && getVal(colMap.date)) {
             surgeryDate = new Date(getVal(colMap.date));
        } else {
             surgeryDate = generateRandomDate();
        }

        results.push({ 
            procedure, 
            surgeon, 
            duration, 
            turnover,
            date: surgeryDate 
        });
    }
    
    // Sort by date descending (newest first)
    return results.sort((a, b) => b.date - a.date);
}

/* ==========================================
   3. INITIALIZATION & DATA LOADING
   ========================================== */
function loadDashboard(customCSV = null) {
    let dataSource = customCSV;
    if (!dataSource) {
        // Check if database.js is loaded
        if (typeof csvData !== 'undefined') {
            dataSource = csvData; 
        } else {
            console.error("ERROR: csvData not found in database.js.");
            return;
        }
    }
    
    // Parse data and force exactly 327 records as requested
    allData = smartParse(dataSource).slice(0, 327);
    
    populateFilters();
    currentData = [...allData];
    renderDashboard();
}

function populateFilters() {
    // 1. Populate Surgeon Dropdown
    const surgeonSelect = document.getElementById('surgeon-filter');
    if (surgeonSelect) {
        const currentSurgeon = surgeonSelect.value;
        const surgeons = [...new Set(allData.map(d => d.surgeon))].sort();
        
        surgeonSelect.innerHTML = '<option value="all">All Surgeons</option>';
        surgeons.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.innerText = s;
            surgeonSelect.appendChild(option);
        });
        // Restore selection if valid
        if(surgeons.includes(currentSurgeon)) surgeonSelect.value = currentSurgeon;
    }

    // 2. Populate Procedure Dropdown (Dynamic)
    const procedureSelect = document.getElementById('search-input');
    if (procedureSelect) {
        const currentProc = procedureSelect.value;
        const procedures = [...new Set(allData.map(d => d.procedure))].sort();

        procedureSelect.innerHTML = '<option value="">All Procedures</option>';
        procedures.forEach(p => {
            const option = document.createElement('option');
            option.value = p;
            option.innerText = p;
            procedureSelect.appendChild(option);
        });
        // Restore selection if valid
        if(procedures.includes(currentProc)) procedureSelect.value = currentProc;
    }
}

/* ==========================================
   4. FILTER ENGINE
   ========================================== */
function applyFilters() {
    currentPage = 1; // Reset to page 1 on new filter
    
    const surgeonSelect = document.getElementById('surgeon-filter');
    const procedureSelect = document.getElementById('search-input');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    const selectedSurgeon = surgeonSelect ? surgeonSelect.value : 'all';
    const selectedProcedure = procedureSelect ? procedureSelect.value : "";
    
    const startVal = startDateInput && startDateInput.value ? new Date(startDateInput.value) : null;
    const endVal = endDateInput && endDateInput.value ? new Date(endDateInput.value) : null;
    
    // Adjust end date to include the full day
    if (endVal) endVal.setHours(23, 59, 59, 999);

    let result = allData;

    // 1. Surgeon Filter
    if (selectedSurgeon !== 'all') {
        result = result.filter(item => item.surgeon === selectedSurgeon);
    }
    
    // 2. Procedure Filter (Exact Match)
    if (selectedProcedure !== "") {
        result = result.filter(item => item.procedure === selectedProcedure);
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
        // Clear charts
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
}

/* ==========================================
   9. NEW FEATURE: CARD DETAILS (Interactive)
   ========================================== */
function openDetailModal(type) {
    const modal = document.getElementById('details-modal');
    const titleEl = document.getElementById('detail-modal-title');
    const bodyEl = document.getElementById('detail-modal-body');
    
    if (!modal || !currentData.length) return;

    let content = '';

    if (type === 'turnover') {
        titleEl.textContent = '⏱️ Turnover Analysis';
        const fastCases = currentData.filter(d => d.turnover < 25).length;
        const slowCases = currentData.filter(d => d.turnover > 40).length;
        content = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:15px;">
                <div style="padding:15px; background:rgba(16, 185, 129, 0.1); border-radius:8px;">
                    <strong style="color:var(--success)">Efficient Cases (< 25m)</strong>
                    <div style="font-size:1.5rem; font-weight:700;">${fastCases}</div>
                </div>
                <div style="padding:15px; background:rgba(239, 68, 68, 0.1); border-radius:8px;">
                    <strong style="color:var(--danger)">Slow Cases (> 40m)</strong>
                    <div style="font-size:1.5rem; font-weight:700;">${slowCases}</div>
                </div>
            </div>
            <p><strong>Insight:</strong> Reducing average turnover by 5 minutes could save approx. <strong>${Math.round(currentData.length * 5 / 60)} hours</strong> of OR time.</p>
        `;
    } 
    else if (type === 'duration') {
        titleEl.textContent = '⚡ Surgery Duration Breakdown';
        const sorted = [...currentData].sort((a,b) => b.duration - a.duration);
        const longest = sorted[0];
        const shortest = sorted[sorted.length - 1];
        content = `
            <ul style="list-style:none; padding:0; line-height:2;">
                <li><strong>Longest Surgery:</strong> ${longest.duration} min <span style="color:var(--secondary)">(${longest.procedure})</span></li>
                <li><strong>Shortest Surgery:</strong> ${shortest.duration} min <span style="color:var(--secondary)">(${shortest.procedure})</span></li>
                <li style="margin-top:10px; border-top:1px solid var(--border); padding-top:10px;">
                    <strong>Median Duration:</strong> ${sorted[Math.floor(sorted.length/2)].duration} min
                </li>
            </ul>
        `;
    } 
    else if (type === 'cases') {
        titleEl.textContent = '📄 Case Volume Stats';
        const uniqueSurgeons = new Set(currentData.map(d => d.surgeon)).size;
        const uniqueProcs = new Set(currentData.map(d => d.procedure)).size;
        content = `
             <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                <div style="text-align:center;">
                    <div style="font-size:1.8rem; font-weight:700; color:var(--primary);">${uniqueSurgeons}</div>
                    <div style="font-size:0.85rem; color:var(--secondary);">Active Surgeons</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.8rem; font-weight:700; color:var(--primary);">${uniqueProcs}</div>
                    <div style="font-size:0.85rem; color:var(--secondary);">Unique Procedures</div>
                </div>
            </div>
            <p style="text-align:center; color:var(--secondary); font-size:0.9rem;">Displaying data for currently filtered date range.</p>
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
    const headers = ['Date', 'Procedure', 'Surgeon', 'Duration (min)', 'Turnover (min)'];
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

// Controls
document.getElementById('surgeon-filter')?.addEventListener('change', applyFilters);
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
    currentPage = 1;
    applyFilters();
});

/* ==========================================
   12. IMPROVED CARD DETAILS LOGIC
   ========================================== */
function openDetailModal(type) {
    const modal = document.getElementById('details-modal');
    const titleEl = document.getElementById('detail-modal-title');
    const bodyEl = document.getElementById('detail-modal-body');
    
    if (!modal || !currentData.length) return;

    let content = '';

    // Helper to format numbers
    const formatNum = (n) => new Intl.NumberFormat().format(n);

    if (type === 'turnover') {
        const fastCases = currentData.filter(d => d.turnover < 25).length;
        const slowCases = currentData.filter(d => d.turnover > 40).length;
        const savedHours = Math.round(currentData.length * 5 / 60);

        titleEl.innerHTML = `⏱️ Turnover Analysis`;
        
        content = `
            <div class="modal-stat-grid">
                <div class="modal-stat-box">
                    <div class="modal-stat-label" style="color:var(--success)">Efficient (<25m)</div>
                    <div class="modal-stat-value" style="color:var(--success)">${fastCases}</div>
                    <div style="font-size:0.8rem; opacity:0.7; margin-top:5px;">Cases</div>
                </div>
                <div class="modal-stat-box">
                    <div class="modal-stat-label" style="color:var(--danger)">Slow (>40m)</div>
                    <div class="modal-stat-value" style="color:var(--danger)">${slowCases}</div>
                    <div style="font-size:0.8rem; opacity:0.7; margin-top:5px;">Cases</div>
                </div>
            </div>
            
            <div class="insight-box">
                <strong style="color:var(--primary)">💡 Efficiency Insight</strong><br>
                Reducing average turnover by just 5 minutes would save approximately <strong>${savedHours} hours</strong> of total Operating Room time.
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
        const uniqueSurgeons = new Set(currentData.map(d => d.surgeon)).size;
        const uniqueProcs = new Set(currentData.map(d => d.procedure)).size;
        const totalDuration = currentData.reduce((acc, curr) => acc + curr.duration, 0);
        const totalHours = Math.round(totalDuration / 60);

        titleEl.innerHTML = `📄 Case Volume Stats`;

        content = `
             <div class="modal-stat-grid">
                <div class="modal-stat-box">
                    <div class="modal-stat-label">Surgeons</div>
                    <div class="modal-stat-value" style="color:var(--primary)">${uniqueSurgeons}</div>
                </div>
                <div class="modal-stat-box">
                    <div class="modal-stat-label">Procedures</div>
                    <div class="modal-stat-value" style="color:var(--primary)">${uniqueProcs}</div>
                </div>
            </div>

            <div style="text-align:center; padding: 20px; background:var(--background); border-radius:12px; border:1px solid var(--border);">
                <div style="font-size:0.9rem; color:var(--secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Total OR Time Used</div>
                <div style="font-size:2.5rem; font-weight:800; color:var(--text-main);">${formatNum(totalHours)} <span style="font-size:1rem; font-weight:500; color:var(--secondary);">hours</span></div>
            </div>
            
            <p style="text-align:center; margin-top:20px; color:var(--secondary); font-size:0.85rem;">
                Displaying data for currently active filters.
            </p>
        `;
    }

    bodyEl.innerHTML = content;
    modal.classList.remove('hidden');
}