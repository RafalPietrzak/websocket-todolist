import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {tasks: []};
  newMessageRefInput = React.createRef();
  componentDidUpdate(){
    this.scrollToInput()
  };
  componentDidMount(){
    this.socket = io('http://localhost:8000');
    this.socket.on('updateData', (tasks) => {
      this.setState({tasks: tasks});
    });
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id);
    });
    this.scrollToInput()
  };
  removeTaskHandler = (id) => {
    this.socket.emit('removeTask',{id: id});
    this.removeTask(id);
  };
  removeTask = (id) => {
    this.setState((state) => {
      const newTasks =  [...state.tasks];
      newTasks.some((task, taskIndex, taskArray) => {
        if(task.id === id) {
          taskArray.splice(taskIndex, 1);
        return true;
      }
        return false;
      });
      return {tasks: newTasks}
    });
  };
  scrollToInput = () => {
    this.newMessageRefInput.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  addTask = (task) => {
    this.setState((state) => {
      const newTasks = [...state.tasks];
      newTasks.push({
        id: uuidv4(),
        name: task,
      });
      return {tasks: newTasks};
    });
  };
  addTaskHandler = (e) => {
    e.preventDefault();
    const value = this.newMessageRefInput.current.value;
    if(value.length > 0){
      this.socket.emit('addTask',{task: value});
      this.newMessageRefInput.current.value = '';
      this.addTask(value);
    };
  };
  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task, id) => {
              return <li key={task.id} className="task">
                {task.name}
                <button 
                  className="btn btn--red"
                  onClick = {() => this.removeTaskHandler(task.id)}
                >
                  Remove
                </button>
              </li>
            })}
          </ul>
          <form id="add-task-form" onSubmit={this.addTaskHandler}>
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              ref={this.newMessageRefInput}
              />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };
};

export default App;