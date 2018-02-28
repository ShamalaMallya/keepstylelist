import React, { Component } from "react";
import logo from "./logo.svg";
import "./CSS/App.css";

// #region TASKOBJECT
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
  updateTask() {
    this.isTaskCompleted = !this.isTaskCompleted;
  }
}
// #endregion
Array.prototype.deepCopy = function() {
  return JSON.parse(JSON.stringify(this));
};
class ActionState {
  constructor(completedTask, pendingTask) {
    this.completedTask = completedTask.deepCopy();
    this.pendingTask = pendingTask.deepCopy();
  }
  deepCopy() {
    return JSON.parse(JSON.stringify(this));
  }
}
// #region App Component
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Keep Like List</h1>
        </header>
        <div className="App-intro">
          <TaskBoard />
        </div>
      </div>
    );
  }
}
// #endregion
// #region TASKBOARD Component
class TaskBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedTaskList: [],
      pendingTaskList: [],
      actionHistory: [new ActionState([], [])],
      currentActionIndex: 0
    };
    this.addToPendingTask = this.addToPendingTask.bind(this);
    this.onTaskComplete = this.onTaskComplete.bind(this);
    this.onTaskPending = this.onTaskPending.bind(this);
    this.undoActionHistory = this.undoActionHistory.bind(this);
    this.redoActionHistory = this.redoActionHistory.bind(this);
    this.setActionHistory = this.setActionHistory.bind(this);
  }
  setActionHistory() {
    this.state.actionHistory.push(
      new ActionState(this.state.completedTaskList, this.state.pendingTaskList)
    );

    return this.state.actionHistory.length - 1;
  }
  //Add task to pending task list
  addToPendingTask(taskName) {
    var newTask = new TaskObject(taskName, false);
    console.log(newTask.constructor);
    this.state.pendingTaskList.push(newTask);
    var currentIndex = this.setActionHistory();
    this.setState({
      pendingTaskList: this.state.pendingTaskList.slice(0),
      actionHistory: this.state.actionHistory.slice(0),
      currentActionIndex: currentIndex
    });
  }
  //Add task to completed task list and remove from pending task list
  onTaskComplete(taskId) {
    let completedTaskIndex = this.state.pendingTaskList.findIndex(
      element => element.taskId === taskId
    );
    let completedTask = this.state.pendingTaskList.splice(
      completedTaskIndex,
      1
    )[0];

    completedTask.updateTask();
    this.state.completedTaskList.push(completedTask);

    var currentIndex = this.setActionHistory();
    this.setState({
      completedTask: this.state.completedTaskList.slice(0),
      pendingTask: this.state.pendingTaskList.slice(0),
      actionHistory: this.state.actionHistory.slice(0),
      currentActionIndex: currentIndex
    });
  }
  onTaskPending(taskId) {
    let pendingTaskIndex = this.state.pendingTaskList.findIndex(
      element => element.taskId === taskId
    );
    let pendingTask = this.state.completedTaskList.splice(
      pendingTaskIndex,
      1
    )[0];
    pendingTask.updateTask();
    this.state.pendingTaskList.push(pendingTask);
    var currentIndex = this.setActionHistory();
    this.setState({
      completedTask: this.state.completedTaskList.slice(0),
      pendingTask: this.state.pendingTaskList.slice(0),
      actionHistory: this.state.actionHistory.slice(0),
      currentActionIndex: currentIndex
    });
  }
  undoActionHistory() {
    if (this.state.currentActionIndex > 0) {
      //Undo last move
      let newIndex = this.state.currentActionIndex - 1;
      var prevActionHistory = this.state.actionHistory[newIndex].deepCopy();

      this.setState({
        completedTaskList: prevActionHistory.completedTask.slice(0),
        pendingTaskList: prevActionHistory.pendingTask.slice(0),
        currentActionIndex: newIndex
      });
    }
  }
  redoActionHistory() {
    console.log("REDO");
  }
  render() {
    return (
      <div className="taskBoard">
        <TaskInput addToPendingTask={this.addToPendingTask} />
        <div>
          <ActionButton updateActionHistory={this.undoActionHistory}>
            {
              //isEnabled={this.state.currentActionIndex > 0}
            }
            Undo
          </ActionButton>
          <ActionButton updateActionHistory={this.redoActionHistory}>
            Redo
          </ActionButton>
        </div>
        <div className="itemList">
          <List
            tasks={this.state.pendingTaskList}
            onTaskUpdate={this.onTaskComplete}
          />
          <List
            tasks={this.state.completedTaskList}
            onTaskUpdate={this.onTaskPending}
          />
        </div>
      </div>
    );
  }
}
// #endregion
// #region LIST Component
class List extends Component {
  constructor(props) {
    super(props);
    this.onTaskUpdate = this.onTaskUpdate.bind(this);
  }
  onTaskUpdate(taskId) {
    this.props.onTaskUpdate(taskId);
  }
  render() {
    if (this.props.tasks.length === 0) return <div />;
    else {
      //Sort the array for maintaining sequence of list added

      var taskSequence = this.props.tasks.sort((task1, task2) => {
        return task2.taskId < task1.taskId;
      });
      return (
        <div className="taskList">
          <ul>
            {taskSequence.map(task => {
              return (
                <Item
                  taskName={task.taskName}
                  isCompleted={task.isTaskCompleted}
                  key={task.taskId}
                  taskId={task.taskId}
                  onTaskUpdate={this.onTaskUpdate}
                />
              );
            })}
          </ul>
        </div>
      );
    }
  }
}
// #endregion
// #region ITEM Component
class Item extends Component {
  constructor(props) {
    super(props);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }
  handleCheckChange() {
    this.props.onTaskUpdate(this.props.index);
  }
  render() {
    let labelStyle = this.props.isCompleted ? "line-through" : "";

    return (
      <React.Fragment>
        <li className="task" key={this.props.index} id={this.props.index}>
          <input
            type="checkbox"
            id={this.props.taskId}
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
// #endregion
// #region TASKINPUT Component
class TaskInput extends React.Component {
  constructor(props) {
    super(props);
    this.addToPendingTask = this.addToPendingTask.bind(this);
  }
  addToPendingTask(event) {
    if (event.key === "Enter") {
      this.props.addToPendingTask(event.target.value);
      event.target.value = "";
    }
  }
  render() {
    return (
      <input
        className="taskEntry"
        type="textbox"
        placeholder="Task Name"
        onKeyPress={this.addToPendingTask}
      />
    );
  }
}
// #endregion
// #region ACTIONBUTTON Component
class ActionButton extends Component {
  constructor(props) {
    super(props);
    this.updateActionHistory = this.updateActionHistory.bind(this);
  }
  updateActionHistory() {
    this.props.updateActionHistory();
  }

  render() {
    return (
      <button className="actionButton" onClick={this.updateActionHistory}>
        {
          //disabled={this.props.isEnabled}
        }
        {this.props.children}
      </button>
    );
  }
}
// #endregion
export default App;
