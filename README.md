### LoanMaster — Loan Calculator App

A modern, accessible React app to calculate loan payments for multiple loan types, generate amortization schedules, visualize costs, export reports to PDF, and compare scenarios. Built with React 18, React Router v6, Tailwind CSS, Recharts, and IndexedDB for offline comparisons.

---

### Features
- **Multi-loan support**: Mortgage, car, home, and mobile device loans
- **Payment calculation**: Monthly payment using standard amortization formula
- **Amortization schedules**: Detailed table with pagination and sorting
- **Extra payments**: Generate a schedule that includes extra principal payments
- **Charts**: Payment breakdown (pie) and balance over time (line)
- **Reports & exports**:
  - Quick “Loan Summary” PDF via `jsPDF`
  - Full amortization schedule PDF via `@react-pdf/renderer`
  - Print and Web Share API support
- **Comparison & offline**: Save multiple scenarios to IndexedDB and compare (works offline)
- **SEO-ready**: Dynamic titles/descriptions and canonical links with `react-helmet-async`
- **Accessibility**: Keyboard navigation, labels, skip links, and contrast-conscious UI
- **Sitemap**: Generated at build-time via a script

---

### Tech Stack
- **App**: React 18 (CRA), React Router v6
- **UI**: Tailwind CSS, Bootstrap (utility CSS), Heroicons
- **Charts**: Recharts
- **PDF/Export**: `jsPDF`, `@react-pdf/renderer`
- **State/Storage**: React state, IndexedDB
- **SEO**: `react-helmet-async`

---

### Getting Started

Prerequisites
- Node.js 16+ (recommended 18+)
- npm 8+

Install & Run
```bash
npm install
npm start
```
The app runs at `http://localhost:3000`.

Build
```bash
npm run build
```

Generate Sitemap
```bash
npm run generate-sitemap
```
This writes `public/sitemap.xml` using `scripts/generate-sitemap.js`. Update the base URL in that script before production builds.

Deploy to GitHub Pages
```bash
# Ensure repository is initialized and remote is set
# Update package.json "homepage" (already set to "./" for relative paths)

npm run predeploy   # builds the app
npm run deploy      # publishes the build with gh-pages
```
Note: For GitHub Pages custom domains, also update the base URL in `scripts/generate-sitemap.js` and SEO canonical links.

---

### Project Structure
```text
loan_Calculator_app/
├─ public/
│  ├─ index.html
│  ├─ manifest.json
│  ├─ favicon.* / logo*.png
│  ├─ offline.html
│  ├─ service-worker.js
│  └─ sitemap.xml (generated)
├─ src/
│  ├─ App.js                # Router + application state
│  ├─ index.js              # Entry point
│  ├─ index.css, App.css    # Global styles (Tailwind utilities)
│  ├─ components/
│  │  ├─ inputs/LoanInputForm.js
│  │  ├─ results/{SummaryCard.js, ExportButtons.js}
│  │  ├─ charts/{LoanPieChart.js, LoanBalanceChart.js}
│  │  ├─ tables/AmortizationTable.js
│  │  ├─ comparison/LoanComparison.js
│  │  ├─ layout/{MainLayout.js, Sidebar.js, Header.js, Footer.js}
│  │  └─ SEO/DynamicSEO.js
│  ├─ pages/{Dashboard.js, Calculator.js, Schedule.js, Reports.js, Accessibility.js}
│  ├─ AmortizationSchedule.js  # PDF via @react-pdf/renderer
│  ├─ utils/indexedDB.js       # Offline storage for comparisons
│  └─ reportWebVitals.js
├─ scripts/generate-sitemap.js
├─ tailwind.config.js
├─ package.json
└─ README.md
```

---

### How Calculations Work
- Monthly payment uses the standard amortization formula:
  \(M = P \cdot \frac{r(1+r)^n}{(1+r)^n - 1}\), where
  - \(P\) = principal (loan amount)
  - \(r\) = monthly interest rate (APR/12)
  - \(n\) = total number of payments (months)
- The app generates a period-by-period schedule with:
  - Payment, principal paid, interest paid, and remaining balance
  - Estimated dates based on a user-selected start date
- An alternate schedule includes an extra principal per payment (if provided).

Implementation references
- Calculation and schedule generation live in `src/App.js` (`calculateMonthlyPayment`, `generateSchedule`, and helpers)
- Schedules are consumed by `pages/Schedule.js` and rendered via `components/tables/AmortizationTable.js`

---

### Key Pages
- **Dashboard** (`pages/Dashboard.js`): High-level stats and charts
- **Calculator** (`pages/Calculator.js`): Main inputs, validation, and quick comparison entry
- **Schedule** (`pages/Schedule.js`): Amortization table or visual mode, with PDF export
- **Reports** (`pages/Reports.js`): Summary/comparison PDFs, insights, and chart toggles
- **Accessibility** (`pages/Accessibility.js`): App accessibility statement

---

### Comparison & Offline Support
- Save multiple loan scenarios to IndexedDB (`utils/indexedDB.js`)
- View and manage them in `components/comparison/LoanComparison.js`
- Works offline; background sync requested when supported

---

### Exporting & Printing
- Summary PDF: `Reports` page via `jsPDF`
- Full schedule PDF: `AmortizationSchedule.js` via `@react-pdf/renderer`
- Print and Web Share: `components/results/ExportButtons.js`

---

### SEO & Sitemap
- Dynamic titles, descriptions, and canonical tags: `components/SEO/DynamicSEO.js`
- Build-time sitemap generation: `scripts/generate-sitemap.js`
  - Set `baseUrl` before generating for production

---

### Accessibility
- Labels and validation messaging for all inputs
- Keyboard-friendly navigation
- Visible focus states and skip link (`components/accessibility/SkipLink.js`)
- Dark mode styles and color contrast considerations

---

### Styling
- Tailwind CSS with a custom theme in `tailwind.config.js`
- Utility component classes in `src/index.css` (`.card`, `.input-field`, `.btn-*`, etc.)

---

### Environment & Configuration
- No backend environment variables required by default
- Optional: Update SEO base URL and sitemap base URL before production deployment

---

### Known Notes
- `firebase.js` is present but not configured by default
- `package.json` name is `motage_calculator` (typo retained to avoid breaking); safe to rename if desired

---

### License
No explicit license is included. If you intend to open source, add a `LICENSE` file (e.g., MIT).

### Author
Created by Muhummad Umar Malik. Links available in the app footer (Website, LinkedIn, GitHub).
