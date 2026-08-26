const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TRINITY</title>
      </head>
      <body style="
        margin:0;
        background:#000;
        color:#fff;
        font-family:Arial, sans-serif;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        text-align:center;
      ">
        <div>
          <h1 style="font-size:72px; margin:0;">TRINITY</h1>
          <p>SYSTEM ONLINE</p>
          <p>HOST: GLEN</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TRINITY ONLINE — PORT ${PORT}`);
});
