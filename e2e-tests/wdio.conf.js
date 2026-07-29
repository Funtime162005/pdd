const path = require('path');

exports.config = {
    // Runner Configuration
    runner: 'local',
    port: 4723,

    // Test Files
    specs: [
        './tests/**/*.js'
    ],
    exclude: [],

    // Capabilities
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554', // Default emulator
        'appium:automationName': 'UiAutomator2',
        'appium:app': path.join(process.cwd(), '../android/app/build/outputs/apk/release/app-release.apk'),
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
        'appium:noReset': true,
        'appium:fullReset': false,
    }],

    // Test Configurations
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // Services
    services: [
        ['appium', {
            command: 'appium',
            args: {
                relaxedSecurity: true,
                logLevel: 'info'
            }
        }]
    ],

    // Framework
    framework: 'mocha',
    reporters: [
        'spec',
        [require('./utils/ExcelReporter.js'), {
            outputDir: './reports',
            filename: 'E2E_Test_Report.xlsx'
        }]
    ],

    // Mocha setup
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
};
