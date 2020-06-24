const express = require('express');
const socket = require('socket.io')
const app = express();
const tasks = [
  {id: 'adsadasdsaw34325', name: 'Test task 1'},
  {id: 'a34253r2', name: 'Test task 2'},
  {id: 'adsadas325', name: 'Test task 3'},
];

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
  socket.on('removeTask', ({id})=>{
    tasks.some((task, taskIndex, taskArray) => {
      if(task.id === id) {
        taskArray.splice(taskIndex, 1);
        socket.broadcast.emit('removeTask', id);
        return true;
      }
      return false;
    })
  });
});
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
