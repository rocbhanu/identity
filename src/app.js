const express = require('express');
const identityRoutes = require('./routes/identityRoutes');
const app = express();
app.use(express.json());

app.use('/', identityRoutes);
app.use('/hello', (req, res)=>{res.send("Hello World!")})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});