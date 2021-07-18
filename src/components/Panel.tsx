import React from "react";

export enum PanelType {
    Warning = 'warning',
    Info = 'info',
    Danger = 'danger',
    Success = 'success',
    Help = 'help',
  }
  

export class Panel extends React.Component<any, any> {
    get classname() {
        switch (this.props.type) {
          case PanelType.Success:
            return 'is-success'
          case PanelType.Info:
            return 'is-info'
          case PanelType.Help:
            return 'is-help'
          case PanelType.Warning:
            return 'is-warning'
          case PanelType.Danger:
            return 'is-danger'
          default:
            return 'is-info'
        }
      }
      get emoji() {
        switch (this.props.type) {
          case PanelType.Success:
            return <i className="fi-check-circle-o"></i>
          case PanelType.Info:
            return <i className="fi-info-circle"></i>
          case PanelType.Help:
            return <i className="fi-question-circle"></i>
          case PanelType.Warning:
            return <i className="fi-exclamation-triangle"></i>
          case PanelType.Danger:
            return <i className="fi-times-circle"></i>
          default:
            return <i className="fi-info-circle"></i>
        }
      }
  render() {
    return (
      <div className={`Panel ${this.classname}`}>
        <div className="Panel-title">
          {this.emoji}
        </div>
        <div className="Panel-content">{this.props.children}</div>
      </div>
    );
  }
}
