"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, formatEther } from "ethers";
import { Box, Button, TextField, useMediaQuery } from "@mui/material";

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}

export default function Home() {
    const initialState = { accounts: [] };
    const [userAccount, setUserAccount] = useState(initialState);
    const [balance, setBalance] = useState<any>();
    const [sendAccount, setSendAccount] = useState();
    const minWidth770px = useMediaQuery("(min-width: 770px)");

    const updateWallet = async (accounts: any) => {
        setUserAccount({ accounts });
    };

    const getBalance = async (account: string) => {
        let balance = await window.ethereum?.request({
            method: "eth_getBalance",
            params: [account, "latest"],
        });

        if (ethers.isHexString(balance)) {
            setBalance(formatEther(balance));
        }
    };

    const transact = async (account: string, toAccount: string) => {
        await window.ethereum?.request({
            method: "eth_sendTransaction",
            params: [
                {
                    to: toAccount,
                    from: account,
                    gasPrice: Number(25000000).toString(16),
                },
            ],
        });
    };
    const handleConnect = async () => {
        let accounts = await window.ethereum?.request({
            method: "eth_requestAccounts",
        });
        updateWallet(accounts);
        getBalance(accounts[0]);
    };

    return (
        <div className={styles.app}>
            <div className={styles.wrapper}>
                {userAccount.accounts.length === 0 && (
                    <Button variant="outlined" onClick={handleConnect}>
                        Connect MetaMask
                    </Button>
                )}
                {userAccount.accounts.length > 0 && (
                    <Box component="section">
                        <div className={styles.wallet_text}>
                            Your wallet: {userAccount.accounts[0]}
                        </div>
                        <div className={styles.wallet_text}>
                            ETH Balance: {balance}
                        </div>
                        <div className={styles.send_container}>
                            <TextField
                                size={minWidth770px ? "medium" : "small"}
                                style={{ margin: 10 }}
                                id="outlined-basic"
                                label="address"
                                variant="outlined"
                                value={sendAccount}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setSendAccount(e.target.value)}
                            />
                            <Button
                                className={styles.send_button}
                                disabled={!ethers.isHexString(sendAccount)}
                                variant="contained"
                                color="success"
                                onClick={() =>
                                    transact(
                                        userAccount.accounts[0],
                                        sendAccount
                                            ? sendAccount
                                            : userAccount.accounts[0]
                                    )
                                }
                            >
                                Send
                            </Button>
                        </div>
                    </Box>
                )}
            </div>
        </div>
    );
}
