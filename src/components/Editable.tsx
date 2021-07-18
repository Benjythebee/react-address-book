import React from "react";
import { contact, Storage } from "../utils/storage";

export interface Props {
  /**
   * value: the string value of the Editable
   */
  value: string;

  /**
   * The contact.
   */
  contact: contact;
  /**
   * Default value
   */
  defaultValue: string;
  /**
   * if active or not
   */
  onEditableClick?: Function;
}

export default class Editable extends React.Component<any, any> {
  element: HTMLSpanElement | null = null;
  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value,
      isEditing: false,
      previousValue: props.value,
    };
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        isEditing: false,
        previousValue: this.props.value,
      });
    }
  }

  isEnterKey(event: any) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.setState({ value: event.target["innerText"] }, () => this.save());
      return;
    }
  }

  save() {
    if (!this.state.value || this.state.value?.length === 0) {
      this.setState({ value: this.state.previousValue });
    }
    let save = Object.assign({}, this.props.contact, {
      name: this.state.value,
    });
    Storage.editContact(save);
    this.setState({ isEditing: false });
  }

  getInputType() {
    return (
      <input
        className={this.props.className}
        placeholder={this.state.defaultValue}
        autoFocus={true}
        type="text"
        value={this.state.value}
        onKeyUp={(e) => this.isEnterKey(e)}
        onInput={(e) => this.setState({ value: e.target["value"] })}
      />
    );
  }

  edit = (e: any) => {
    e.stopPropagation();
    this.setState({ isEditing: true, previousValue: this.state.value }, () => {
      this.element?.focus();
    });
  };

  render() {
    return (
      <div style={{ flex: "2" }}>
        <span
          onBlur={() => this.setState({ isEditing: false })}
          suppressContentEditableWarning={true}
          contentEditable={this.state.isEditing}
          ref={(c) => (this.element = c)}
          onClick={this.edit}
          onKeyDown={(e) => this.isEnterKey(e)}
        >
          {this.state.value}
        </span>
        {this.state.isEditing && <small>([ENTER] to save.)</small>}
        {this.state.isEditing && (
          <button
            className="resetButton"
            title="Reset Address' name"
            onClick={(e) => {
              e.stopPropagation();
              this.setState({ value: this.props.contact.address }, () =>
                this.save()
              );
            }}
          >
            <i className="fi-spinner11"></i>
          </button>
        )}
      </div>
    );
  }
}
