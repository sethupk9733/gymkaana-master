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
    specializations?: string[];
    plans: Plan[];
}

export interface Booking {
    id: string;
    gym: string;
    gymName: string;
    plan: string;
    planName: string;
    date: string;
    startDate: string;
    endDate: string;
    amount: string;
    gymId?: string;
    planId?: string;
    status: "completed" | "cancelled" | "upcoming";
    cancellationReason?: string;
    cancelledBy?: string;
}

export interface ActivePass {
    id: string;
    gymName: string;
    gymLogo: string;
    planName: string;
    validUntil: string;
    qrCode: string;
    remainingSessions?: number;
    houseRules?: string[];
    facilities?: string[];
}
