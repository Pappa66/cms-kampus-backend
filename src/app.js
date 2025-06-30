require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Impor semua route
const menuRoutes = require('./routes/menuRoutes');
const submenuRoutes = require('./routes/submenuRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Gunakan semua route
app.use('/api/menu-items', menuRoutes);
app.use('/api/submenus', submenuRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repository-items', repositoryRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});