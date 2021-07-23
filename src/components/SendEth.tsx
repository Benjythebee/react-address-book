import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { App } from "../state";
import { Eth } from "../utils/ethers";
import LoadingIcon from "./LoadingIcon";

export interface SendEthProps {
  active: boolean;
  address: string;
}
/**
 * The Send-Eth component that's hidden within the Collapsible component.
 */
export function SendEth(props: SendEthProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [transfering, setTransfering] = useState<boolean>(false);
  const [amount, setAmountState] = useState<string>("0.00");

  const input = useRef<HTMLInputElement | null>(null);

  const sendEth = async () => {
    //Check if we're connected
    if (!App.state.wallet) {
      return;
    }
    let q = amount;
    //Check if amount is null
    if (!q || parseFloat(q) === 0) {
      App.showSnackBar && App.showSnackBar("Amount can't be null.");
      return;
    }
    //Check if amount if valid
    if (isNaN(parseFloat(q))) {
      App.showSnackBar && App.showSnackBar("Amount is incorrect.");
      return;
    }
    //Switch network to rinkeby (no prompts if we're already on it)
    let isOnRinkeby = await Eth.switchNetwork("0x4");
    if (!isOnRinkeby) {
      App.showSnackBar && App.showSnackBar("Please Switch Network to Rinkeby.");
      return;
    }
    // Get the balance of the user and check if he's got enough
    let balance = await Eth.getBalance(App.state.wallet);

    if (balance < parseFloat(q)) {
      App.showSnackBar && App.showSnackBar("You do not have enough funds.");
      return;
    }

    setTransfering(true);
    //Start transaction
    let response = await Eth.sendEth(props.address, q);
    if (!response.success) {
      App.showSnackBar &&
        App.showSnackBar(response.message || "Something went wrong.");
    }
    setTransfering(false);
  };
  /**
   * Toggle the SendEth sliding input
   */
  const toggle = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (!open) {
      return;
    }
    input.current?.focus();
  }, [open]);
  /**
   * Set the amount of the input (only numbers)
   */
  function setAmount(value: string) {
    if (!value.match(/([0-9])|(\.)/g)) {
      return;
    }
    setAmountState(value);
  }

  return (
    <div className={`SendEth ${open && props.active && "active"}`}>
      <button className="ActionButton -orange" onClick={toggle}>
        Send Eth
      </button>
      <div className="SlidingBox">
        <div className="ConstantBox">
          <input
            ref={input}
            value={amount}
            onInput={(e) => {
              setAmount(e.target["value"]);
            }}
            autoFocus={true}
            type="text"
            maxLength={10}
            placeholder="Amount to send."
          />
          <button
            disabled={!!transfering}
            className="ActionButton"
            onClick={sendEth}
          >
            {transfering ? <LoadingIcon /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
