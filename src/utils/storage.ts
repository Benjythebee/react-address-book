export interface contact {
  name?: string;
  address: string;
}

class StorageManager {
  private storage: Map<string, contact[]> = new Map();
  private contacts: contact[] = [];
  user: string | null = null;
  constructor() {
    this.storage = new Map();
    this.contacts = [];
    this.parseLocal();
  }

  setUser(address: string) {
    this.user = address;
    this.parseLocal();
  }

  getItem(key: string): contact[] | undefined {
    return this.storage.get(key);
  }

  setItem(key: string, value: contact[]) {
    this.storage.set(key, value);
    this.saveLocal();
  }

  addContact(contact: contact) {
    let lookup = this.findContact(contact.address);
    if (!!lookup) {
      return;
    }
    if (!this.user) {
      return;
    }

    this.contacts.push(contact);
    this.setItem(this.user, this.contacts);
  }

  editContact(contact: contact) {
    let old = this.findContact(contact.address);
    if (!old) {
      return;
    }
    if (!this.user) {
      return;
    }
    let contacts = this.contacts.map((c) => {
      return c.address.toLowerCase() === contact.address.toLowerCase()
        ? contact
        : c;
    });
    this.setItem(this.user, contacts);
  }

  findContact(address: string): contact | undefined {
    return this.contacts.find(
      (contact: contact) =>
        contact.address.toLowerCase() === address.toLowerCase()
    );
  }

  removeContact(contact: contact) {
    if (!this.user) {
      return;
    }
    this.contacts.splice(this.contacts.indexOf(contact), 1);

    this.setItem(this.user, this.contacts);
  }

  get contactList(): contact[] {
    return this.contacts;
  }

  parseLocal() {
    if (localStorage.bookStorage && this.user) {
      this.storage = new Map(JSON.parse(localStorage.bookStorage));
      this.contacts = this.storage.get(this.user) || [];
    }
  }

  saveLocal() {
    localStorage.bookStorage = JSON.stringify(
      Array.from(this.storage.entries())
    );
  }

  clearLocal() {
    localStorage.bookStorage = null;
  }
}

export const Storage = new StorageManager();
