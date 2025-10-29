const express = require('express');
const app = express();
const port = 3000;

//im pretty sure its express thats causing issues with the css scoping
//have to serce the static files correctly
app.use(express.static('frontend'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


