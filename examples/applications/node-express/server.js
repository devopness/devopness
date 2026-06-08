const express = require('express');
const path = require('path');
const homeRoutes = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 9000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
