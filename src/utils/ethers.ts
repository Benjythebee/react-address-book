import { ethers } from "ethers";

/**
 * A General Ethereum helper that contains all the methods we need.
 */
class Ethereum {
  //@ts-ignore
  web3Provider: ethers.providers.Web3Provider = new ethers.getDefaultProvider(
    "rinkeby"
  );
  constructor() {
    if (this.metamask) {
      this.web3Provider = new ethers.providers.Web3Provider(this.metamask);
    }
  }

  get metamask(): any {
    // Get metamask
    return window["ethereum"];
  }

  getSigner(): ethers.Signer {
    let signer = this.web3Provider.getSigner();
    return signer;
  }

  refreshProvider() {
    this.web3Provider = new ethers.providers.Web3Provider(this.metamask);
  }

  async getWallet(): Promise<string | null> {
    // Change network first
    let isOnRinkeby = await this.switchNetwork("0x4");
    if (!isOnRinkeby) {
      return null;
    }
    let accounts;
    try {
      accounts = await this.metamask.request({
        method: "eth_requestAccounts",
      });
    } catch (e) {
      return null;
    }

    return accounts[0];
  }

  async switchNetwork(chainId: string) {
    //  "0x4" for rinkeby
    try {
      await this.metamask.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
    } catch (e) {
      return false;
    }
    this.refreshProvider();
    return true;
  }

  async ensName(wallet: string) {
    let ensName = await this.web3Provider.lookupAddress(wallet);
    return ensName;
  }

  async reverseEnsName(ensName: string): Promise<string> {
    let wallet = await this.web3Provider.resolveName(ensName);
    return wallet;
  }

  async getBalance(wallet: string): Promise<number> {
    let balance = await this.web3Provider.getBalance(wallet);
    return parseFloat(balance.toString()) / 10 ** 18;
  }

  async sendEth(address: string, amount: string): Promise<any> {
    let signer = this.getSigner();
    let tx;
    try {
      tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther(amount.toString()),
        data: [],
      });
    } catch (e) {
      if (e.code === 4001) {
        return { success: false, message: "Transaction denied by user." };
        //user cancelled transaction.
      }
      return { success: false, message: "Transaction failed." };
    }
    let txConfirmation = await tx.wait();

    if (txConfirmation.status !== 1) {
      return { success: false };
    }
    return { success: true };
  }
}

export const Eth = new Ethereum();
