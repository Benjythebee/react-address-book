import { ethers } from "ethers";
import React, { useState } from "react";
import ReactDOM, { render } from "react-dom";
import { App } from "../state";
import { Eth } from "../utils/ethers";
import Panel from "./Panel";
import { Storage } from "../utils/storage";

export interface ModalProps {
  title: string; // Modal title
  className?: string;
  onClose?: () => void;
  children?: any;
}
/**
 * A general Modal class; Having modals as a Class is necessary as I use the class' static properties (see currentElement )to avoid
 * having multiple Modals being rendered.
 */
export class Modal extends React.Component<ModalProps, any> {
  static currentElement: Element | null;
  constructor(props: ModalProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className="Modal">
        <header>
          <h3>{this.props.title}</h3>
          <button className="close" onClick={this.props.onClose}>
            &times;
          </button>
        </header>
        <section className={this.props.className}>
          {this.props.children}
        </section>
      </div>
    );
  }
}

export interface AddContactModalProps {
  onConfirm?: Function;
  onClose?: () => void;
}

/**
 * Modal to add a contact
 */

export function AddContactModal(props: AddContactModalProps) {
  const [error, setError] = useState<string | null>(null);

  let addressState = useState<string | null>(null);
  let addressValue = addressState[0];
  let setAddress = addressState[1];

  async function confirm() {
    setError(null);
    let address;
    let value = addressValue;
    //Check if value is an address or ETH.
    if (!value || (!ethers.utils.isAddress(value) && !value?.match(/.eth/))) {
      setError("Address is not valid.");
      return;
    }
    //if value is ENS we reverseLookup to obtain the address
    if (value.match(/.eth/)) {
      address = await Eth.reverseEnsName(value);
    } else {
      address = value;
    }
    //Check if address is not null
    if (!address) {
      setError("Address is not valid.");
      return;
    }

    // Check if address is user.
    if (App.state.wallet?.toLowerCase() === address.toLowerCase()) {
      setError("You can't add yourself to this book address.");
      return;
    }

    // Check we haven't already recorded that address.
    if (!!Storage.findContact(address)) {
      setError("Address already exists.");
      return;
    }
    props.onConfirm && props.onConfirm(address);
    props.onClose && props.onClose();
  }

  return (
    <Modal title="Add a contact" className="AddContact" onClose={props.onClose}>
      <div>
        <label>Insert and address or an ENS name.</label>
        <input
          type="text"
          autoFocus={true}
          onInput={(e) => setAddress(e.target["value"])}
        />
      </div>
      {error && <Panel type="danger">{error}</Panel>}
      <button className="ActionButton -orange" onClick={() => confirm}>
        Confirm
      </button>{" "}
      <button className="ActionButton -white" onClick={props.onClose}>
        Cancel
      </button>
    </Modal>
  );
}

export function promptAddContact(callback?: Function) {
  //Remove previous Node.
  let p = ReactDOM.findDOMNode(Modal.currentElement) as Element;
  !!p && ReactDOM.unmountComponentAtNode(p);
  Modal.currentElement = null;

  const div = document.createElement("div");
  document.body.appendChild(div);
  Modal.currentElement = div;

  render(
    <AddContactModal
      onConfirm={callback}
      onClose={() => {
        let d = ReactDOM.findDOMNode(Modal.currentElement) as Element;
        !!d && ReactDOM.unmountComponentAtNode(d);
        Modal.currentElement = null;
      }}
    />,
    div
  );
}

export interface RemoveContactModalProps {
  onConfirm?: Function;
  onClose?: () => void;
}

export function RemoveContactModal(props: RemoveContactModalProps) {
  const confirm = async () => {
    props.onConfirm && props.onConfirm();
    props.onClose && props.onClose();
  };

  return (
    <Modal
      title="Are you sure?"
      className="RemoveContact"
      onClose={props.onClose}
    >
      <div>
        <label>Are you sure you want to remove this contact?</label>
      </div>
      <button className="ActionButton -orange" onClick={() => confirm}>
        Confirm
      </button>{" "}
      <button className="ActionButton -white" onClick={props.onClose}>
        Cancel
      </button>
    </Modal>
  );
}

export function promptRemoveContact(callback?: Function) {
  //Remove previous Node.
  let p = ReactDOM.findDOMNode(Modal.currentElement) as Element;
  !!p && ReactDOM.unmountComponentAtNode(p);
  Modal.currentElement = null;

  const div = document.createElement("div");
  document.body.appendChild(div);
  Modal.currentElement = div;

  render(
    <RemoveContactModal
      onConfirm={callback}
      onClose={() => {
        let d = ReactDOM.findDOMNode(Modal.currentElement) as Element;
        !!d && ReactDOM.unmountComponentAtNode(d);
        Modal.currentElement = null;
      }}
    />,
    div
  );
}
