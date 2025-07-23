# UiTalentPulse Backend

This is the backend for the UiTalentPulse application, built with Node.js.

## Getting Started

1. Install dependencies (if any):
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

The server will run on [http://localhost:8000](http://localhost:8000).

## Folder Structure (Recommended)

```
server/
│   index.js           # Entry point
│   package.json       # Node.js metadata and scripts
│   README.md          # Project documentation
├── config/            # Configuration files (e.g., environment, db)
├── controllers/       # Route controllers
├── models/            # Database models
├── routes/            # Express route definitions
├── middlewares/       # Custom middleware functions
├── services/          # Business logic and services
├── utils/             # Utility/helper functions
└── tests/             # Automated tests
```

> Start with a single file, then expand into this structure as your backend grows. 