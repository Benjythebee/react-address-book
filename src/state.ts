import { Eth } from "./utils/ethers";

interface appState {
  networkId: number;
  wallet: string | null;
  hasMetamask: boolean;
}

export const supportedChains = [4];

export class State extends EventTarget {
  state: appState;
  constructor() {
    super();
    this.state = {
      networkId: 4,
      wallet: null,
      hasMetamask: true,
    };
  }

  setState(args: any) {
    Object.assign(this.state, args);

    this.dispatchEvent(new Event("changed"));
  }

  on = this.addEventListener;
}

export class AppState extends State {
  showSnackBar?: Function;
  constructor() {
    super();
    this.state = { hasMetamask: !!Eth.metamask, wallet: null, networkId: 4 };
    this.init();
  }

  async init() {
    this.setState({ networkId: await this.getChainId() });
    this.setListeners();
  }

  get signedIn() {
    return !!App.state.wallet;
  }

  onChangedAccount = (accounts: any) => {
    this.setState({ wallet: null }); //Clean
    let newWallet = accounts[0];
    this.setState({ wallet: newWallet });
  };

  onNetworkChange = (networkId: any) => {
    this.setState({ networkId: parseInt(networkId) });
  };

  unlockWallet = async () => {
    let wallet = await Eth.getWallet();
    if (!wallet) {
      return;
    }
    this.setState({ wallet });
  };

  getChainId = async () => {
    return (await Eth.web3Provider.getNetwork()).chainId;
  };

  setListeners() {
    if (!this.state.hasMetamask) {
      return;
    }
    Eth.metamask.on("accountsChanged", this.onChangedAccount);
    Eth.metamask.on("chainChanged", this.onNetworkChange);
  }
}

export const App = new AppState();
