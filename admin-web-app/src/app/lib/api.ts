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
    const token = data.accessToken || data.token;
    if (token) {
        localStorage.setItem('gymkaana_token', token);
        localStorage.setItem('gymkaana_user', JSON.stringify(data));
    }
    return data;
};

export const fetchUsers = async () => {
    const response = await fetch(`${BASE_URL}/auth/users`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
};

export const logout = () => {
    localStorage.removeItem('gymkaana_token');
    localStorage.removeItem('gymkaana_user');
};

export const fetchGyms = async () => {
    const response = await fetch(`${BASE_URL}/gyms`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch gyms');
    return await response.json();
};

export const updateGymStatus = async (id: string, status: string) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
};

export const deleteGym = async (id: string) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete hub');
    }
    return true;
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
    if (!response.ok) throw new Error('Failed to onboard hub');
    return await response.json();
};

export const fetchBookingsByGym = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/bookings/gym/${gymId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const fetchPlansByGym = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/plans/gym/${gymId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch plans');
    return await response.json();
};

export const fetchAllPayouts = async () => {
    const response = await fetch(`${BASE_URL}/payouts`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch payouts');
    return await response.json();
};

export const processPayout = async (id: string, status: string, transactionId?: string) => {
    const response = await fetch(`${BASE_URL}/payouts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ status, transactionId })
    });
    if (!response.ok) throw new Error('Failed to process payout');
    return await response.json();
};

export const fetchAllBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch all bookings');
    return await response.json();
};

export const fetchAllReviews = async () => {
    const response = await fetch(`${BASE_URL}/reviews`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
};

export const fetchDeclarationByGymId = async (gymId: string) => {
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

export const getUnreadTicketCount = async () => {
    const response = await fetch(`${BASE_URL}/tickets/unread-count`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return await response.json();
};

export const fetchDashboardStats = async (ownerId?: string) => {
    const url = ownerId ? `${BASE_URL}/admin/dashboard-stats?ownerId=${ownerId}` : `${BASE_URL}/admin/dashboard-stats`;
    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
};
