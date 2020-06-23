const express = require('express');
const socket = require('socket.io')
const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
const io = socket(app);
io.on('connect', (socket) => {

})
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
