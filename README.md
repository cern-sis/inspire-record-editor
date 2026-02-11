# INSPIRE HEP Record Editor

A web-based editor for viewing and editing INSPIRE HEP (High Energy Physics) records using JSON Schema-driven forms.

## Features

- **Record Fetching**: Fetch INSPIRE HEP records by their ID
- **Tabbed Editing**: Edit records across three organized tabs:
  - **Main**: Core metadata fields (titles, abstracts, DOIs, etc.)
  - **References**: Bibliography and citation data
  - **Authors**: Author and collaboration information
- **Live Preview Panel**:
  - PDF viewer for attached documents
  - DOI link and iframe preview
  - Raw JSON data viewer
- **Schema-driven Forms**: Uses [react-formule](https://github.com/cern-sis/react-formule) for dynamic form generation

## Project Structure

```
src/
├── components/
│   ├── AppFooter.tsx      # Footer with version info
│   ├── AppHeader.tsx      # Header with search input
│   ├── EditorTabs.tsx     # Main/References/Authors tabs
│   ├── PreviewPanel.tsx   # PDF/DOI/JSON preview
│   └── Sidebar.tsx        # Navigation sidebar
├── utils/
│   └── schemaUtils.ts     # Schema filtering utilities
├── services/
│   └── inspire.ts         # INSPIRE API client
├── configs.ts             # Tab field configurations
├── EditorApp.tsx          # Main application component
└── theme.ts               # Ant Design theme config
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Installation

```bash
yarn install
```

### Development

```bash
yarn dev
```

Visit `http://localhost:3030` to view the application.

### Building

```bash
yarn build
```

### Testing

Run Cypress tests in interactive mode:

```bash
yarn test:e2e
```

Run Cypress tests headlessly:

```bash
yarn test:e2e:run
```

## Usage

1. Enter an INSPIRE record ID in the search bar (e.g., `593382`)
2. Click "Fetch" or press Enter to load the record
3. Edit fields across the Main, References, and Authors tabs
4. Use the preview panel to view attached PDFs, DOI pages, or raw JSON

## Tech Stack

- **React 18** with TypeScript
- **Ant Design** for UI components
- **react-formule** for JSON Schema form rendering
- **Vite** for development and building
- **Cypress** for end-to-end testing

## License

MIT
