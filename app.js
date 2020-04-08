const express = require('express');
const app = express();
const pg = require("./query.js");

app.use(express.json());

console.log( new Date());
console.log("a.js: ENTERING");

app.get('/productsdb/:id', (req, res) => {
  console.log("a.js: gP: ENTERED");
  pg.getProduct(req.params.id)
  .then((results) => {
    console.log("a.js gP: r.r.[0]: COMPLETED",results);
    res.send(results);
  })
  .catch(err => console.log(err));
});

const PORT = process.env.PORT || 3000;

console.log("a.js: LEAVING");
app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});