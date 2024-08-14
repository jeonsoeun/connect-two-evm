"use client";
import { useEffect, useState } from "react";
import { formatEther, GetBalanceParameters } from "viem";
import { ConnectReturnType, getPublicClient } from "wagmi/actions";
import { Config } from "wagmi";
import { klaytnBaobab, sepolia } from "viem/chains";
import { connect } from "@wagmi/core";
import { ConnectorType, useWagmiConfig } from "@/hook/useWagmiConfig";

export default function Home() {
  const { wagmiConfig, connectors: customConnector } = useWagmiConfig();
  /** account 1 */
  const [connector1, setConnector1] = useState<ConnectReturnType | undefined>(
    undefined
  );
  const [account1, setAccount1] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [balance1, setBalance1] = useState<string | undefined>(undefined);

  /** account 2 */
  const [connector2, setConnector2] = useState<ConnectReturnType | undefined>(
    undefined
  );
  const [account2, setAccount2] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [balance2, setBalance2] = useState<string | undefined>(undefined);

  const connectAccount1 = async (config: Config) => {
    const connector = await connect(config, {
      chainId: klaytnBaobab.id,
      connector: customConnector[ConnectorType.MetaMask],
    });
    if (!connector) return undefined;
    setConnector1(connector);
    const account = await connector.accounts[0];
    setAccount1(account);
    console.log(account);
  };
  const connectAccount2 = async (config: Config) => {
    const connector = await connect(config, {
      chainId: sepolia.id,
      connector: customConnector[ConnectorType.Okx],
    });
    if (!connector) return undefined;
    setConnector2(connector);
    const account = await connector.accounts[0];
    setAccount2(account);
  };

  const getBalance = async (
    accountAddress: GetBalanceParameters,
    config: Config,
    chainId: number
  ) => {
    const publicClient = getPublicClient(config, { chainId });
    if (!publicClient) return undefined;
    const balanceBigInt = await publicClient.getBalance(accountAddress);
    const balanceFormat = formatEther(balanceBigInt);
    return balanceFormat;
  };
  useEffect(() => {
    if (account1) {
      getBalance({ address: account1 }, wagmiConfig, sepolia.id).then(
        (balance) => {
          if (balance) {
            setBalance1(balance);
          }
        }
      );
    }
  }, [account1]);

  useEffect(() => {
    if (account2) {
      getBalance({ address: account2 }, wagmiConfig, klaytnBaobab.id).then(
        (balance) => {
          if (balance) {
            setBalance2(balance);
          }
        }
      );
    }
  }, [account2]);

  const onClickConnectButton1 = async () => {};

  return (
    <main className="min-h-screen p-24">
      <h3>Wallet 1</h3>
      <button onClick={() => connectAccount1(wagmiConfig)}>
        connect wallet 1
      </button>
      <div className="p-5">{account1}</div>
      <div className="p-5">{balance1}</div>
      <input disabled={!account1} />
      <hr />
      <h3>Wallet 2</h3>
      <button onClick={() => connectAccount2(wagmiConfig)}>
        connect wallet 2
      </button>
      <div className="p-5">{account2}</div>
      <div className="p-5">{balance2}</div>
    </main>
  );
}
