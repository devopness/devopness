const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Devopness ❤️ Node.js',
    devopnessLogoURL: 'https://assets.devopness.com/images/logo-devopness-primary.svg',
    nodeLogoURL: 'https://assets.devopness.com/images/icons_svgs/nodejs.svg',
    descriptions: [
      'With Devopness, you can easily set up and manage your Node.js app deployments in the cloud without hassle.',
      'Automate server provisioning, implement CI/CD pipelines, and scale your project with just a few clicks.'
    ]
  });
});

module.exports = router;
