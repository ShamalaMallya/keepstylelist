import React, { Component } from "react";
// #region TASKINPUT Component
class TaskInput extends Component {
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
  export default TaskInput;
  // #endregion