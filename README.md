# 🏥 OR Efficiency Scorecard

An interactive analytics dashboard designed to help hospital administrators and surgical managers track Operating Room performance. This tool visualizes key metrics such as **turnover times**, **surgery duration**, and **procedure volume**, with a focus on identifying top performance.

## 🚀 Live Demo
https://jy-crnz.github.io/Surgery-Operation-Dashoard/

### 📊 **Analytics & Visualization**
* **Dynamic KPI Cards:** Real-time calculation of Average Turnover, Duration, and Total Cases based on active filters.
* **Interactive Charts:**
    * **Bar Chart:** Visualizes surgeon efficiency by average duration.
    * **Doughnut Chart:** Displays the procedure volume mix (Top 5 + Others).
* **🏆 Top Performers Leaderboard:** A specialized modal ranking surgeons with the lowest turnover times (Gold/Silver/Bronze badges).

### 🛠 **Advanced Control & Tools**
* **📅 Date Range Filtering:** Drill down into specific time periods.
* **🔍 Smart Search:** Instantly filter records by Surgeon Name or Procedure type.
* **💾 CSV Export:** Download the currently filtered dataset as a formatted CSV file for external reporting.
* **↕️ Sortable Data Grid:** Clickable table headers to sort records by Date, Surgeon, Duration, or Turnover.

### 🎨 **Modern UI/UX**
* **Dark Mode Support:** Built-in theme toggler for light/dark viewing modes.
* **Responsive Design:** Optimized layout that adapts from desktop to mobile screens (stacking controls for better usability).
* **Medical Theme:** Clean, professional aesthetic with "Heartbeat" loading animation.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Custom Variables, CSS Grid, Flexbox)
* **Logic:** Vanilla JavaScript (ES6+)
* **Visualization:** Chart.js (v4.x)
* **Data Handling:** Client-side parsing and CSV generation (Blob API)
* **Deployment:** GitHub Pages

## 📸 Screenshots
<img width="1902" height="948" alt="image" src="https://github.com/user-attachments/assets/3dda9d6b-e42d-433b-97ed-40da990a31ec" />


<img width="1919" height="951" alt="image" src="https://github.com/user-attachments/assets/64649a9b-e622-40f8-bbed-67134f378f46" />


## 💡 How to Use
1. **Open the dashboard:** The data loads automatically.
2. **View Top Performers:** Click the "Top Performers" button (top right) to see a leaderboard of the most efficient surgeons.
3. **Filter Data:** Use the "All Surgeons" dropdown or the Date Range pickers to drill down into specific records.
4. **Filter by Procedure:** Use the "All Procedures" dropdown to instantly view specific surgery types (e.g., "Total Knee Arthroplasty").
5. **Sort Table:** Click any Table Header (like Turnover ↕) to organize the data from highest to lowest.
6. **Export Reports:** Click "Export CSV" to download the currently filtered view to your computer.
7. **Reset:** Click "Clear Filters" to instantly wipe all filters and view the full dataset again.
8. **View Deep Dive Stats:** Click on any of the three main cards (Turnover, Duration, or Total Cases) to reveal detailed analytics and insights.
