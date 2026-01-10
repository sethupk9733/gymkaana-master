// Dummy data for Owner Portal
export const MOCK_GYMS = [
    {
        id: 1,
        _id: '1',
        name: 'Main Branch',
        address: 'Indiranagar, Bangalore',
        location: 'Indiranagar, Bangalore',
        status: 'Active',
        rating: 4.8,
        members: 450,
        revenues: '₹2.5L',
        timings: '6:00 AM - 10:00 PM',
        facilities: ['WiFi', 'AC', 'Showers', 'Lockers', 'Cardio', 'Weights', 'Parking'],
        trainers: ['Rahul Dev', 'Sanjana M']
    },
    {
        id: 2,
        _id: '2',
        name: 'Downtown Gym',
        address: 'Koramangala, Bangalore',
        location: 'Koramangala, Bangalore',
        status: 'Active',
        rating: 4.5,
        members: 320,
        revenues: '₹1.8L',
        timings: '5:30 AM - 11:00 PM',
        facilities: ['AC', 'Showers', 'Swimming Pool', 'Steam Room'],
        trainers: ['Amit K', 'John Doe']
    }
];

const DUMMY_PLANS = [
    { _id: 'p1', name: 'Silver Membership', price: 1500, duration: '1 Month', features: ['Gym Access', 'Lockers'] },
    { _id: 'p2', name: 'Gold Membership', price: 4000, duration: '3 Months', features: ['Gym Access', 'Lockers', '1 PT Session'] }
];

export const fetchGyms = async () => {
    return MOCK_GYMS;
};

export const fetchGymById = async (id: string) => {
    const gym = MOCK_GYMS.find((g: any) => g._id === id);
    return gym || MOCK_GYMS[0];
};

export const createGym = async (gymData: any) => {
    console.log("Mock Gym Created:", gymData);
    return { ...gymData, _id: Date.now().toString() };
};

export const fetchPlansByGymId = async (gymId: string) => {
    return DUMMY_PLANS;
};

export const createPlan = async (planData: any) => {
    console.log("Mock Plan Created:", planData);
    return { ...planData, _id: Date.now().toString() };
};

export const fetchDashboardStats = async () => {
    return {
        activeMembers: 770,
        totalRevenue: 430000,
        checkInsToday: 142,
        totalGyms: 2
    };
};
