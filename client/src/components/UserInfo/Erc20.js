import React, { Component } from "react";
import PropTypes from "prop-types";
import makeBlockie from "ethereum-blockies-base64";

import { colours } from "../../Static";

class Erc20 extends Component {

  add = (e) => {
    this.props.addErc(this.props.erc);
  }

  render() {
    return(
      <div className="erc20" style={ erc20Style }>
        <li style={ liStyle }>
          <div>
            <span style={ symbolStyle }>{ this.props.erc.symbol }&nbsp;</span>
            <img src={ makeBlockie(this.props.erc.contractAdd) } width="10px" height="10px" alt="blockie" style={{ marginTop:"0.2em" }} />&nbsp;<br/>
            Balance:&nbsp;{ this.props.erc.balance }<br/>
            Enabled:&nbsp;{ this.props.erc.allowance }
          </div>
          <button onClick={ this.add } style={ btnStyle }>
            +
          </button>
        </li>
      </div>
    );
  }
}

const btnStyle = {
  marginLeft: "auto",
  textAlign: "center",
  justifyContent: "center",
  background: colours.User,
  border: "none",
  borderRadius: "30%",
  fontWeight: "bold",
  padding: "0.3rem 0.5rem",
  alignSelf: "center",
  color: "000",
  cursor: "pointer"
}

const liStyle= {
  display: "flex",
  listStyleType: "none",
  marginTop: "0.4rem",
  padding: "0",
  fontSize: "70%",
  lineHeight: "90%"
}

const erc20Style = {
  textAlign: "left",
  marginBottom: "1rem"
}

const symbolStyle = { 
  fontSize: "115%",
  fontWeight: "bold",
  marginLeft: "2rem"
}

//PropTypes
Erc20.propTypes = {
  erc: PropTypes.object.isRequired,
  addErc: PropTypes.func.isRequired
}

export default Erc20;