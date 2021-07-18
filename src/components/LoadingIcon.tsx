import React from "react";

export default class LoadingIcon extends React.Component<any, any> {
    render() {
      return (
        <div className={`loading-icon`} title="loading...">
          <i className="fi-spinner11"></i>
        </div>
      )
    }
  }
  