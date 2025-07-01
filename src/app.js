require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Impor semua route
const menuRoutes = require('./routes/menuRoutes');
const submenuRoutes = require('./routes/submenuRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');
const myRepositoryRoutes = require('./routes/myRepositoryRoutes');
const authRoutes = require('./routes/authRoutes');
const advisorRoutes = require('./routes/advisorRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*', // Izinkan semua origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan semua method
  allowedHeaders: ['Content-Type', 'Authorization'], // Izinkan header ini
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
//app.use(limiter);

// Gunakan semua route
app.use('/api/menu-items', menuRoutes);
app.use('/api/submenus', submenuRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repository-items', repositoryRoutes);
app.use('/api/my-repository', myRepositoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/advisor', advisorRoutes);
app.use('/api/upload', require('./routes/uploadRoutes'));

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
