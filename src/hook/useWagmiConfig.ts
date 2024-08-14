import { klaytnBaobab, polygonAmoy, sepolia } from "wagmi/chains";
import { Connector, createConfig, CreateConnectorFn, http } from "wagmi";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { useMemo } from "react";

export enum ConnectorType {
  MetaMask = "MetaMask",
  WalletConnect = "WalletConnect",
  Okx = "Okx",
  Kaikas = "Kaikas",
}

export const useWagmiConfig = () => {
  const okx = useMemo(
    () => () =>
      injected({
        target: {
          name: "OKX",
          id: "okx",
          icon: "https://www.okx.com/okx-logo.svg",
          provider: window.okxwallet,
        },
      }),
    []
  );

  const kaikas = useMemo(
    () => () =>
      injected({
        target: {
          name: "Kaikas",
          id: "kaikas",
          icon: "https://lh3.googleusercontent.com/vQ4txSWDboUlo0L9Q0VBl-vx7lEkiphTm9W6eFZxmleN3JkZ9TEkvmtFdsSvMGVNXXaW3ofeZAh5r7bNfH4L2fHq1G4=s120",
          provider: window.klaytn,
        },
      }),
    []
  );

  const customConnector: {
    [connector in ConnectorType]: CreateConnectorFn;
  } = useMemo(
    () => ({
      [ConnectorType.MetaMask]: metaMask(),
      [ConnectorType.WalletConnect]: walletConnect({
        projectId: "86c32afc0c37c56b0d2bd72c6357d289",
      }),
      [ConnectorType.Okx]: okx(),
      [ConnectorType.Kaikas]: kaikas(),
    }),
    [okx, kaikas]
  );

  const wagmiConfig = createConfig({
    chains: [klaytnBaobab, sepolia, polygonAmoy],
    // connectors: [
    //   customConnector()[ConnectorType.MetaMask],
    //   customConnector()[ConnectorType.WalletConnect],
    //   customConnector()[ConnectorType.Okx],
    //   customConnector()[ConnectorType.Kaikas],
    // ],
    transports: {
      [klaytnBaobab.id]: http("https://api.baobab.klaytn.net:8651"),
      [sepolia.id]: http("https://sepolia.dq.neopin.pmang.cloud"),
      [polygonAmoy.id]: http("https://amoy.dq.neopin.pmang.cloud"),
    },
  });

  return { wagmiConfig, connectors: customConnector };
};
