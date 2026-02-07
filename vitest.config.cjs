const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
    test: {
        include: ['src/**/*.test.{js,ts,jsx,tsx}', 'src/**/*.spec.{js,ts,jsx,tsx}'],
        exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'playwright-report/**', 'html/**'],
    },
})
