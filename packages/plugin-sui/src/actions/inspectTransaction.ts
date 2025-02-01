import {
    ActionExample,
    composeContext,
    generateObjectDeprecated,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    settings,
    State,
    type Action,
    elizaLogger,
    Content,
} from "@elizaos/core";
import { parseAccount } from "../utils";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { aw } from "vitest/dist/chunks/reporters.anwo7Y6a.js";
import { walletProvider } from "../providers/wallet";

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "recipient": "0xaa000b3651bd1e57554ebd7308ca70df7c8c0e8e09d67123cc15c8a8a79342b3",
    "amount": "1"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values.`;
type SuiNetwork = "mainnet" | "testnet" | "devnet" | "localnet";

export interface InspectTransactionContent extends Content {
    recipient: string;
    amount: string | number;
}
function InspectTransactionContent(
    content: Content
): content is InspectTransactionContent {
    console.log("Content for Inspect Transaction", content);
    return (
        typeof content.recipient === "string" &&
        (typeof content.amount === "string" ||
            typeof content.amount === "number")
    );
}

export const InspectTransaction: Action = {
    name: "InspectTransaction",
    similes: ["INSPECT_TRANSACTION", "CHECK_TRANSACTION"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Message:", message);
        return true;
    },
    description: "Inspect requested transaction to check if it's functionable",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting INSPECT_TRANSACTION handler...");

        // Initialize or update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        // Compose transfer context
        const transferContext = composeContext({
            state,
            template: transferTemplate,
        });

        // Generate transfer content
        const content = await generateObjectDeprecated({
            runtime,
            context: transferContext,
            modelClass: ModelClass.LARGE,
        });

        const transferContent = content.object as InspectTransactionContent;

        // Validate InspectTransaction content
        if (!InspectTransactionContent(transferContent)) {
            elizaLogger.error("Invalid content for TRANSFER_TOKEN action.");
            if (callback) {
                callback({
                    text: "Unable to process transfer request. Invalid content provided.",
                    content: { error: "Invalid transfer content" },
                });
            }
            return false;
        }

        try {
            const suiAccount = parseAccount(runtime);
            const network = runtime.getSetting("SUI_NETWORK");
            const suiClient = new SuiClient({
                url: getFullnodeUrl(network as SuiNetwork),
            });

            const tx = new Transaction();
            tx.setSender(suiAccount.toSuiAddress());
            const transactionBlock = await tx.build();
            const dryRunResponse = suiClient.dryRunTransactionBlock({
                transactionBlock,
            });

            console.log("DryRun transaction successful:", dryRunResponse);

            // handle formatted Nodes
            // if (callback) {
            //     callback({
            //         text: `Successfully transferred ${transferContent.amount} SUI to ${transferContent.recipient}, Transaction: ${executedTransaction.digest}`,
            //         content: {
            //             success: true,
            //             hash: executedTransaction.digest,
            //             amount: transferContent.amount,
            //             recipient: transferContent.recipient,
            //         },
            //     });
            // }

            return true;
        } catch (error) {
            console.error("Error during token transfer:", error);
            if (callback) {
                callback({
                    text: `Error transferring tokens: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [],
};
