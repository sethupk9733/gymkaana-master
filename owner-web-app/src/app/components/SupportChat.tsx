import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Loader2, Send } from 'lucide-react';
import { getSupportChat, sendChatMessage, getUnreadTicketCount } from '../lib/api';

interface ChatMessage {
    senderId: any;
    senderName: string;
    senderRole: string;
    message: string;
    createdAt: string;
}

interface ChatProps {
    minimized?: boolean;
}

export function SupportChat({ minimized = false }: ChatProps) {
    const [isOpen, setIsOpen] = useState(!minimized);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadChat();
        fetchUnreadCount();
        // Refresh chat every 5 seconds for real-time feel
        const interval = setInterval(() => {
            loadChat();
            fetchUnreadCount();
        }, 5000);
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

    const fetchUnreadCount = async () => {
        try {
            const data = await getUnreadTicketCount();
            setUnreadCount(data.count);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
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

    if (minimized && !isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-50"
                title="Open support chat"
            >
                <div className="relative">
                    <MessageCircle className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col ${!minimized ? 'z-50' : ''}`}>
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                <div>
                    <h3 className="font-bold">Support Chat</h3>
                    <p className="text-xs text-blue-100">We typically respond within 24 hours</p>
                </div>
                {minimized && (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                        title="Close chat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
                        <p className="text-sm">Start a conversation with our support team</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderRole === 'admin'
                                        ? 'bg-white border border-gray-200 text-gray-900'
                                        : 'bg-blue-600 text-white'
                                        }`}
                                >
                                    {msg.senderRole === 'admin' && (
                                        <p className="text-xs font-bold text-gray-600 mb-1">{msg.senderName}</p>
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
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !inputMessage.trim()}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 flex items-center justify-center"
                    >
                        {sending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
