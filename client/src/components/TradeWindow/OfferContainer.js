import React, { Component } from "react";
import EthOffer from "./EthOffer";
import MethodOffer from "./MethodOffer";

class OfferContainer extends Component {
  
  addMethodArguments = (id, args) => {
    this.props.addMethodArguments(id, args);
  }

  sendMethod = (i) => {
    this.props.sendMethod(i);
  }

  render(){
    return(
      <div className="container" style={ style }>
        <EthOffer />
        { 
          this.props.methods.map((method) => 
            <MethodOffer key= { method.id } method={ method } addMethodArguments={ this.addMethodArguments } sendMethod={ this.sendMethod } />)
        }
      </div>
    );
  }
}

const style = {
  gridColumn: "1 auto",
  gridRow: "2 auto"
}

export default OfferContainer;