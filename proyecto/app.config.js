const { expo } = require('./app.json');
module.exports = {
  ...expo,
  name: 'UniBudget Social',
  slug: 'unibudget-social-lab05',
  scheme: 'unibudget',
  plugins: ['expo-router'],
  web: { ...expo.web, bundler: 'metro', output: 'static', name: 'UniBudget Social', description: 'Presupuesto y educación financiera para estudiantes' },
  experiments: { baseUrl: process.env.EXPO_PUBLIC_BASE_URL || '' },
};
