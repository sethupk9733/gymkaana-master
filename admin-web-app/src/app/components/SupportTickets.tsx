import { useState, useEffect, useMemo } from 'react';
import { Mail, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronRight, Loader2, Send, MessageCircle, Ticket as TicketIcon } from 'lucide-react';
import { fetchAllTickets, fetchTicketById, addTicketReply, updateTicketStatus } from '../lib/api';

interface Ticket {
    _id: string;
    userId: any;
    subject: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    replies: any[];
    createdAt: string;
    updatedAt: string;
}

export function SupportTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'chat' | 'ticket'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await fetchAllTickets();
            setTickets(data);
            if (selectedTicket) {
                const updated = data.find((t: any) => t._id === selectedTicket._id);
                if (updated) setSelectedTicket(updated);
            }
        } catch (err) {
            console.error('Failed to load tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim() || !selectedTicket) return;

        setSendingReply(true);
        try {
            const updated = await addTicketReply(selectedTicket._id, replyMessage);
            setSelectedTicket(updated);
            setReplyMessage('');
            await loadTickets();
        } catch (err) {
            alert('Failed to send reply: ' + (err as Error).message);
        } finally {
            setSendingReply(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!selectedTicket) return;

        try {
            const updated = await updateTicketStatus(selectedTicket._id, newStatus);
            setSelectedTicket(updated);
            await loadTickets();
        } catch (err) {
            alert('Failed to update status: ' + (err as Error).message);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'in-progress':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'resolved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'closed':
                return <CheckCircle className="w-5 h-5 text-gray-500" />;
            default:
                return null;
        }
    };

    const counts = useMemo(() => {
        return {
            all: tickets.length,
            chat: tickets.filter(t => t.subject === 'Support Conversation').length,
            ticket: tickets.filter(t => t.subject !== 'Support Conversation').length,
            active: tickets.filter(t => t.status !== 'closed').length,
            closed: tickets.filter(t => t.status === 'closed').length,
            open: tickets.filter(t => t.status === 'open').length,
            'in-progress': tickets.filter(t => t.status === 'in-progress').length,
            resolved: tickets.filter(t => t.status === 'resolved').length
        };
    }, [tickets]);

    const filteredTickets = tickets.filter(t => {
        // Main Tab Filter
        if (activeTab === 'active' && t.status === 'closed') return false;
        if (activeTab === 'closed' && t.status !== 'closed') return false;

        // Category Filter
        if (categoryFilter === 'chat' && t.subject !== 'Support Conversation') return false;
        if (categoryFilter === 'ticket' && t.subject === 'Support Conversation') return false;

        // Status Filter (within active tab)
        if (activeTab === 'active' && statusFilter !== 'all' && t.status !== statusFilter) return false;

        return true;
    });

    if (loading && tickets.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#A3E635]" />
            </div>
        );
    }

    return (
        <div className="h-screen flex">
            {/* Tickets List */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200 space-y-4">
                    <h2 className="text-2xl font-bold">Support Center</h2>

                    {/* Main Tabs: Active vs Closed */}
                    <div className="flex bg-gray-900 p-1.5 rounded-xl border border-gray-800">
                        <button
                            onClick={() => {
                                setActiveTab('active');
                                setStatusFilter('all');
                            }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'active' ? 'bg-[#A3E635] text-black shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Active Intelligence ({counts.active})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('closed');
                                setStatusFilter('closed');
                            }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'closed' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Archived / Closed ({counts.closed})
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setCategoryFilter('all')}
                            className={`flex-1 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${categoryFilter === 'all' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All ({counts.all})
                        </button>
                        <button
                            onClick={() => setCategoryFilter('chat')}
                            className={`flex-1 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2 ${categoryFilter === 'chat' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Chats ({counts.chat})
                        </button>
                        <button
                            onClick={() => setCategoryFilter('ticket')}
                            className={`flex-1 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2 ${categoryFilter === 'ticket' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TicketIcon className="w-3.5 h-3.5" />
                            Tickets ({counts.ticket})
                        </button>
                    </div>

                    {/* Status Filters (Only shown for Active Intelligence) */}
                    {activeTab === 'active' && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${statusFilter === 'all'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 shadow-sm'
                                    }`}
                            >
                                All Active
                            </button>
                            {['open', 'in-progress', 'resolved'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 ${statusFilter === status
                                        ? 'bg-[#A3E635] text-black border-[#A3E635] shadow-md shadow-[#A3E635]/20'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    {status === 'open' && <AlertCircle className="w-3 h-3 text-red-500" />}
                                    {status === 'in-progress' && <Clock className="w-3 h-3 text-orange-500" />}
                                    {status === 'resolved' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                    {status} ({counts[status as keyof typeof counts]})
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.map(ticket => (
                        <button
                            key={ticket._id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedTicket?._id === ticket._id ? 'bg-blue-50 border-l-4 border-l-[#A3E635]' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {ticket.subject === 'Support Conversation' ? (
                                            <>
                                                <MessageCircle className="w-4 h-4 text-blue-600 shrink-0" />
                                                <span className="truncate">Chat with {ticket.userId?.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <TicketIcon className="w-4 h-4 text-purple-600 shrink-0" />
                                                <span className="truncate">{ticket.subject}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(ticket.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {ticket.priority}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Ticket Details */}
            {selectedTicket ? (
                <div className="flex-1 flex flex-col bg-gray-50">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedTicket.subject === 'Support Conversation' ? (
                                        <MessageCircle className="w-6 h-6 text-blue-600" />
                                    ) : (
                                        <TicketIcon className="w-6 h-6 text-purple-600" />
                                    )}
                                    <h2 className="text-2xl font-bold">{selectedTicket.subject}</h2>
                                </div>
                                <p className="text-gray-600">With: {selectedTicket.userId?.name} ({selectedTicket.userId?.email})</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(selectedTicket.status)}
                                <select
                                    value={selectedTicket.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    title="Change ticket status"
                                    className="px-3 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                                >
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            Started: {new Date(selectedTicket.createdAt).toLocaleString()}
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Initial message */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{selectedTicket.userId?.name}</p>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {new Date(selectedTicket.createdAt).toLocaleString()}
                                    </p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Replies */}
                        {selectedTicket.replies?.map((reply, idx) => (
                            <div key={idx} className={`rounded-lg p-4 border ${reply.senderRole === 'admin'
                                ? 'bg-[#A3E635]/10 border-[#A3E635]'
                                : 'bg-white border-gray-200'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reply.senderRole === 'admin'
                                        ? 'bg-[#A3E635]'
                                        : 'bg-gray-200'
                                        }`}>
                                        <MessageSquare className={`w-5 h-5 ${reply.senderRole === 'admin' ? 'text-black' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">{reply.senderName}</p>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium text-gray-700">
                                                {reply.senderRole === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {new Date(reply.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Box */}
                    {selectedTicket.status !== 'closed' && (
                        <div className="bg-white border-t border-gray-200 p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your response..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3E635] resize-none"
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={sendingReply || !replyMessage.trim()}
                                className="mt-3 w-full bg-[#A3E635] text-black font-bold py-3 rounded-lg hover:bg-[#91d630] transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
                            >
                                {sendingReply ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Reply
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400">Select a ticket to view details</p>
                </div>
            )
            }
        </div >
    );
}
