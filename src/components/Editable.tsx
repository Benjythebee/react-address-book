import React, { useState, useEffect, useRef, useCallback } from "react";
import { contact, Storage } from "../utils/storage";

export interface Props {
  value: string;

  contact: contact;

  defaultValue: string;
}

export default function Editable(props: Props) {
  const [value, setValue] = useState<string | null>(props.value);
  const [previousValue, setPreviousValue] = useState<string | null>(
    props.value
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const editableElement = useRef<HTMLSpanElement | null>(null);
  /**
   * Check if the key is Enter. and Save on Enter.
   */
  const isEnterKey = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setValue(event.target["innerText"]);
    }
  };

  /**
   * Save the new value
   */
  const save = useCallback(
    (value: string | null) => {
      if (!value || value?.length === 0) {
        setValue(previousValue);
      }
      let save = Object.assign({}, props.contact, {
        name: value,
      });
      Storage.editContact(save);
      setIsEditing(false);
    },
    [previousValue, props.contact]
  );
  useEffect(() => {
    save(value);
  }, [value, save]);
  /**
   * toggles Editing of the Editable Component. (set to true)
   */
  const edit = (e: any) => {
    e.stopPropagation();
    setIsEditing(true);
    setPreviousValue(value);
    setTimeout(() => {
      editableElement.current?.focus();
    }, 20);
  };

  useEffect(() => {
    setValue(props.value);
    setIsEditing(false);
    setPreviousValue(props.value);
  }, [props.value]);

  const onBlur = () => {
    setIsEditing(false);
  };

  return (
    <div style={{ flex: "2" }}>
      <span
        onBlur={onBlur}
        suppressContentEditableWarning={true}
        contentEditable={isEditing}
        ref={editableElement}
        onClick={edit}
        onKeyDown={isEnterKey}
      >
        {value}
      </span>
      {isEditing && <small>([ENTER] to save.)</small>}
      {isEditing && (
        <button
          className="resetButton"
          title="Reset Address' name"
          onMouseDown={(e) => {
            e.stopPropagation();
            setValue(props.contact.address);
          }}
        >
          <i className="fi-spinner11"></i>
        </button>
      )}
    </div>
  );
}
