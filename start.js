const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Starting web server listening on: http://localhost:${PORT}, at`, new Date().toLocaleTimeString()); // eslint-disable-line
});
