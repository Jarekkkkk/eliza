import { PTB_SCHEME, PTBBuilder } from "@zktx.io/ptb-builder";
import { useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "@/hooks/use-toast";

export const PTBBuilderView = () => {
    const account = useCurrentAccount();

    const [ptb, setPtb] = React.useState<PTB_SCHEME | undefined>({
        version: "2",
        modules: {},
    });
    const excuteTx = async (transaction: Transaction | undefined) => {
        console.log({ transaction });
    };
    const { toast } = useToast();

    console.log({ ptb });
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <PTBBuilder
                wallet={account?.address}
                network={"testnet"}
                excuteTx={excuteTx}
                restore={ptb}
                update={(file: PTB_SCHEME) => {
                    setPtb(file);
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
