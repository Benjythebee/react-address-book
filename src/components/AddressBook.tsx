import React, { useRef } from "react";
import { ethers } from "ethers";
import { App } from "../state";
import { Eth } from "../utils/ethers";
import { contact, Storage } from "../utils/storage";
import { SendEth } from "./SendEth";
import Editable from "./Editable";
import { promptAddContact, promptRemoveContact } from "./Modal";
import { useState } from "react";
import { useEffect } from "react";

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
    // Listen to new AppState
    App.on("changed", () => {
      if (!App.state.wallet || !ethers.utils.isAddress(App.state.wallet)) {
        this.setState({ contacts: [] });
        return;
      }
      // New user, get the contacts for that user.
      Storage.setUser(App.state.wallet);
      this.getContacts();
    });
    this.getContacts();
  }
  /**
   * Get Contacts for the current user
   */
  getContacts() {
    if (App.signedIn) {
      this.setState({ contacts: Storage.contactList });
    }
  }
  /**
   * Add a contact to the address book
   */
  addEntry = async (value: string) => {
    let contacts = Array.from(this.state.contacts);
    contacts.push({ address: value });
    this.setState({ contacts: contacts });
  };
  /**
   * remove a contact if it exists
   */
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

function Contact(props: contactProps) {
  const [uncollapsed, setUnCollapsed] = useState<boolean>(false);
  const [ensName, setEnsName] = useState<string | null>(null);

  const htmlElement = useRef<HTMLElement | null>(null);

  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (mounted.current) {
      return;
    }
    Storage.addContact(props.contact);
    getENS(props.contact.address);
    mounted.current = true;
  });

  /**
   * Grab the ENS name of that contact
   */
  async function getENS(address: string) {
    let ensName = await Eth.ensName(address);
    if (ensName) {
      setEnsName(ensName);
    }
  }

  function contact() {
    return {
      address:props.contact.address,
      name:props.contact.name,
    };
  }
  /**
   * remove the contact from the list.
   */
  const remove = () => {
    Storage.removeContact(contact());
    props.onEdit && props.onEdit(props.contact.address);
  };
  /**
   * Collapse or unCollapse the Collapsible Element
   */
  const toggle = () => {
    setUnCollapsed(!uncollapsed);
  };
  return (
    <li key={props.contact.address} className="Contact">
      <div className="Collapsible">
        <div className="Collapsible-header" onClick={toggle}>
          <Editable
            contact={props.contact}
            value={props.contact.name || ensName || props.contact.address}
            defaultValue={props.contact.address}
          />
          <i className={uncollapsed ? "fi-circle-up" : "fi-circle-down"}></i>
        </div>
        <section
          ref={htmlElement}
          style={
            uncollapsed
              ? { maxHeight: htmlElement.current?.scrollHeight + "px" }
              : { maxHeight: "0px" }
          }
        >
          <div style={{ justifyContent: "flex-end" }}>
            <SendEth active={uncollapsed} address={props.contact.address} />
            <button
              className="ActionButton RemoveButton -red"
              onClick={() => {
                promptRemoveContact(remove);
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
