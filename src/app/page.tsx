"use client";
import { useEffect, useState } from "react";
import { formatEther, GetBalanceParameters, parseEther } from "viem";
import {
  ConnectReturnType,
  getConnectorClient,
  getConnectors,
  getPublicClient,
  sendTransaction,
} from "wagmi/actions";
import { Config, Connector } from "wagmi";
import { klaytnBaobab, sepolia } from "viem/chains";
import { connect } from "@wagmi/core";
import { ConnectorType, useWagmiConfig } from "@/hook/useWagmiConfig";

export default function Home() {
  const { wagmiConfig, connectors: customConnector } = useWagmiConfig();
  /** account 1 */
  const [connector1, setConnector1] = useState<Connector | undefined>(
    undefined
  );
  const [account1, setAccount1] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [balance1, setBalance1] = useState<string | undefined>(undefined);
  const [input1, setInput1] = useState<string | undefined>(undefined);
  /** account 2 */
  const [connector2, setConnector2] = useState<Connector | undefined>(
    undefined
  );
  const [account2, setAccount2] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [balance2, setBalance2] = useState<string | undefined>(undefined);
  const [input2, setInput2] = useState<string | undefined>(undefined);

  const chain1 = klaytnBaobab;
  const chain2 = sepolia;
  const connectAccount1 = async (config: Config) => {
    const connector = await connect(config, {
      chainId: chain1.id,
      connector: customConnector[ConnectorType.MetaMask],
    });
    if (!connector) return undefined;
    setConnector1(customConnector[ConnectorType.MetaMask]);
    const account = await connector.accounts[0];
    setAccount1(account);
    console.log(account);
  };
  const connectAccount2 = async (config: Config) => {
    const connector = await connect(config, {
      chainId: chain2.id,
      connector: customConnector[ConnectorType.Okx],
    });
    if (!connector) return undefined;
    setConnector2(customConnector[ConnectorType.Okx]);
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
      getBalance({ address: account1 }, wagmiConfig, chain1.id).then(
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
      getBalance({ address: account2 }, wagmiConfig, chain2.id).then(
        (balance) => {
          if (balance) {
            setBalance2(balance);
          }
        }
      );
    }
  }, [account2]);

  const handleTransfer1 = async () => {
    if (connector1 && input1) {
      await sendTransaction(wagmiConfig, {
        connector: connector1,
        to: account2,
        value: parseEther(input1 ?? "0"),
      });
    }
  };
  const handleTransfer2 = async () => {
    if (connector2 && input2) {
      await sendTransaction(wagmiConfig, {
        connector: connector2,
        to: account1,
        value: parseEther(input2 ?? "0"),
      });
    }
  };

  return (
    <main className="min-h-screen p-24">
      <h3>Wallet 1</h3>
      <button
        onClick={() => connectAccount1(wagmiConfig)}
        className="bg-indigo-500 rounded-md p-2 text-white"
      >
        connect wallet 1
      </button>
      <div className="p-5">{account1}</div>
      <div className="p-5">{balance1}</div>
      <input
        disabled={!account1}
        value={input1 ?? ""}
        onChange={(e) => {
          setInput1(e.target.value);
        }}
      />
      <button
        onClick={handleTransfer1}
        className="bg-indigo-500 rounded-md p-2 text-white"
      >
        transfer
      </button>
      <hr />
      <h3>Wallet 2</h3>
      <button
        onClick={() => connectAccount2(wagmiConfig)}
        className="bg-indigo-500 rounded-md p-2 text-white"
      >
        connect wallet 2
      </button>
      <div className="p-5">{account2}</div>
      <div className="p-5">{balance2}</div>
      <input
        disabled={!account1}
        value={input2 ?? ""}
        onChange={(e) => {
          setInput2(e.target.value);
        }}
      />
      <button
        onClick={handleTransfer2}
        className="bg-indigo-500 rounded-md p-2 text-white"
      >
        transfer
      </button>
    </main>
  );
}
