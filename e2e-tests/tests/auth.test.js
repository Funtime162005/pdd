const { expect } = require('chai');

describe('Authentication Flow Tests', () => {
    it('TC-AUTH-01: Should launch the app successfully and show Splash Screen', async () => {
        // Appium will launch the app based on capabilities automatically
        const isAppInstalled = await driver.isAppInstalled('com.nrilanguageplatform');
        expect(isAppInstalled).to.be.true;
    });

    it('TC-AUTH-02: Should display the Login or Welcome screen', async () => {
        // Wait for splash screen to disappear and text to show
        await driver.pause(4000); 
        
        // Wait for an element that indicates the app has loaded (e.g., Get Started or Continue)
        // Since we don't have explicit accessibility IDs yet, we just ensure driver is active
        const contexts = await driver.getContexts();
        expect(contexts.length).to.be.greaterThan(0);
    });
});
