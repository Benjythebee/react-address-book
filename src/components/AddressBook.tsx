import React from "react";
import { ethers } from "ethers";
import { App } from "../state";
import { Eth } from "../utils/ethers";
import { contact, Storage } from "../utils/storage";
import { SendEth } from "./SendEth";
import Editable from "./Editable";
import { promptAddContact, promptRemoveContact } from "./Modal";

interface addressBookStates {
  contacts: contact[];
}

export default class AddressBook extends React.Component<
  any,
  addressBookStates
> {
  constructor(props: any) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  componentDidMount() {
    App.on("changed", () => {
      if (!App.state.wallet || !ethers.utils.isAddress(App.state.wallet)) {
        this.setState({ contacts: [] });
        return;
      }
      Storage.setUser(App.state.wallet);
      this.getContacts();
    });
    this.getContacts();
  }

  getContacts() {
    if (App.signedIn) {
      this.setState({ contacts: Storage.contactList });
    }
  }

  addEntry = async (value: string) => {
    let contacts = Array.from(this.state.contacts);
    contacts.push({ address: value });
    this.setState({ contacts: contacts });
  };

  removeEntry = async (value: string) => {
    let contacts = Array.from(this.state.contacts);
    let oldContact = contacts.find(
      (c) => c.address.toLowerCase() === value.toLowerCase()
    );
    oldContact && contacts.splice(contacts.indexOf(oldContact, 1));
    this.setState({ contacts: contacts });
  };

  render() {
    let contacts = this.state.contacts.map((c: contact) => (
      <Contact contact={c} key={c.address} onEdit={this.removeEntry} />
    ));
    return (
      <div className="Pane">
        <div className="ScrollPane">
          <ul className="AddressBookList">{contacts}</ul>
        </div>
        {App.signedIn && (
          <div>
            <button
              className="AddContactButton"
              onClick={() => promptAddContact(this.addEntry.bind(this))}
            >
              +
            </button>
          </div>
        )}
      </div>
    );
  }
}

interface contactProps {
  contact: contact;
  onEdit?: Function;
}

class Contact extends React.Component<contactProps, any> {
  element: HTMLElement | null = null;
  constructor(props: contactProps) {
    super(props);
    this.state = {
      name: props.contact.name,
      address: props.contact.address,
      ensName: null,
    };
  }
  //0x0fA074262d6AF761FB57751d610dc92Bac82AEf9
  componentDidMount() {
    Storage.addContact(this.props.contact);
    this.getENS();
  }

  async getENS() {
    let ensName = await Eth.ensName(this.state.address);
    if (ensName) {
      this.setState({ ensName: ensName });
    }
  }

  remove = () => {
    Storage.removeContact(this.state.address);
    this.props.onEdit && this.props.onEdit(this.state.address);
  };

  toggle = () => {
    this.setState({ uncollapsed: !this.state.uncollapsed });
  };

  render() {
    return (
      <li key={this.props.contact.address} className="Contact">
        <div className="Collapsible">
          <div className="Collapsible-header" onClick={this.toggle}>
            <Editable
              contact={this.props.contact}
              value={
                this.state.name || this.state.ensName || this.state.address
              }
              defaultValue={this.state.address}
            />
            <i
              className={
                this.state.uncollapsed ? "fi-circle-up" : "fi-circle-down"
              }
            ></i>
          </div>
          <section
            ref={(c) => (this.element = c)}
            style={
              this.state.uncollapsed
                ? { maxHeight: this.element?.scrollHeight + "px" }
                : { maxHeight: "0px" }
            }
          >
            <div style={{ justifyContent: "flex-end" }}>
              <SendEth
                active={this.state.uncollapsed}
                address={this.props.contact.address}
              />
              <button
                className="ActionButton RemoveButton -red"
                onClick={() => {
                  promptRemoveContact(this.remove.bind(this));
                }}
              >
                <i className="fi-trash"></i>
              </button>
            </div>
          </section>
        </div>
      </li>
    );
  }
}
