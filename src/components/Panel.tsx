import React from "react";

export enum PanelType {
  Warning = "warning",
  Info = "info",
  Danger = "danger",
  Success = "success",
  Help = "help",
}

export default function Panel(props:any){
  function getClassname() {
    switch (props.type) {
      case PanelType.Success:
        return "is-success";
      case PanelType.Info:
        return "is-info";
      case PanelType.Help:
        return "is-help";
      case PanelType.Warning:
        return "is-warning";
      case PanelType.Danger:
        return "is-danger";
      default:
        return "is-info";
    }
  }
  function getEmoji() {
    switch (props.type) {
      case PanelType.Success:
        return <i className="fi-check-circle-o"></i>;
      case PanelType.Info:
        return <i className="fi-info-circle"></i>;
      case PanelType.Help:
        return <i className="fi-question-circle"></i>;
      case PanelType.Warning:
        return <i className="fi-exclamation-triangle"></i>;
      case PanelType.Danger:
        return <i className="fi-times-circle"></i>;
      default:
        return <i className="fi-info-circle"></i>;
    }
  }

  return (
    <div className={`Panel ${getClassname()}`}>
      <div className="Panel-title">{getEmoji()}</div>
      <div className="Panel-content">{props.children}</div>
    </div>
  );
}