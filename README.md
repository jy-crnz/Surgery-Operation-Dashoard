# 🏥 OR Efficiency Scorecard

An interactive analytics dashboard designed to help hospital administrators and surgical managers track Operating Room performance. This tool visualizes key metrics such as **turnover times**, **surgery duration**, and **procedure volume**, with a focus on identifying service line efficiency.

## 🚀 Live Demo
[**Click here to view the Live Dashboard**](https://jy-crnz.github.io/Surgery-Operation-Dashoard/)

## ✨ Key Features

### 📊 **Deep-Dive Analytics**
* **Interactive KPI Cards:** Clickable metric cards (Turnover, Duration, Total Cases) that open detailed modal reports.
    * **Turnover Analysis:** Breaks down cases into "Efficient" (<30m) vs "Slow" (>50m) categories.
    * **Volume Stats:** Displays Total Cases, Total OR Hours, and Unique Procedure counts.
* **Dynamic Charts:**
    * **Service Efficiency (Bar):** Visualizes average case duration by service line.
    * **Procedure Mix (Doughnut):** Shows the top 5 procedures plus a consolidated "Other" category.
    * **Efficiency Trend (Line):** Tracks turnover performance over time.
* **🏆 Leaderboard:** A specialized modal ranking services with the best turnover times (Gold/Silver/Bronze badges).

### 🛠 **Advanced Controls & Workflow**
* **🔗 Cascading Dropdowns:** Selecting a "Service" (e.g., Orthopedics) automatically filters the "Procedure" dropdown to show only relevant surgeries.
* **📅 Smart Date Boundaries:** Date pickers automatically restrict selection to the actual range of the dataset, preventing invalid date errors.
* **🔢 Editable Pagination:** Jump instantly to specific pages in the data table by typing the page number.
* **💾 CSV Export:** Download the currently filtered view as a CSV file for external reporting.

### 🎨 **Modern UI/UX**
* **Context-Aware Badges:** UI badges update dynamically (e.g., changing from "All Cases" to "Filtered View") to indicate active filters.
* **Responsive Design:** Optimized Flexbox/Grid layout that stacks controls gracefully on mobile screens.
* **Dark Mode:** Built-in theme toggler for comfortable viewing in low-light environments.


## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox, Grid)
* **Logic:** Vanilla JavaScript (ES6+)
* **Visualization:** Chart.js (v4.x)
* **Data Handling:** Client-side CSV parsing, custom sorting algorithms, and Blob API for exports.
* **Icons:** Heroicons (SVG)


## 📸 Screenshots

### Dashboard Overview
<img width="1902" alt="Dashboard Overview" src="https://github.com/user-attachments/assets/3dda9d6b-e42d-433b-97ed-40da990a31ec" />

### Deep Dive Modals & Filters
<img width="1919" alt="Modals and Filters" src="https://github.com/user-attachments/assets/64649a9b-e622-40f8-bbed-67134f378f46" />


## 💡 How to Use

1.  **Dashboard Overview:** The data loads automatically upon opening.
2.  **Filter by Service:** Select a Service (e.g., "Vascular") from the first dropdown.
    * *Note: This will automatically update the Procedure dropdown to show only Vascular procedures.*
3.  **Filter by Procedure:** Drill down further by selecting a specific surgery type.
4.  **Analyze Details:** Click on the **colored metric cards** at the top to view detailed breakdowns (Volume, Time Saved, etc.).
5.  **Navigate Data:** Use the **Jump-to-Page** input at the bottom of the table to quickly navigate large datasets.
6.  **Export:** Click **"Export CSV"** to download the data currently visible in your view.
7.  **Reset:** Click **"Clear Filters"** to wipe all selections and return to the full dataset.


## 📝 Credits
* **Data Source:** [Kaggle: Operating Room Utilization Dataset](https://www.kaggle.com/datasets/thedevastator/optimizing-operating-room-utilization)
* **Development:** Built by **[Your Name/Username]**
