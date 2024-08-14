import { EIP1193Provider } from "viem";

declare global {
  interface Window {
    okxwallet: EIP1193Provider;
    klaytn: EIP1193Provider;
  }
}
