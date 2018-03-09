import React, { Component } from "react";
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
      var isEnabled = !this.props.isEnabled ? "disabled" : "";
      return (
        <button         
          disabled={isEnabled}
          onClick={this.updateActionHistory}
        >
          {this.props.name}
        </button>
      );
    }
  }
  export default ActionButton;
  // #endregion