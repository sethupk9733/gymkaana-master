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

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadChat();
        fetchUnreadCount();
        // Refresh every 5 seconds
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-secondary transition-all z-50"
                title="Open support chat"
            >
                <div className="relative">
                    <MessageCircle className="w-7 h-7" />
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
        <div className="fixed bottom-20 right-4 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
            {/* Header */}
            <div className="bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-base">Support Chat</h3>
                    <p className="text-xs text-primary/20">Response time: 24 hours</p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                    title="Close chat"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
                        <p className="text-sm">Start a conversation</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-lg ${msg.senderRole === 'admin'
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
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={2}
                        maxLength={500}
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/100 resize-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !inputMessage.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-300 flex items-center justify-center"
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
