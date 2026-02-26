import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSupportChat, sendChatMessage } from '../lib/api';

interface ChatMessage {
    senderId: any;
    senderName: string;
    senderRole: string;
    message: string;
    createdAt: string;
}

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadChat();
        // Refresh chat every 3 seconds
        const interval = setInterval(loadChat, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChat = async () => {
        try {
            const data = await getSupportChat();
            setMessages(data.replies || []);
        } catch (err) {
            console.error('Failed to load chat:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        setSending(true);
        try {
            const data = await sendChatMessage(inputMessage);
            setMessages(data.replies || []);
            setInputMessage('');
        } catch (err) {
            alert('Failed to send message: ' + (err as Error).message);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Support Chat</h1>
                    <p className="text-xs text-gray-500">Response time: within 24 hours</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <div className="text-4xl mb-2">💬</div>
                        <p className="text-sm">Start a conversation with our support team</p>
                        <p className="text-xs text-gray-400 mt-2">We're here to help!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-3 rounded-lg ${
                                        msg.senderRole === 'admin'
                                            ? 'bg-white border border-gray-200 text-gray-900'
                                            : 'bg-primary text-white'
                                    }`}
                                >
                                    {msg.senderRole === 'admin' && (
                                        <p className="text-xs font-bold text-primary mb-1">Support Team</p>
                                    )}
                                    <p className="text-sm break-words">{msg.message}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={2}
                        maxLength={500}
                        className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !inputMessage.trim()}
                        className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-300 flex items-center justify-center"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
