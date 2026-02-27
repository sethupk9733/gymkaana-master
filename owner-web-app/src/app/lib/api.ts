import { API_URL } from '../config/api';

const BASE_URL = API_URL;
let inMemoryToken: string | null = null;

const getAuthHeaders = (): Record<string, string> => {
    return inMemoryToken ? { 'Authorization': `Bearer ${inMemoryToken}` } : {};
};

export const setToken = (token: string | null) => {
    inMemoryToken = token;
};

export const login = async (credentials: any) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Login API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const googleLogin = async (googleData: { idToken: string; role?: string }) => {
    const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Google Login API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const register = async (userData: any) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Register API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const verifyOTP = async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Verify OTP API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const resendOTP = async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Resend OTP API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Forgot Password API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
};

export const resetPassword = async (resetData: any) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Reset Password API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
};

export const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        //@ts-ignore
        credentials: 'include'
    });
    setToken(null);
    localStorage.removeItem('gymkaana_token');
    localStorage.removeItem('gymkaana_user');
};

export const checkSession = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            //@ts-ignore
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setToken(data.accessToken);
            localStorage.setItem('gymkaana_user', JSON.stringify(data));
            return data;
        }
    } catch (e) {
        console.error('Session check failed', e);
    }
    return null;
};

export const fetchProfile = async () => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
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
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
};

export const fetchGyms = async () => {
    const response = await fetch(`${BASE_URL}/gyms?managed=true`, {
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
        //@ts-ignore
        credentials: 'include',
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
        //@ts-ignore
        credentials: 'include',
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
        //@ts-ignore
        credentials: 'include',
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
        //@ts-ignore
        credentials: 'include',
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

export const lookupQR = async (bookingId: string) => {
    const response = await fetch(`${BASE_URL}/bookings/lookup-qr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify({ bookingId })
    });
    if (!response.ok) throw new Error('Booking not found or unauthorized');
    return await response.json();
};

export const confirmQRCheckIn = async (bookingId: string, action: 'accept' | 'reject', reason?: string) => {
    const response = await fetch(`${BASE_URL}/bookings/confirm-qr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify({ bookingId, action, reason })
    });
    if (!response.ok) throw new Error('Action failed');
    return await response.json();
};

export const verifyQR = async (bookingId: string) => {
    return lookupQR(bookingId);
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
        //@ts-ignore
        credentials: 'include',
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
        //@ts-ignore
        credentials: 'include',
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
        //@ts-ignore
        credentials: 'include',
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
