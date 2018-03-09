import React, { Component } from "react";
// #region ITEM Component
class Item extends Component {
    constructor(props) {
      super(props);
      this.handleCheckChange = this.handleCheckChange.bind(this);
    }
    handleCheckChange() {
      this.props.onTaskUpdate(this.props.taskId);
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
  export default Item;
  // #endregion