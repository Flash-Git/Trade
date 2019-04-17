import React, { Component } from "react";
import PropTypes from "prop-types";

import { colours } from "../Static";

class PreTrade extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input1: "",
      input2: "",
      address1: "",
      address2: "",
      ensAdd1: "",
      ensAdd2: "",
      validInput1: false,
      validInput2: false
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange1 = this.onChange1.bind(this);
    this.onChange2 = this.onChange2.bind(this);
    this.checkAddress = this.checkAddress.bind(this);
  }

  async checkAddress(index, input) {
    if(!window.web3){
      this.setState({ validInput1: false, validInput2: false });
      return;
    }
    
    if(!input.includes(".eth")){
      if(input.length !== 42){
        index === 0 ? this.setState({ validInput1: false }) : this.setState({ validInput2: false });
        return;
      }

      try{
        const sumAdd = await window.web3.utils.toChecksumAddress(input);
        if(window.web3.utils.isAddress(sumAdd)){
          index === 0 ? this.setState({ validInput1: true, address1: sumAdd, ensAdd1: "" }) : this.setState({ validInput2: true, address2: sumAdd, ensAdd2: "" });
          return;
        }
        index === 0 ? this.setState({ validInput1: false }) : this.setState({ validInput2: false });
        return;
      }catch(e){
        index === 0 ? this.setState({ validInput1: false }) : this.setState({ validInput2: false });
        return;
      }
    }

    try{
      let ensAdd = await window.web3.eth.ens.getAddress(input);
      ensAdd = await window.web3.utils.toChecksumAddress(ensAdd);
      if(!window.web3.utils.isAddress(ensAdd)){
        index === 0 ? this.setState({ validInput1: false }) : this.setState({ validInput2: false });
      }
      index === 0 ? this.setState({ validInput1: true, address1: ensAdd, ensAdd1: input }) : this.setState({ validInput2: true, address2: ensAdd, ensAdd2: input });
      return;
    }catch(e){
      index === 0 ? this.setState({ validInput1: false }) : this.setState({ validInput2: false });
      return;
    }
  }

  async onChange1(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    this.checkAddress(0, e.target.value);
  }

  async onChange2(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    this.checkAddress(1, e.target.value);
  }

  async onSubmit(e) {
    e.preventDefault();
    if(!this.props.connected){
      alert("Not connected");
      return;
    }
    await this.checkAddress(0, this.state.input1);
    await this.checkAddress(1, this.state.input2);
    
    if(this.state.validInput1 && this.state.validInput1){
      this.props.setAddresses([this.state.address1, this.state.address2], [this.state.ensAdd1, this.state.ensAdd2]);
    }
  }

  render() {
    return(
      <div id="section-preTrade" className="section" style={ preTradeStyle }>
        <form onSubmit={ this.onSubmit } className="method" style={ formStyle }>
          <div style={ addressesStyle }>
            <input
                type="text"
                name="input1"
                placeholder="Address 1"
                value={ this.state.input1 }
                onChange={ this.onChange1 }
                style={ (this.state.validInput1 ? inputStyle : badInputStyle) }
              />
            <input
              type="text"
              name="input2"
              placeholder="Address 2"
              value={ this.state.input2 }
              onChange={ this.onChange2 }
              style={ (this.state.validInput2 ? inputStyle : badInputStyle) }
            />
          </div>
        </form>
        <div style={ addressesStyle }>
          <button onClick={ this.onSubmit } style={ btnStyle }>Load Boxes</button>
        </div>
      </div>
    );
  }
}

const preTradeStyle = {
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  //background: colours.Primary,
  padding: "0.4rem 0.2rem",
  marginTop: "0",
  color: colours.Quaternary,
  //border: "solid",
  flexDirection: "row"
}

const addressesStyle = {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  justifyContent: "center",
  textAlign: "center",
  margin: "0.2rem"
}

const formStyle = {
  textAlign: "center",
  justifyContent: "center",
  color: colours.Quaternary
}

const inputStyle= {
  width: "24em",
  textAlign: "center",
  margin: "0.2rem",
  border: "solid 2px green"
}

const badInputStyle= {
  width: "24em",
  textAlign: "center",
  margin: "0.2rem",
  border: "solid 2px red"
}

const btnStyle = {
  background: colours.Tertiary,
  padding: "14px 18px",
  border: "none",
  borderRadius: "5%",
  cursor: "pointer",
  color: "#fff",
  fontWeight: "bold",
  margin: "0 1rem",
  marginTop: "0.2rem",
}

//PropTypes
PreTrade.propTypes = {
  isUser: PropTypes.number.isRequired,
  setAddresses: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  connected: PropTypes.bool.isRequired
}

export default PreTrade;