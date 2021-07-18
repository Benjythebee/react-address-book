import React from "react";
import { Panel } from "./Panel";

export interface Props {
  message?: string;
}

export interface State {
  showing?: boolean;
}

export default class Snackbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showing: props.message !== "",
    };
  }

  componentDidUpdate(prevProps:Props,prevState:State) {
    if(this.props.message !== prevProps.message ){
        this.setState({ showing: this.props.message !== "" });
    }
  }

  render() {
    return (
      <div className={this.state.showing ? `snackbar show` : `snackbar`}>
        <Panel type="danger">{this.props.message}</Panel>
      </div>
    );
  }
}
