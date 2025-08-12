// const AuthService = require('../services/authService');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body; // role optional, default user
//     const data = await AuthService.register({ name, email, password, role });
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const data = await AuthService.login({ email, password });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


const AuthService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const result = await AuthService.register({ username, email, password, role });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refresh(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
