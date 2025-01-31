import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router";
import Chat from "./routes/chat";
import Overview from "./routes/overview";
import Home from "./routes/home";
import useVersion from "./hooks/use-version";
import { getFullnodeUrl } from "@mysten/sui/client";
import { useState } from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
});

function App() {
    useVersion();
    const [activeNetwork, setActiveNetwork] = useState<
        "testnet" | "mainnet" | "devnet"
    >("testnet");
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider
                networks={{
                    mainnet: { url: getFullnodeUrl("mainnet") },
                    testnet: { url: getFullnodeUrl("testnet") },
                    devnet: { url: getFullnodeUrl("devnet") },
                }}
                defaultNetwork={
                    activeNetwork as "mainnet" | "testnet" | "devnet"
                }
                onNetworkChange={(network) => {
                    setActiveNetwork(network);
                }}
            >
                <WalletProvider autoConnect>
                    <div
                        className="dark antialiased"
                        style={{
                            colorScheme: "dark",
                        }}
                    >
                        <BrowserRouter>
                            <TooltipProvider delayDuration={0}>
                                <SidebarProvider>
                                    <AppSidebar />
                                    <SidebarInset>
                                        <div className="flex flex-1 flex-col gap-4 size-full container">
                                            <Routes>
                                                <Route
                                                    path="/"
                                                    element={<Home />}
                                                />
                                                <Route
                                                    path="chat/:agentId"
                                                    element={<Chat />}
                                                />
                                                <Route
                                                    path="settings/:agentId"
                                                    element={<Overview />}
                                                />
                                            </Routes>
                                        </div>
                                    </SidebarInset>
                                </SidebarProvider>
                                <Toaster />
                            </TooltipProvider>
                        </BrowserRouter>
                    </div>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}

export default App;
