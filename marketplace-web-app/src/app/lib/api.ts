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
        //@ts-ignore
        credentials: 'include',
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
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const cancelBooking = async (id: string) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
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
        //@ts-ignore
        credentials: 'include',
        body: JSON.stringify(dates)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update booking date');
    return data;
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

export const updateProfile = async (userData: any) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        //@ts-ignore
        credentials: 'include',
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
        //@ts-ignore
        credentials: 'include',
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
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
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
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return await response.json();
};

