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

export const fetchGymById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/gyms/${id}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch gym');
    return await response.json();
};

export const fetchBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
};

export const fetchDashboardStats = async (ownerId?: string) => {
    let url = `${BASE_URL}/dashboard/stats`;
    if (ownerId && ownerId !== 'all') url += `?ownerId=${ownerId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders()
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
        body: JSON.stringify(gymData)
    });
    if (!response.ok) throw new Error('Failed to create gym');
    return await response.json();
};

export const fetchBookingsByGym = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/bookings/gym/${gymId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings for gym');
    return await response.json();
};

export const fetchPlansByGym = async (gymId: string) => {
    const response = await fetch(`${BASE_URL}/plans/gym/${gymId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch plans for gym');
    return await response.json();
};

export const fetchActivities = async () => {
    const response = await fetch(`${BASE_URL}/activities`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch activities');
    return await response.json();
};

export const fetchAllPayouts = async () => {
    const response = await fetch(`${BASE_URL}/payouts/admin/all`, {
        headers: getAuthHeaders()
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
        body: JSON.stringify({ status, transactionId, remarks })
    });
    if (!response.ok) throw new Error('Failed to process payout');
    return await response.json();
};
// Ticket APIs
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

export const getUnreadTicketCount = async () => {
    const response = await fetch(`${BASE_URL}/tickets/user/unread-count`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return await response.json();
};

export const fetchAdminAccounting = async () => {
    const response = await fetch(`${BASE_URL}/accounting/admin`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch accounting data');
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
