import { PTB_SCHEME, PTBBuilder } from "@zktx.io/ptb-builder";
import { useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "@/hooks/use-toast";

export const PTBBuilderView = () => {
    const account = useCurrentAccount();
    const [network, setNetwork] = React.useState<
        "mainnet" | "testnet" | "devnet"
    >("testnet");
    const [ptb, setPtb] = React.useState<PTB_SCHEME | undefined>(undefined);
    const [backup, setBackup] = React.useState<PTB_SCHEME | undefined>(
        undefined
    );
    const excuteTx = async (transaction: Transaction | undefined) => {};
    const { toast } = useToast();
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <PTBBuilder
                wallet={account?.address}
                network={network}
                excuteTx={excuteTx}
                restore={ptb}
                update={(file: PTB_SCHEME) => {
                    setBackup(file);
                    // console.log(value);
                }}
                options={{
                    canEdit: true,
                    themeSwitch: true,
                }}
                enqueueToast={(message) =>
                    toast({
                        variant: "default",
                        title: "Message",
                        description: message,
                    })
                }
            />
        </div>
    );
};
