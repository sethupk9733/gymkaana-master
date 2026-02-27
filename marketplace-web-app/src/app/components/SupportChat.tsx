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
    onClose?: () => void;
}

export function SupportChat({ minimized = false, onClose }: ChatProps) {
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
        const interval = setInterval(() => {
            loadChat();
            fetchUnreadCount();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom(!isFirstLoad.current);
            isFirstLoad.current = false;
        }
    }, [messages]);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'nearest'
        });
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

    const content = (
        <div className={`flex flex-col h-full bg-white ${minimized ? 'fixed bottom-6 right-6 w-96 max-h-[600px] rounded-2xl shadow-2xl border border-gray-200 z-50' : ''}`}>
            {/* Header */}
            <div className="bg-black text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                    <h3 className="font-black italic uppercase tracking-tighter">Support Hub</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Security Detail</p>
                </div>
                {(minimized || onClose) && (
                    <button
                        onClick={() => onClose ? onClose() : setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        title="Close Chat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-10">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 text-gray-300" />
                        </div>
                        <h4 className="font-black uppercase italic tracking-tighter text-gray-900 mb-2">Initiate Comms</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
                            Connect with HQ for technical assistance or booking overrides.
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm ${msg.senderRole === 'admin'
                                        ? 'bg-white border border-gray-100 text-gray-900 rounded-tl-none'
                                        : 'bg-black text-white rounded-tr-none'
                                        }`}
                                >
                                    {msg.senderRole === 'admin' && (
                                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">HQ Command</p>
                                    )}
                                    <p className="text-sm font-bold leading-relaxed">{msg.message}</p>
                                    <p className="text-[8px] font-black opacity-40 mt-2 uppercase tracking-widest">
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
            <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex gap-4">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type message..."
                        rows={1}
                        className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !inputMessage.trim()}
                        className="w-14 h-14 bg-black text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:bg-gray-200 disabled:scale-100 flex items-center justify-center shadow-lg shadow-black/10"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 text-primary" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    if (minimized && !isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 group border-4 border-white"
                title="Open Support Hub"
            >
                <div className="relative">
                    <MessageCircle className="w-7 h-7 text-primary" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-xl bg-red-600 text-[10px] font-black text-white border-4 border-black">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </button>
        );
    }

    return content;
}
