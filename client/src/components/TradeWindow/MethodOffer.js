import React, { Component } from "react";
import PropTypes from "prop-types";

const sendStatus = Object.freeze({ "UNSENT":1, "SENDING":2, "SENT":3 });
class MethodOffer extends Component {

  state = {
    argType: "",
    argName: "",
    argValue: "",
    sendStatus: sendStatus.UNSENT
  }

  onChange = (e) => this.setState({
    [e.target.name]: e.target.value
  });

  onSubmit = (e) => {
    e.preventDefault();
    this.props.addMethodArguments(this.props.method.id, [this.state.argType, this.state.argName, this.state.argValue], this.state.sendStatus);
  }

  sendMethod = (e) => {
    this.props.sendMethod(this.props.method.id);
  }


  render(){
    const method = this.props.method;

    return(
      <div className="method" style={ methodStyle }>
        <div className="display" style={ displayStyle }>
          { method.contract + " " + method.methodType + " " + method.methodName }
          { "(" }
          { this.props.method.args.map((arg, i) => (
            arg[0] + ": " + arg[1] + " = " + arg[2] + (i===method.args.length-1 ? "" : ", ")
          )) }
          { ")" }
        </div>
        { method.sendStatus ? "" : 
          (
          <form onSubmit={ this.onSubmit } className="form" style={ formStyle }>
            <input 
              type="text" 
              name="argType" 
              placeholder="Arg Type" 
              value={ this.state.argType }
              onChange={ this.onChange }
            />
            <input 
              type="text" 
              name="argName" 
              placeholder="Arg name" 
              value={ this.state.argName }
              onChange={ this.onChange }
            />
            <input 
              type="text" 
              name="argValue" 
              placeholder="Arg value" 
              value={ this.state.argValue }
              onChange={ this.onChange }
            />
            <input 
              type="submit" 
              value="Add Args" 
              className="btn"
            />
          </form>
        ) }
        <button onClick={ this.sendMethod } style={ (method.sendStatus!==sendStatus.SENT ? btnStyleSent : btnStyleUnsent) }>{ (method.sendStatus!==sendStatus.SENT ? "Sent" : "Send Method") }</button>
      </div>
    );
  }
}

const methodStyle = {
  display: "grid",
  gridColumnGap: "3px",
  gridTemplateColumns: "5fr 1fr",
  gridTemplateRows: "1 1",
  textAlign: "center",
  justifyContent: "center",
  background: "#444",
  color: "#fff",
  margin: "0.2rem",
  fontSize: "0.85em"
}

const displayStyle = {
  gridColumn: "1 / 2",
  gridRow: "1",
  textAlign: "center",
  justifyContent: "center",
  background: "#444",
  color: "#fff",
  margin: "0.2rem",
  fontSize: "0.85em"
}

const formStyle = {
  gridColumn: "1 / 2",
  gridRow: "2 / 3",
  textAlign: "center",
  justifyContent: "center",
  background: "#444",
  color: "#fff",
  margin: "0.2rem",
  fontSize: "0.85em"
}

const btnStyleUnsent = {
  gridColumn: "2",
  gridRow: "1 / 3",
  background: "#660000",
  padding: "6px 26px",
  border: "none",
  borderRadius: "5%",
  cursor: "pointer",
  color: "#fff",
  fontWeight: "bold"
}

const btnStyleSent = {
  gridColumn: "2",
  gridRow: "1 / 3",
  background: "#441111",
  padding: "6px 26px",
  border: "none",
  borderRadius: "5%",
  color: "#fff",
  fontWeight: "bold",
}

//PropTypes
MethodOffer.propTypes = {
  method: PropTypes.object.isRequired
}

export default MethodOffer;