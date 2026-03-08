import { useState, useEffect, useRef } from "react";
import { socketService } from "../services/socketService";
import { ScrollArea } from "./ui/scroll-area";

export function StreamingOutput({ chatId, onClose }) {
  const [outputs, setOutputs] = useState([]);
  const [status, setStatus] = useState("idle");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      socketService.connect(chatId);
    }

    socketService.on("output", (data) => {
      if (data.chatId === chatId) {
        setOutputs((prev) => [...prev, { text: data.output, timestamp: Date.now() }]);
      }
    });

    socketService.on("status", (data) => {
      if (data.chatId === chatId) {
        setStatus(data.status);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

  const handleSend = (text) => {
    socketService.sendMessage(chatId, text);
  };

  const statusColor = status === "started" ? "text-green-500" : status === "done" ? "text-gray-500" : "text-yellow-500";
  const statusText = status === "started" ? "Running" : status === "done" ? "Done" : "Idle";

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">OpenCode Session</h3>
        <div className="flex items-center gap-2">
          <span className={"text-sm " + statusColor}>{statusText}</span>
        </div>
      </div>

      <ScrollArea className="h-64 border rounded p-2 bg-background font-mono text-sm">
        {outputs.map((out, i) => (
          <pre key={i} className="whitespace-pre-wrap">{out.text}</pre>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      {status !== "done" && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(e.target.elements.cmd.value);
            e.target.elements.cmd.value = "";
          }}
          className="mt-4 flex gap-2"
        >
          <input 
            name="cmd"
            className="flex-1 border rounded px-3 py-2 bg-background"
            placeholder="Type command..."
            autoComplete="off"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Send
          </button>
        </form>
      )}
    </div>
  );
}
