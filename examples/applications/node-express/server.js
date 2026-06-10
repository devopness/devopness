const express = require('express');
const path = require('path');
const homeRoutes = require('./routes/home');

const app = express();
const PORT = Number(process.env.PORT || 9000);

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error('PORT must be a number between 0 and 65535');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
