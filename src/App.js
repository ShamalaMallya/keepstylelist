import React, { Component } from "react";
import logo from "./logo.svg";
import "./CSS/App.css";

class TaskObject {
  constructor(taskName, isTaskCompleted) {
    this.taskName = taskName;
    this.isTaskCompleted = isTaskCompleted;
  }
  onTaskUpdate() {
    this.isTaskCompleted = !this.isTaskCompleted;
  }
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Keep Like List</h1>
        </header>
        <div className="App-intro">
          <ItemList />
        </div>
      </div>
    );
  }
}
class ItemList extends Component {
  constructor(props) {
    super(props);
    this.addTask = this.addTask.bind(this);
    this.state = { taskList: [] };
    this.onTaskComplete = this.onTaskComplete.bind(this);
    this.everyTask = this.everyTask.bind(this);    
    this.showTaskCount = this.showTaskCount.bind(this);
  }
  addTask(event) {
    if (event.key === "Enter") {
      var newTask = new TaskObject(event.target.value, false);
      let arr = this.state.taskList;
      arr.push(newTask);
      this.setState({ taskList: arr });
      event.target.value = "";
    }
  }
  everyTask(task, index) {
    return (
      <Item
        taskName={task.taskName}
        isCompleted={task.isTaskCompleted}
        key={index}
        index={index}
        onTaskComplete={this.onTaskComplete}
      />
    );
  }
  onTaskComplete(event, index) {
    var tasks = this.state.taskList;
    tasks[index].onTaskUpdate();
    this.setState({ taskList: tasks });
  }
  showTaskCount(){
    let compeletedTaskCount = this.state.taskList.filter((task)=> task.isTaskCompleted).length;
    console.log(compeletedTaskCount);
    if(compeletedTaskCount  > 0 || this.state.taskList.length !== 0)
    {
      return <h4>Tasks completed : {compeletedTaskCount}</h4>;
    }
    else{
      return;
    }
  }
  render() {
    
    return (
      <div className="itemList">
        <input
          type="textbox"
          placeholder="Task Name"
          onKeyPress={this.addTask}
        />
        {this.showTaskCount()}
        <ul className="taskList">{this.state.taskList.map(this.everyTask)}</ul>
      </div>
    );
  }
}
class Item extends Component {
  constructor(props) {
    super(props);

    this.handleCheckChange = this.handleCheckChange.bind(this);
  }
  handleCheckChange(event) {
    this.props.onTaskComplete(event, this.props.index);
  }
  render() {
    let labelStyle = this.props.isCompleted ? "line-through" : "";
    return (
      <React.Fragment>
        <li className="task" key={this.props.index} id={this.props.index}>
          <input
            type="checkbox"
            id={this.props.index}
            checked={this.props.isCompleted}
            onChange={this.handleCheckChange}
          />
          <label htmlFor={this.props.index} className={labelStyle}>
            {this.props.taskName}
          </label>
        </li>
      </React.Fragment>
    );
  }
}

export default App;
