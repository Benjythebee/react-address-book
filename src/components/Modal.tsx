import { ethers } from "ethers";
import React from "react";
import ReactDOM, { render } from "react-dom";
import { App } from "../state";
import { Eth } from "../utils/ethers";
import { Panel } from "./Panel";
import { Storage } from "../utils/storage";

export interface ModalProps {
  title: string; // Modal title
  className?: string;
  onClose?: () => void;
}

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

interface AddContactModalStates {
  error?: string | null;
  value?: string | null;
}

export class AddContactModal extends React.Component<
  AddContactModalProps,
  AddContactModalStates
> {
  constructor(props: AddContactModalProps) {
    super(props);

    this.state = {
      error: null,
      value: null,
    };
  }

  confirm = async () => {
    this.setState({ error: null });
    let address;
    let value = this.state.value;
    if (!value || (!ethers.utils.isAddress(value) && !value?.match(/.eth/))) {
      this.setState({ error: "Address is not valid." });
      return;
    }

    if (value.match(/.eth/)) {
      address = await Eth.reverseEnsName(value);
    } else {
      address = value;
    }

    if (!address) {
      this.setState({ error: "Address is not valid." });
      return;
    }

    // Check if address is user.
    if (App.state.wallet?.toLowerCase() === address.toLowerCase()) {
      this.setState({ error: "You can't add yourself to this book address." });
      return;
    }

    // Check we haven't already recorded that address.
    if (!!Storage.findContact(address)) {
      this.setState({ error: "Address already exists." });
      return;
    }
    this.props.onConfirm && this.props.onConfirm(this.state.value);
    this.props.onClose && this.props.onClose();
  };

  render() {
    return (
      <Modal
        title="Add a contact"
        className="AddContact"
        onClose={this.props.onClose}
      >
        <div>
          <label>Insert and address or an ENS name.</label>
          <input
            type="text"
            autoFocus={true}
            onInput={(e) => this.setState({ value: e.target["value"] })}
          />
        </div>
        {this.state.error && <Panel type="danger">{this.state.error}</Panel>}
        <button className="ActionButton -orange" onClick={this.confirm}>
          Confirm
        </button>{" "}
        <button className="ActionButton -white" onClick={this.props.onClose}>
          Cancel
        </button>
      </Modal>
    );
  }
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

export class RemoveContactModal extends React.Component<
  RemoveContactModalProps,
  any
> {
  constructor(props: RemoveContactModalProps) {
    super(props);

    this.state = {};
  }

  confirm = async () => {
    this.props.onConfirm && this.props.onConfirm();
    this.props.onClose && this.props.onClose();
  };

  render() {
    return (
      <Modal
        title="Are you sure?"
        className="RemoveContact"
        onClose={this.props.onClose}
      >
        <div>
          <label>Are you sure you want to remove this contact?</label>
        </div>
        <button className="ActionButton -orange" onClick={this.confirm}>
          Confirm
        </button>{" "}
        <button className="ActionButton -white" onClick={this.props.onClose}>
          Cancel
        </button>
      </Modal>
    );
  }
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
