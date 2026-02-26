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
    const data = await response.json();
    if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
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
    const response = await fetch(`${BASE_URL}/gyms/${id}`);
    if (!response.ok) throw new Error('Failed to fetch gym');
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
    return await response.json();
};

export const fetchPlansByGymId = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/plans/gym/${gymId}`);
    if (!response.ok) throw new Error('Failed to fetch plans');
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
    return await response.json();
};

export const fetchDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
        headers: getAuthHeaders(),
        //@ts-ignore
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
};
