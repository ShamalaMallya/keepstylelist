import React, { Component } from "react";
import logo from "./logo.svg";
import "./CSS/App.css";
import update from "react-addons-update";
import TaskObject from "./TaskObject";
import ActionState from "./ActionState";
import List from "./List";
import ActionButton from "./ActionButton";
import TaskInput from "./TaskInput";
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
  setActionHistory(pendingTaskList, completedTaskList, actionHistory) {
    var currentActionIndex = this.state.currentActionIndex;
    if (currentActionIndex < actionHistory.length - 1) {
      var actionIndexToBeRemoved = actionHistory.length - currentActionIndex-1;
      actionHistory = update(actionHistory, {
        $splice: [[currentActionIndex+1, actionIndexToBeRemoved]]
      });
    }

    actionHistory = update(actionHistory, {
      $push: [new ActionState(completedTaskList, pendingTaskList)]
    });
   
    return actionHistory;
  }
  //Add task to pending task list
  addToPendingTask(taskName) {
    console.log(this.state.actionHistory.length);
    var newTask = new TaskObject(taskName, false);

    var pendingTaskList = update(this.state.pendingTaskList, {
      $push: [newTask]
    });
    var completedTaskList = update({}, { $set: this.state.completedTaskList });
    var actionHistory = update({}, { $set: this.state.actionHistory });

    actionHistory = this.setActionHistory(
      pendingTaskList,
      completedTaskList,
      actionHistory
    );
    this.setState({
      pendingTaskList: pendingTaskList,
      completedTaskList: completedTaskList,
      actionHistory: actionHistory,
      currentActionIndex: actionHistory.length - 1
    });
   
  }
  //Add task to completed task list and remove from pending task list
  onTaskComplete(taskId) {
    var completedTaskList = [];
    var pendingTaskList = [];
    var actionHistory = update({}, { $set: this.state.actionHistory });

    let completedTaskIndex = this.state.pendingTaskList.findIndex(
      element => element.taskId === taskId
    );
    var task = this.state.pendingTaskList[completedTaskIndex];
    pendingTaskList = update(this.state.pendingTaskList, {
      $splice: [[completedTaskIndex, 1]]
    });
    completedTaskList = update(this.state.completedTaskList, {
      $push: [task]
    });

    actionHistory = this.setActionHistory(
      pendingTaskList,
      completedTaskList,
      actionHistory
    );
    this.setState({
      completedTaskList: completedTaskList,
      pendingTaskList: pendingTaskList,
      actionHistory: actionHistory,
      currentActionIndex: actionHistory.length - 1
    });
  }
  onTaskPending(taskId) {
    var completedTaskList = [];
    var pendingTaskList = [];
    var actionHistory = update({}, { $set: this.state.actionHistory });

    let pendingTaskIndex = this.state.pendingTaskList.findIndex(
      element => element.taskId === taskId
    );
    let pendingTask = this.state.completedTaskList[pendingTaskIndex];
    completedTaskList = update(this.state.completedTaskList, {
      $splice: [[pendingTaskIndex, 1]]
    });
    pendingTaskList = update(this.state.pendingTaskList, {
      $push: [pendingTask]
    });
    actionHistory = this.setActionHistory(
      pendingTaskList,
      completedTaskList,
      actionHistory
    );
    this.setState({
      completedTaskList: completedTaskList,
      pendingTaskList: pendingTaskList,
      actionHistory: actionHistory,
      currentActionIndex: actionHistory.length - 1
    });
  }
  undoActionHistory() {
    if (this.state.currentActionIndex > 0) {
      //Undo last move
      let newIndex = this.state.currentActionIndex - 1;
      var actionState = update(
        {},
        {
          completedTask: {
            $set: this.state.actionHistory[newIndex].completedTask
          },
          pendingTask: { $set: this.state.actionHistory[newIndex].pendingTask }
        }
      );
      this.setState({
        completedTaskList: actionState.completedTask,
        pendingTaskList: actionState.pendingTask,
        currentActionIndex: newIndex
      });
   
    }
  }
  redoActionHistory() {
    if (this.state.currentActionIndex < this.state.actionHistory.length - 1) {
      let newIndex = this.state.currentActionIndex + 1;

      var actionState = update(
        {},
        {
          completedTask: {
            $set: this.state.actionHistory[newIndex].completedTask
          },
          pendingTask: { $set: this.state.actionHistory[newIndex].pendingTask }
        }
      );
      this.setState({
        completedTaskList: actionState.completedTask,
        pendingTaskList: actionState.pendingTask,
        currentActionIndex: newIndex
      });
    }
  }
  render() {
    console.log(this.state.completedTaskList);
    console.log(this.state.pendingTaskList);
    console.log(this.state.actionHistory);
    console.log(this.state.currentActionIndex);
    var isRedoEnabled =
      this.state.currentActionIndex >= 0 &&
      this.state.currentActionIndex < this.state.actionHistory.length - 1;
    var isUndoEnabled = this.state.currentActionIndex > 0;
    return (
      <div className="taskBoard">
        <TaskInput addToPendingTask={this.addToPendingTask} />
        <div>
          <ActionButton
            updateActionHistory={this.undoActionHistory}
            isEnabled={isUndoEnabled}
          >
            Undo
          </ActionButton>
          <ActionButton
            updateActionHistory={this.redoActionHistory}
            isEnabled={isRedoEnabled}
          >
            Redo
          </ActionButton>
        </div>
        <div className="itemList">
          <List
            tasks={this.state.pendingTaskList}
            onTaskUpdate={this.onTaskComplete}
            isCompleted={false}
          />
          <List
            tasks={this.state.completedTaskList}
            isCompleted={true}
            onTaskUpdate={this.onTaskPending}
          />
        </div>
      </div>
    );
  }
}
// #endregion
export default App;
