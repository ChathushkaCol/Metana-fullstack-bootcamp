// server/jest.config.js or client/jest.config.js
module.exports = {
// ...existing
coverageThreshold: {
global: {
branches: 70,
functions: 80,
lines: 80,
statements: 80
}
}
};