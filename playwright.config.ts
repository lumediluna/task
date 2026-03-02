import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['list'],
        ['allure-playwright']
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: 'https://dev.3snet.info',
        headless: true,
        trace: 'on-first-retry'
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chrom',
            use: { ...devices['Desktop Chrome']},
        },

        {
            name: 'safari',
            use: { ...devices['Desktop Safari']},
        },
    ],


});
