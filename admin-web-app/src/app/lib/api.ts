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
    });    if (!response.ok) {
        const error = await response.text();
        console.error('Register API Error:', response.status, error);
        throw new Error(`API Error: ${response.status}`);
    }    if (!response.ok) {
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

export const verifyOTP = async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        //@ts-ignore
        credentials: 'include'
    });
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
    return await response.json();
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

export const fetchUsers = async () => {
    const response = await fetch(`${BASE_URL}/auth/users`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch users');
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

export const fetchGyms = async () => {
    const response = await fetch(`${BASE_URL}/gyms`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch gyms');
    return await response.json();
};

export const fetchGymById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch gym');
    return await response.json();
};

export const fetchBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const fetchDashboardStats = async (ownerId?: string) => {
    let url = `${BASE_URL}/dashboard/stats`;
    if (ownerId && ownerId !== 'all') url += `?ownerId=${ownerId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
};

export const updateGymStatus = async (id: string, status: string) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify({ status })
    });
    return await response.json();
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
    if (!response.ok) throw new Error('Failed to create gym');
    return await response.json();
};

export const fetchBookingsByGym = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/bookings/gym/${gymId}`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch bookings for gym');
    return await response.json();
};

export const fetchPlansByGym = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/plans/gym/${gymId}`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch plans for gym');
    return await response.json();
};

export const fetchActivities = async () => {
    const response = await fetch(`${BASE_URL}/activities`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch activities');
    return await response.json();
};

export const fetchAllPayouts = async () => {
    const response = await fetch(`${BASE_URL}/payouts/admin/all`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch payouts');
    return await response.json();
};

export const processPayout = async (id: string, status: string, transactionId?: string, remarks?: string) => {
    const response = await fetch(`${BASE_URL}/payouts/admin/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify({ status, transactionId, remarks })
    });
    if (!response.ok) throw new Error('Failed to process payout');
    return await response.json();
};
// Ticket APIs
export const fetchAllTickets = async () => {
    const response = await fetch(`${BASE_URL}/tickets/admin/all-tickets`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return await response.json();
};

export const fetchTicketById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/tickets/${id}`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
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

export const getUnreadTicketCount = async () => {
    const response = await fetch(`${BASE_URL}/tickets/user/unread-count`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return await response.json();
};

export const fetchAdminAccounting = async () => {
    const response = await fetch(`${BASE_URL}/accounting/admin`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch accounting data');
    return await response.json();
};

export const fetchAllReviews = async () => {
    const response = await fetch(`${BASE_URL}/reviews`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
};

export const createAdmin = async (adminData: any) => {
    const response = await fetch(`${BASE_URL}/auth/create-admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify(adminData)
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create administrator');
    }
    return await response.json();
};
