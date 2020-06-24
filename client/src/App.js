import React from 'react';
import io from 'socket.io-client';

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
    this.scrollToInput()
  };
  removeTask = (id) => {
    console.log('id:', id);
    this.socket.emit('removeTask',{index: id});
    this.setState((state) => {
      const newTasks =  [...state.tasks];
      newTasks.splice(id,1);
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
      newTasks.push(task);
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
              return <li key={id} className="task">
                {task}
                <button 
                  className="btn btn--red"
                  onClick = {() => this.removeTask(id)}
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