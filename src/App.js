import React, { Component } from "react";
import logo from "./logo.svg";
import "./CSS/App.css";

var idGenerator = (function() {
  var counter = 0;
  return function() {
    return (counter += 1);
  };
})();

class TaskObject {
  constructor(taskName, isTaskCompleted) {
    this.taskName = taskName;
    this.isTaskCompleted = isTaskCompleted;
    this.taskId = idGenerator();
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
    //this.showTask  = this.showTask.bind(this);
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
        key={task.taskId}
        index={task.taskId}
        onTaskComplete={this.onTaskComplete}
      />
    );
  }
  onTaskComplete(event, index) {
    var tasks = this.state.taskList;
    tasks.filter(task => task.taskId === index)[0].onTaskUpdate();
    this.setState({ taskList: tasks });
  }
  showTaskCount() {
    let compeletedTaskCount = this.state.taskList.filter(
      task => task.isTaskCompleted
    ).length;
    console.log(compeletedTaskCount);
    if (compeletedTaskCount > 0 || this.state.taskList.length !== 0) {
      return <h4>Tasks completed : {compeletedTaskCount}</h4>;
    } else {
      return;
    }
  }
  showTask(taskList) {
    return taskList.length > 0 ? "display:block" : "display:none";
  }
  render() {
    let compeletedTask = this.state.taskList.filter(
      task => task.isTaskCompleted
    );
    let pendingTask = this.state.taskList.filter(task => !task.isTaskCompleted);

    return (
      <div className="itemList">
        <input
          type="textbox"
          placeholder="Task Name"
          onKeyPress={this.addTask}
        />
        {this.state.taskList.length > 0 && (
          <div>
            <h4>Tasks completed : {compeletedTask.length}</h4>

            <div className="taskList">
              {pendingTask.length > 0 && (
                <ul>{pendingTask.map(this.everyTask)}</ul>
              )}
              {pendingTask.length > 0 &&
                compeletedTask.length > 0 && <hr className="horizontalLine" />}
              {compeletedTask.length > 0 && (
                <ul>{compeletedTask.map(this.everyTask)}</ul>
              )}
            </div>
          </div>
        )}
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
