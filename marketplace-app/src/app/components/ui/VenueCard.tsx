import { MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { Gym } from "../../types";
import { ImageCarousel } from "./ImageCarousel";

interface VenueCardProps {
    gym: Gym;
    onClick: () => void;
}

export function VenueCard({ gym, onClick }: VenueCardProps) {
    // Handle backend field differences
    const displayLocation = (gym as any).address || gym.location || "Location not specified";
    const displayImages = (gym as any).images && (gym as any).images.length > 0
        ? (gym as any).images
        : ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"];
    const displayLogo = (gym as any).logo || "https://cdn.logojoy.com/wp-content/uploads/2018/05/30143356/127.png";
    const displayPrice = (gym as any).price || "Varies";
    const displayRating = (gym as any).rating || 4.0;
    const displayReviews = (gym as any).reviews || 0;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer group"
        >
            <div className="h-56 relative overflow-hidden">
                <ImageCarousel images={displayImages} />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {displayPrice}
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl border border-gray-100 p-1.5 bg-white shadow-sm group-hover:scale-110 transition-transform">
                        <img src={displayLogo} alt={gym.name} className="w-full h-full object-contain" />
                    </div>
                    <h4 className="font-black text-gray-900 truncate text-lg tracking-tight italic uppercase">{gym.name}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-5 px-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="truncate">{displayLocation}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-gray-100 shadow-sm">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span className="text-xs font-black">{displayRating}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold tracking-tight">({displayReviews} reviews)</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-[10px] font-black bg-primary text-white px-6 py-2 rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                    >
                        GO
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
