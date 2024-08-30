import { klaytnBaobab, polygonAmoy, sepolia } from "wagmi/chains";
import { createConfig, http } from "wagmi";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { getConnectors } from "wagmi/actions";

export enum ConnectorType {
  MetaMask = "MetaMask",
  WalletConnect = "WalletConnect",
  Okx = "Okx",
  Kaikas = "Kaikas",
}

const connectorConfig = {
  [ConnectorType.MetaMask]: metaMask(),
  [ConnectorType.WalletConnect]: walletConnect({
    projectId: "86c32afc0c37c56b0d2bd72c6357d289",
  }),
  [ConnectorType.Okx]: injected({
    target() {
      return {
        name: "OKX",
        id: "okx",
        icon: "https://www.okx.com/okx-logo.svg",
        provider: window.okxwallet,
      };
    },
  }),
  [ConnectorType.Kaikas]: injected({
    target() {
      return {
        name: "Kaikas",
        id: "kaikas",
        icon: "https://lh3.googleusercontent.com/vQ4txSWDboUlo0L9Q0VBl-vx7lEkiphTm9W6eFZxmleN3JkZ9TEkvmtFdsSvMGVNXXaW3ofeZAh5r7bNfH4L2fHq1G4=s120",
        provider: window.klaytn,
      };
    },
  }),
};

export const wagmiConfig = createConfig({
  chains: [klaytnBaobab, sepolia, polygonAmoy],
  connectors: [
    connectorConfig[ConnectorType.MetaMask],
    connectorConfig[ConnectorType.WalletConnect],
    connectorConfig[ConnectorType.Okx],
    connectorConfig[ConnectorType.Kaikas],
  ],
  transports: {
    [klaytnBaobab.id]: http("https://api.baobab.klaytn.net:8651"),
    [sepolia.id]: http("https://sepolia.dq.neopin.pmang.cloud"),
    [polygonAmoy.id]: http("https://amoy.dq.neopin.pmang.cloud"),
  },
});

const storedConnectors = getConnectors(wagmiConfig);

export const connectors = {
  [ConnectorType.MetaMask]: storedConnectors[0],
  [ConnectorType.WalletConnect]: storedConnectors[1],
  [ConnectorType.Okx]: storedConnectors[2],
  [ConnectorType.Kaikas]: storedConnectors[3],
};
