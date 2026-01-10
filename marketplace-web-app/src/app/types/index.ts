import { LucideIcon } from "lucide-react";

export interface Facility {
    icon: LucideIcon;
    label: string;
}

export interface Plan {
    id: string;
    name: string;
    price: string;
    duration: string;
    features: string[];
    popular?: boolean;
}

export interface Gym {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    price: string;
    images: string[];
    logo: string;
    description: string;
    facilities: Facility[];
    plans: Plan[];
}

export interface Booking {
    id: string;
    gymName: string;
    planName: string;
    date: string;
    amount: string;
    status: "completed" | "cancelled" | "upcoming";
}

export interface ActivePass {
    id: string;
    gymName: string;
    gymLogo: string;
    planName: string;
    validUntil: string;
    qrCode: string;
    remainingSessions?: number;
}
