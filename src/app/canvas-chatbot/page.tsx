
import CanvasChatbotClientPage from "@/components/canvas-chatbot-client-page";

export default function ChatbotPage() {
    return (
        <div className="flex flex-col h-screen bg-background">
            <main className="flex-1 overflow-hidden p-4 pt-4">
               <div className="h-full">
                 <CanvasChatbotClientPage />
               </div>
            </main>
        </div>
    );
}
