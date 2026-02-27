export interface Booking {
    id: number;
    user: string;
    gym: string;
    location: string;
    date: string;
    time: string;
    status: string;
    plan: string;
    amount: string;
    email: string;
    phone: string;
    memberId: string;
    paymentId: string;
    paymentMethod: string;
    paymentTime: string;
    startDate: string;
    endDate: string;
    sessionTime: string;
}

export interface Gym {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    status: string;
    description: string;
    phone: string;
    email: string;
    timings: string;
    images: string[];
    members: number;
    checkins: number;
    revenue: string;
}

export const gyms: Gym[] = [
    {
        id: 1,
        name: "PowerHouse Fitness - Main Branch",
        location: "Koramangala, Bangalore",
        rating: 4.5,
        reviews: 120,
        status: "Active",
        description: "Premium fitness facility with state-of-the-art equipment and experienced trainers. We offer a complete fitness solution for all your workout needs.",
        phone: "+91 98765 43210",
        email: "powerhouse@gym.com",
        timings: "6:00 AM - 10:00 PM",
        images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"],
        members: 156,
        checkins: 34,
        revenue: "₹45K"
    },
    {
        id: 2,
        name: "Elite Sports Club - Indiranagar",
        location: "Indiranagar, Bangalore",
        rating: 4.8,
        reviews: 456,
        status: "Active",
        description: "Exclusive sports club with premium amenities and specialized training programs.",
        phone: "+91 98765 55555",
        email: "elite@sports.com",
        timings: "5:00 AM - 11:00 PM",
        images: ["https://images.unsplash.com/photo-1570829763335-57f730af1762?q=80&w=1000"],
        members: 89,
        checkins: 12,
        revenue: "₹28K"
    }
];

export const bookings: Booking[] = [
    {
        id: 1,
        user: "Rahul Sharma",
        gym: "Main Branch",
        location: "Koramangala, Bangalore",
        date: "Dec 05, 2023",
        time: "07:00 AM",
        status: "Upcoming",
        plan: "Gold Membership",
        amount: "₹6,500",
        email: "rahul.sharma@email.com",
        phone: "+91 98765 12345",
        memberId: "M-2023-101",
        paymentId: "PAY_RS_101",
        paymentMethod: "UPI (PhonePe)",
        paymentTime: "Dec 01, 2023 at 08:00 AM",
        startDate: "Dec 05, 2023",
        endDate: "Mar 05, 2024",
        sessionTime: "07:00 AM - 09:00 AM"
    },
    {
        id: 2,
        user: "Priya Singh",
        gym: "Downtown Gym",
        location: "Indiranagar, Bangalore",
        date: "Dec 06, 2023",
        time: "06:00 PM",
        status: "Upcoming",
        plan: "Silver Membership",
        amount: "₹3,500",
        email: "priya.singh@email.com",
        phone: "+91 98765 54321",
        memberId: "M-2023-202",
        paymentId: "PAY_PS_202",
        paymentMethod: "Credit Card",
        paymentTime: "Dec 02, 2023 at 10:30 PM",
        startDate: "Dec 06, 2023",
        endDate: "Jan 06, 2024",
        sessionTime: "06:00 PM - 08:00 PM"
    },
    {
        id: 3,
        user: "Amit Kumar",
        gym: "Main Branch",
        location: "Koramangala, Bangalore",
        date: "Dec 03, 2023",
        time: "08:00 AM",
        status: "Active",
        plan: "Platinum Membership",
        amount: "₹12,500",
        email: "amit.kumar@email.com",
        phone: "+91 98765 88888",
        memberId: "M-2023-303",
        paymentId: "PAY_AK_303",
        paymentMethod: "UPI (Google Pay)",
        paymentTime: "Dec 01, 2023 at 09:15 PM",
        startDate: "Dec 03, 2023",
        endDate: "Jun 03, 2024",
        sessionTime: "08:00 AM - 10:00 AM"
    },
    {
        id: 4,
        user: "Neha Patel",
        gym: "Downtown Gym",
        location: "Indiranagar, Bangalore",
        date: "Nov 28, 2023",
        time: "07:30 AM",
        status: "Cancelled",
        plan: "Gold Membership",
        amount: "₹6,500",
        email: "neha.patel@email.com",
        phone: "+91 98765 77777",
        memberId: "M-2023-404",
        paymentId: "PAY_NP_404",
        paymentMethod: "Debit Card",
        paymentTime: "Nov 25, 2023 at 04:20 PM",
        startDate: "Nov 28, 2023",
        endDate: "Feb 28, 2024",
        sessionTime: "07:30 AM - 09:30 AM"
    },
    {
        id: 5,
        user: "Suresh Raina",
        gym: "Main Branch",
        location: "Koramangala, Bangalore",
        date: "Nov 20, 2023",
        time: "06:00 AM",
        status: "Completed",
        plan: "Daily Pass",
        amount: "₹299",
        email: "suresh.raina@email.com",
        phone: "+91 98765 00000",
        memberId: "M-2023-505",
        paymentId: "PAY_SR_505",
        paymentMethod: "UPI (Paytm)",
        paymentTime: "Nov 20, 2023 at 05:45 AM",
        startDate: "Nov 20, 2023",
        endDate: "Nov 20, 2023",
        sessionTime: "06:00 AM - 08:00 AM"
    },
];
