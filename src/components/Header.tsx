import React from "react";
import { App, supportedChains } from "../state";
import { Eth } from "../utils/ethers";
import Panel from "./Panel";
import Snackbar from "./Snackbar";

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      wallet: null,
      ensName: null,
      balance: 0,
      error: "",
    };
  }

  componentDidMount() {
    App.showSnackBar = this.showSnackBar.bind(this);
    App.on("changed", (e) => {
      // Listen to changed account.
      this.setState({ wallet: App.state.wallet });
    });
    this.setState({ wallet: App.state.wallet });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.state.wallet !== prevState.wallet) {
      this.getENS();
      this.getBalance();
    }
  }
  /**
   * Grab ENS name of the user.
   */
  async getENS() {
    if (!this.state.wallet) {
      this.setState({ ensName: null });
      return;
    }
    let ensName = await Eth.ensName(this.state.wallet);
    if (ensName) {
      this.setState({ ensName: ensName });
    }
  }
  /**
   * Grab the balance of the user
   */
  async getBalance() {
    if (!this.state.wallet) {
      this.setState({ balance: 0 });
      return;
    }
    let balance = await Eth.getBalance(this.state.wallet);
    this.setState({ balance });
  }
  /**
   * Creates a "showSnackBar" function that will show an error overlay.
   */
  showSnackBar(error: string) {
    this.setState({ error: error }, () => {
      setTimeout(() => {
        this.setState({ error: "" });
      }, 4500);
    });
  }

  render() {
    return (
      <div className="ContainerHeader">
        <div className="Logo">
          <h1>Address Book</h1>
        </div>
        {!supportedChains.includes(App.state.networkId) && (
          <Panel type="warning">
            This Dapp is only available on Rinkeby! Please switch Network.
          </Panel>
        )}
        <Snackbar message={this.state.error} />
        <div className="User">
          {App.state.hasMetamask ? (
            this.state.wallet ? (
              <b>
                {this.state.ensName ||
                  this.state.wallet.substring(0, 18) + "..."}{" "}
                |{" "}
                {`??${
                  this.state.balance > 0
                    ? this.state.balance.toFixed(3)
                    : parseInt(this.state.balance)
                }`}
              </b>
            ) : (
              <button className="LargeButton -white" onClick={App.unlockWallet}>
                Unlock wallet
              </button>
            )
          ) : (
            <a
              className="LargeButton -white"
              rel="noreferrer"
              href="https://metamask.io/download.html"
              target="_blank"
            >
              Install Metamask
            </a>
          )}
        </div>
      </div>
    );
  }
}
