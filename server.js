const express = require('express');
const socket = require('socket.io')
const app = express();
let tasks = ['Test task 1', 'Test task 2', 'Test task 3', 'Test task 4'];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
const io = socket(server);
io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', ({task})=>{
    if(typeof task === 'string' && task.length > 0) {
      tasks.push(task);
      socket.broadcast.emit('addTask', task);
    }
  });
  socket.on('removeTask', ({index})=>{
    tasks.splice(index, 1);
    socket.broadcast.emit('updateData', tasks);
  });
});
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
