const LicenseService = require('../services/licenseService');

exports.create = async (req, res) => {
  try {
    // You should have authentication middleware and role check for admin here
    const { product, plan, expiresInDays, maxDevices, metadata } = req.body;
    const license = await LicenseService.create({ product, plan, expiresInDays, maxDevices, metadata });
    return res.status(201).json(license);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.validate = async (req, res) => {
  const { licenseKey } = req.body;
  try {
    const result = await LicenseService.validate(licenseKey);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
