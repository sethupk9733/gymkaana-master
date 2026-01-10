import { gyms, bookings } from "../data/mockData";

export const fetchGyms = async () => {
    // Return mock gyms
    return gyms;
};

export const fetchGymById = async (id: string) => {
    const gym = gyms.find(g => g.id.toString() === id.toString());
    if (!gym) throw new Error('Gym not found');
    return gym;
};

export const fetchPlansByGymId = async (gymId: string) => {
    // Return mock plans
    return [
        { _id: "p1", name: "Daily Pass", price: 199, duration: "day", features: ["Single entry", "Access to all equipment"] },
        { _id: "p2", name: "Monthly Pro", price: 999, duration: "month", features: ["Unlimited access", "Locker facility", "1 Free PT session"] },
        { _id: "p3", name: "Yearly Elite", price: 8999, duration: "year", features: ["24/7 access", "Nutrition consultation", "5 Free PT sessions"] }
    ];
};

export const createBooking = async (bookingData: any) => {
    console.log("Mock booking created:", bookingData);
    return { success: true, message: "Booking created successfully (Mock)" };
};

export const fetchBookings = async () => {
    return bookings;
};
