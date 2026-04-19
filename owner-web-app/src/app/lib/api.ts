const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('gymkaana_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const login = async (credentials: any) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (data.accessToken) {
        localStorage.setItem('gymkaana_token', data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const register = async (userData: any) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.accessToken) {
        localStorage.setItem('gymkaana_token', data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('gymkaana_token');
    localStorage.removeItem('gymkaana_user');
};

export const fetchProfile = async () => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
};

export const updateProfile = async (profileData: any) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
};

export const fetchGyms = async () => {
    const response = await fetch(`${BASE_URL}/gyms/my-gyms`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch gyms');
    return await response.json();
};

export const fetchGymById = async (id: string | number) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch gym');
    return await response.json();
};

export const updateGym = async (id: string | number, gymData: any) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(gymData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update gym');
    return data;
};

export const createGym = async (gymData: any) => {
    const response = await fetch(`${BASE_URL}/gyms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(gymData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create gym');
    }
    return data;
};

export const fetchPlansByGymId = async (gymId: string | number) => {
    const response = await fetch(`${BASE_URL}/plans/gym/${gymId}`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return await response.json();
};

export const fetchPlanById = async (id: string | number) => {
    const response = await fetch(`${BASE_URL}/plans/${id}`);
    if (!response.ok) throw new Error('Failed to fetch plan');
    return await response.json();
};

export const createPlan = async (planData: any) => {
    const response = await fetch(`${BASE_URL}/plans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(planData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create plan');
    return data;
};

export const updatePlan = async (id: string | number, planData: any) => {
    const response = await fetch(`${BASE_URL}/plans/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(planData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update plan');
    return data;
};

export const deletePlan = async (id: string | number) => {
    const response = await fetch(`${BASE_URL}/plans/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete plan');
    return data;
};

export const fetchBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const fetchBookingsByGymId = async (gymId: string | number) => {
    const response = await fetch(`${BASE_URL}/bookings/gym/${gymId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const fetchBookingById = async (id: string | number) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch booking');
    return await response.json();
};

export const fetchDashboardStats = async (gymId?: string) => {
    let url = `${BASE_URL}/dashboard/stats`;
    if (gymId && gymId !== 'all') url += `?gymId=${gymId}`;

    console.log('🌐 API Call: fetchDashboardStats | URL:', url, '| GymId:', gymId);

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    const data = await response.json();
    console.log('📥 API Response: fetchDashboardStats | Data:', data);
    return data;
};

export const verifyQR = async (bookingId: string, action?: 'approve' | 'reject') => {
    const response = await fetch(`${BASE_URL}/bookings/verify-qr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ bookingId, action })
    });
    if (!response.ok) throw new Error('Verification failed');
    return await response.json();
};

export const fetchPayoutHistory = async (gymId?: string) => {
    let url = `${BASE_URL}/payouts/history`;
    if (gymId && gymId !== 'all') url += `?gymId=${gymId}`;

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch payout history');
    return await response.json();
};

export const requestPayout = async (gymId: string, amount: number) => {
    const response = await fetch(`${BASE_URL}/payouts/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ gymId, amount })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request payout');
    }
    return await response.json();
};

export const updateGymBankDetails = async (gymId: string, bankDetails: any) => {
    const response = await fetch(`${BASE_URL}/payouts/bank-details`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ gymId, bankDetails })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update bank details');
    }
    return await response.json();
};

export const fetchAccountingData = async () => {
    const response = await fetch(`${BASE_URL}/accounting`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch accounting data');
    const data = await response.json();
    return data;
};
// Ticket APIs
export const submitTicket = async (ticketData: any) => {
    const response = await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(ticketData)
    });
    if (!response.ok) throw new Error('Failed to submit ticket');
    return await response.json();
};

export const fetchUserTickets = async () => {
    const response = await fetch(`${BASE_URL}/tickets/user/my-tickets`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return await response.json();
};

export const fetchAllTickets = async () => {
    const response = await fetch(`${BASE_URL}/tickets/admin/all-tickets`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return await response.json();
};

export const fetchTicketById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/tickets/${id}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch ticket');
    return await response.json();
};

export const addTicketReply = async (ticketId: string, message: string) => {
    const response = await fetch(`${BASE_URL}/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to add reply');
    return await response.json();
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
    const response = await fetch(`${BASE_URL}/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update ticket status');
    return await response.json();
};

export const deleteTicket = async (ticketId: string) => {
    const response = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete ticket');
    return await response.json();
};

// Support Chat APIs
export const getSupportChat = async () => {
    const response = await fetch(`${BASE_URL}/tickets/chat/support`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch support chat');
    return await response.json();
};

export const sendChatMessage = async (message: string) => {
    const response = await fetch(`${BASE_URL}/tickets/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
};

export const getUnreadTicketCount = async () => {
    const response = await fetch(`${BASE_URL}/tickets/user/unread-count`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return await response.json();
};

export const fetchOwnerReviews = async () => {
    const response = await fetch(`${BASE_URL}/reviews/owner`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
};

export const replyToReview = async (reviewId: string, reply: string) => {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ reply })
    });
    if (!response.ok) throw new Error('Failed to submit reply');
    return await response.json();
};
export const fetchActivities = async () => {
    const response = await fetch(`${BASE_URL}/activities`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch activities');
    return await response.json();
};

export const googleLogin = async (data: { idToken: string; role: string }) => {
    const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
};

export const verifyOTP = async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    });
    return await response.json();
};

export const resendOTP = async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return await response.json();
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return await response.json();
};

export const resetPassword = async (data: any) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
};

export const submitDeclaration = async (declarationData: any) => {
    const response = await fetch(`${BASE_URL}/gyms/declaration`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(declarationData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit declaration');
    return data;
};

export const fetchDeclarationByGymId = async (gymId: string | number) => {
    const response = await fetch(`${BASE_URL}/gyms/declaration/${gymId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch declaration');
    return await response.json();
};

export const downloadDeclarationPDF = async (gymId: string, gymName: string) => {
    const response = await fetch(`${BASE_URL}/gyms/declaration/${gymId}/pdf`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch PDF');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Partnership_Agreement_${gymName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
