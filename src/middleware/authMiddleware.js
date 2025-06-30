const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];
      
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Tambahkan info user dari token ke object request
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Tidak terautentikasi, token gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak terautentikasi, tidak ada token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Tidak diizinkan, hanya untuk admin' });
  }
};

module.exports = { protect, isAdmin };