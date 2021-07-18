import React from "react";
import { contact, Storage } from "../utils/storage";

export interface Props {
  value: string;

  contact: contact;

  defaultValue: string;

  onEditableClick?: Function;
}

interface States {
  value: string | null;
  isEditing: boolean;
  previousValue: string | null;
}

export default class Editable extends React.Component<Props, States> {
  element: HTMLSpanElement | null = null;
  constructor(props: Props) {
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
  /**
   * Check if the key is Enter. and Save on Enter.
   */
  isEnterKey(event: any) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.setState({ value: event.target["innerText"] }, () => this.save());
    }
  }
  /**
   * Save the new value
   */
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
  /**
   * toggles Editing of the Editable Component. (set to true)
   */
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
