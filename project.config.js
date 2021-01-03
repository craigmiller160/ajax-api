const path = require('path');

module.exports = {
    jestSetupFiles: [
        path.resolve(process.cwd(), 'test/setupTests.ts')
    ]
}
