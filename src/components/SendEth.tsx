import React from "react";
import { App } from "../state";
import { Eth } from "../utils/ethers";
import LoadingIcon from "./LoadingIcon";

export interface SendEthProps {
  active: boolean;
  address: string;
}
export interface SendEthState {
  active: boolean;
  open: boolean;
  transferring: boolean;
  amount: string;
}

export class SendEth extends React.Component<SendEthProps, SendEthState> {
  input: HTMLInputElement | null = null;
  constructor(props: SendEthProps) {
    super(props);
    this.state = {
      active: false,
      open: false,
      transferring: false,
      amount: "0.00",
    };
  }

  componentDidUpdate(prevProps: SendEthProps) {
    if (prevProps.active !== this.props.active) {
      this.setState({ active: this.props.active });
    }
  }

  openInput = () => {};

  sendEth = async () => {
    if (!App.state.wallet) {
      return;
    }
    let q = this.state.amount;
    if (!q || parseFloat(q) === 0) {
      App.showSnackBar && App.showSnackBar("Amount can't be null.");
      return;
    }
    if (isNaN(parseFloat(q))) {
      App.showSnackBar && App.showSnackBar("Amount is incorrect.");
      return;
    }
    let isOnRinkeby = await Eth.switchNetwork("0x4");
    if (!isOnRinkeby) {
      App.showSnackBar && App.showSnackBar("Please Switch Network to Rinkeby.");
      return;
    }

    let balance = await Eth.getBalance(App.state.wallet);

    if (balance < parseFloat(q)) {
      App.showSnackBar && App.showSnackBar("You do not have enough funds.");
      return;
    }

    this.setState({ transferring: true });

    let response = await Eth.sendEth(this.props.address, q);
    if (!response.success) {
      App.showSnackBar &&
        App.showSnackBar(response.message || "Something went wrong.");
    }
    this.setState({ transferring: false });
  };

  toggle = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.input?.focus();
      }
    });
  };

  setAmount(value: string) {
    if (!value.match(/([0-9])|(\.)/g)) {
      return;
    }
    this.setState({ amount: value });
  }

  render() {
    return (
      <div
        className={`SendEth ${
          this.state.open && this.state.active && "active"
        }`}
      >
        <button className="ActionButton -orange" onClick={this.toggle}>
          Send Eth
        </button>
        <div className="SlidingBox">
          <div className="ConstantBox">
            <input
              ref={(c) => (this.input = c)}
              value={this.state.amount}
              onInput={(e) => {
                this.setAmount(e.target["value"]);
              }}
              autoFocus={true}
              type="text"
              maxLength={10}
              placeholder="Amount to send."
            />
            <button
              disabled={!!this.state.transferring}
              className="ActionButton"
              onClick={this.sendEth}
            >
              {this.state.transferring ? <LoadingIcon /> : "Send"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
