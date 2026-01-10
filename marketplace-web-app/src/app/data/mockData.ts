import { Dumbbell, Users, Bike, Droplets } from "lucide-react";
import { Gym, Booking, ActivePass } from "../types";

export const gyms: Gym[] = [
    {
        id: 1,
        name: "PowerHouse Fitness",
        location: "Downtown, 2.3 km",
        rating: 4.5,
        reviews: 234,
        price: "₹999/month",
        images: [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
            "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
            "https://images.unsplash.com/photo-1571902258032-72175ad23db3?q=80&w=1000"
        ],
        logo: "https://cdn.logojoy.com/wp-content/uploads/2018/05/30143356/127.png",
        description: "Premier fitness facility with state-of-the-art equipment, certified trainers, and a motivating atmosphere. Perfect for beginners and advanced athletes alike.",
        facilities: [
            { icon: Dumbbell, label: "Weights" },
            { icon: Users, label: "Trainers" },
            { icon: Bike, label: "Cardio" },
            { icon: Droplets, label: "Shower" },
        ],
        plans: []
    },
    {
        id: 2,
        name: "Elite Sports Club",
        location: "MG Road, 1.8 km",
        rating: 4.8,
        reviews: 456,
        price: "₹1299/month",
        images: [
            "https://images.unsplash.com/photo-1570829763335-57f730af1762?q=80&w=1000",
            "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000"
        ],
        logo: "https://marketplace.canva.com/EAFuM0Z_H5w/1/0/1600w/canva-black-and-white-minimalist-fitness-gym-logo-fM02-9e9MVE.jpg",
        description: "Exclusive sports club with premium amenities and specialized training programs.",
        facilities: [
            { icon: Dumbbell, label: "Weights" },
            { icon: Users, label: "Trainers" },
        ],
        plans: []
    },
    {
        id: 3,
        name: "FitZone Arena",
        location: "Park Street, 3.5 km",
        rating: 4.3,
        reviews: 189,
        price: "₹799/month",
        images: [
            "https://images.unsplash.com/photo-1574673138641-72aa223ad797?q=80&w=1000",
            "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000"
        ],
        logo: "https://img.freepik.com/premium-vector/fitness-gym-logo-design-template_612390-117.jpg",
        description: "Modern fitness arena with all the latest equipment.",
        facilities: [],
        plans: []
    },
    {
        id: 4,
        name: "Iron Paradise",
        location: "Sector 5, 4.2 km",
        rating: 4.6,
        reviews: 312,
        price: "₹1099/month",
        images: [
            "https://images.unsplash.com/photo-1596357399117-574104693e60?q=80&w=1000",
            "https://images.unsplash.com/photo-1534438090811-6450f38fdf4f?q=80&w=1000"
        ],
        logo: "https://i.pinimg.com/736x/87/42/43/8742436f5d88661858c4f923b379361a.jpg",
        description: "Hardcore gym for serious lifters.",
        facilities: [],
        plans: []
    },
];

export const bookings: Booking[] = [
    {
        id: "BK001",
        gymName: "PowerHouse Fitness",
        planName: "Monthly Membership",
        date: "Dec 15, 2025",
        amount: "₹999",
        status: "completed"
    },
    {
        id: "BK002",
        gymName: "Elite Sports Club",
        planName: "Daily Pass",
        date: "Dec 28, 2025",
        amount: "₹299",
        status: "completed"
    },
    {
        id: "BK003",
        gymName: "FitZone Arena",
        planName: "Monthly Membership",
        date: "Jan 10, 2026",
        amount: "₹799",
        status: "upcoming"
    }
];

export const activePass: ActivePass = {
    id: "PASS-7829",
    gymName: "PowerHouse Fitness",
    gymLogo: "https://cdn.logojoy.com/wp-content/uploads/2018/05/30143356/127.png",
    planName: "Monthly Unlimited",
    validUntil: "Feb 15, 2026",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PASS-7829-POWERHOUSE",
    remainingSessions: 12
};
