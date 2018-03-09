import React, { Component } from "react";
import Item from "./Item";
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
      if (!this.props.tasks || this.props.tasks.length === 0) return <div />;
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
                    isCompleted={this.props.isCompleted}
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
  export default List;
  // #endregion