const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const app = express();
const PORT = config.PORT;
const CONTENT_DIR = config.CONTENT_DIR;
const LOGS_DIR = config.LOGS_DIR;
const LOG_FILE = path.join(LOGS_DIR, 'server.log');

// Map status codes to custom HTML files
const errorPages = {
    400: path.join(CONTENT_DIR, '400.html'),
    401: path.join(CONTENT_DIR, '401.html'),
    403: path.join(CONTENT_DIR, '403.html'),
    404: path.join(CONTENT_DIR, '404.html'),
    500: path.join(CONTENT_DIR, '500.html'),
    502: path.join(CONTENT_DIR, '502.html'),
    503: path.join(CONTENT_DIR, '503.html')
};

function sendErrorPage(res, statusCode) {
    const file = errorPages[statusCode];
    if (file && fs.existsSync(file)) {
        res.status(statusCode).sendFile(file);
    } else {
        res.status(statusCode).send(`<h1>${statusCode} Error</h1><a href="/">Home</a>`);
    }
}

app.set('view engine', 'ejs');
app.set('views', CONTENT_DIR);

if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

function log(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    try { fs.appendFileSync(LOG_FILE, logLine); } catch(e) {}
    console.log(message);
}

log('Starting server...');
log(`Content directory: ${CONTENT_DIR}`);

if (!fs.existsSync(CONTENT_DIR)) {
    log('ERROR: Content directory missing');
    console.error('FATAL: Content directory missing');
    process.exit(1);
}

// Security middleware (uses custom 403)
app.use((req, res, next) => {
    let requestPath = req.path;
    if (requestPath.includes('..') || requestPath.includes('%2e%2e')) {
        log(`FORBIDDEN: Path traversal attempt from ${req.ip} - ${requestPath}`);
        return sendErrorPage(res, 403);
    }
    const resolvedPath = path.resolve(CONTENT_DIR, '.' + requestPath);
    if (!resolvedPath.startsWith(path.resolve(CONTENT_DIR))) {
        log(`FORBIDDEN: Attempted escape from ${req.ip} - ${requestPath}`);
        return sendErrorPage(res, 403);
    }
    const lowerPath = requestPath.toLowerCase();
    const filename = path.basename(lowerPath);
    if (config.SECURITY.blockExtensions.some(ext => lowerPath.endsWith(ext)) ||
        config.SECURITY.blockFiles.includes(filename)) {
        log(`FORBIDDEN: Blocked system file access from ${req.ip} - ${requestPath}`);
        return sendErrorPage(res, 403);
    }
    next();
});

app.use(express.static(CONTENT_DIR));

// Helper to load page data
function loadPageData(dataSource, dataFile) {
    const filePath = path.join(CONTENT_DIR, 'data', dataFile);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        log(`Error loading ${dataFile}: ${err.message}`);
        return null;
    }
}

// Load page definitions
const pagesPath = path.join(CONTENT_DIR, 'data', 'pages.json');
let pages = [];
try {
    pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
    log(`Loaded ${pages.length} page definitions from pages.json`);
} catch (err) {
    log(`ERROR: Could not load pages.json: ${err.message}`);
    process.exit(1);
}

// Dynamic routes
for (const page of pages) {
    app.get(page.route, (req, res) => {
        const data = loadPageData(page.dataSource, page.dataFile);
        if (data === null) {
            return sendErrorPage(res, 500);
        }
        res.render(page.view, { [page.dataSource]: data });
    });
    log(`Registered route: ${page.route} -> ${page.view}`);
}

// 404 handler for unmatched routes
app.use((req, res) => {
    sendErrorPage(res, 404);
});

// Global error handler (catches 500 errors)
app.use((err, req, res, next) => {
    log(`Unhandled error: ${err.message}`);
    sendErrorPage(res, 500);
});

app.listen(PORT, () => {
    log(`Server running on http://localhost:${PORT}`);
    console.log(`\nServer started successfully on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
    log(`Uncaught exception: ${err.message}`);
    console.error('Fatal error:', err);
    process.exit(1);
});