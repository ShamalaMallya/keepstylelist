import React,{Component} from "react";
class Container extends Component{
    render(){
        return(
            <div className={this.props.cssClass}>
            {this.props.children}
            </div>
        );
    }
}
export default Container;