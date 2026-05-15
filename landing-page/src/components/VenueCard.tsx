import { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { cn } from "../lib/utils";

interface VenueCardProps {
    gym: {
        _id: string;
        name: string;
        location: string;
        rating: number;
        reviews: number;
        image?: string;
        images?: string[];
        tags?: string[];
    };
    onClick?: () => void;
    className?: string;
}

// Array of diverse fitness-related placeholder images
const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", // CrossFit
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", // Yoga
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800", // Weightlifting
    "https://images.unsplash.com/photo-1532618917136-d6df44dd3f7a?auto=format&fit=crop&q=80&w=800", // Cardio
    "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&q=80&w=800", // Gym Equipment
    "https://images.unsplash.com/photo-1577221084712-56ceb4ee3379?auto=format&fit=crop&q=80&w=800", // Training
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80&w=800", // Strength
    "https://images.unsplash.com/photo-1552821206-1eb8a1be1ac6?auto=format&fit=crop&q=80&w=800", // Fitness
];

// Generate consistent placeholder based on gym ID/name
function getPlaceholderForGym(gymId: string, gymName: string): string {
    const combined = `${gymId}${gymName}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
}

export function VenueCard({ gym, onClick, className }: VenueCardProps) {
    const fallbackImage = getPlaceholderForGym(gym._id, gym.name);
    const [imageError, setImageError] = useState(false);

    const displayImage = !imageError && (gym.image || (gym.images && gym.images.length > 0 ? gym.images[0] : fallbackImage));

    return (
        <div
            onClick={onClick}
            className={cn(
                "group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500",
                className
            )}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                    src={displayImage || fallbackImage}
                    alt={gym.name}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Star className="text-yellow-500 fill-yellow-500" size={14} />
                    <span className="text-xs font-black text-slate-900">{gym.rating || "0.0"}</span>
                </div>
                {gym.tags && gym.tags.length > 0 && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        {gym.tags.map(tag => (
                            <span key={tag} className="bg-slate-900/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors mb-2 line-clamp-1">
                    {gym.name}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 mb-4">
                    <MapPin size={14} className="shrink-0" />
                    <span className="text-sm font-medium line-clamp-1">{gym.location}</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold">
                                {String.fromCharCode(65 + i)}
                            </div>
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[8px] font-bold">
                            +{gym.reviews || 0}
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Book Now
                    </span>
                </div>
            </div>
        </div>
    );
}
