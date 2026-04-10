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
    if (data.token) {
        localStorage.setItem('gymkaana_token', data.token);
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
    if (data.token) {
        localStorage.setItem('gymkaana_token', data.token);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('gymkaana_token');
    localStorage.removeItem('gymkaana_user');
};

export const fetchGyms = async () => {
    const response = await fetch(`${BASE_URL}/gyms`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch gyms');
    return await response.json();
};

export const fetchGymById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch gym');
    return await response.json();
};

export const fetchPlansByGymId = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/plans/gym/${gymId}`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return await response.json();
};

export const createBooking = async (bookingData: any) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
    }
    return data;
};

export const fetchMyBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings/my`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const cancelBooking = async (id: string) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to cancel booking');
    return data;
};

export const updateBookingDate = async (id: string, dates: { startDate?: string; endDate?: string }) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}/update-date`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(dates)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update booking date');
    return data;
};

export const fetchProfile = async () => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
};

export const updateProfile = async (userData: any) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(userData)
    });
    return await response.json();
};

export const createReview = async (reviewData: any) => {
    const response = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(reviewData)
    });
    return await response.json();
};

export const fetchGymReviews = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/reviews/gym/${gymId}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
};

// Support Chat & Ticket APIs
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

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return await response.json();
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password: newPassword })
    });
    return await response.json();
};

