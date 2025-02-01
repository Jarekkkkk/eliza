import { useParams } from "react-router";
import Chat from "@/components/chat";
import { UUID } from "@elizaos/core";
import { PTBBuilderView } from "@/components/ptb-builder";

export default function AgentRoute() {
    const { agentId } = useParams<{ agentId: UUID }>();

    if (!agentId) return <div>No data.</div>;

    return (
        <div className="w-svw grid grid-cols-4 h-full">
            <div className="border-r col-span-3">{<PTBBuilderView />}</div>
            {<Chat agentId={agentId} />}
        </div>
    );
}
