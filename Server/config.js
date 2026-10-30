const path = require('path');

module.exports = {
    PORT: 8080,
    CONTENT_DIR: path.join(__dirname, '../Content'),
    LOGS_DIR: path.join(__dirname, '../Logs'),
    SECURITY: {
        blockExtensions: ['.bat', '.cmd', '.exe', '.ps1', '.sh'],
        blockFiles: ['server.js', 'package.json', 'package-lock.json', 'command_loop.bat', 'start.bat']
    }
};