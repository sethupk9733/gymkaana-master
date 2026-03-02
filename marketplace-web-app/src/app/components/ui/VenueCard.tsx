import { MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { Gym } from "../../types";
import { ImageCarousel } from "./ImageCarousel";
import { useState } from "react";

interface VenueCardProps {
    gym: Gym;
    onClick: () => void;
}

export function VenueCard({ gym, onClick }: VenueCardProps) {
    const [cardHover, setCardHover] = useState(false);

    // Handle backend field differences
    const displayLocation = (gym as any).address || gym.location || "Location not specified";
    const displayImages = (gym as any).images && (gym as any).images.length > 0
        ? (gym as any).images
        : ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"];
    const displayLogo = (gym as any).logo || "https://cdn.logojoy.com/wp-content/uploads/2018/05/30143356/127.png";
    const basePrice = Number((gym as any).baseDayPassPrice || (gym as any).price || "299");
    const discount = Number((gym as any).maxBaseDiscount || 0);
    const discountedPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
    const displayRating = (gym as any).rating || 4.0;
    const displayReviews = (gym as any).reviews || 0;

    return (
        <motion.div
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
            whileHover={{
                scale: 1.05,
                y: -14,
                transition: { duration: 0.3, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full cursor-pointer group bg-white rounded-3xl p-2 transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
        >
            {/* Swiggy-inspired Image Section */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-sm transition-all">
                <ImageCarousel images={displayImages} altPrefix={gym.name} externalHover={cardHover} />

                {/* Simplified Overlay Discount - Cleaner than Neon Box */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="absolute bottom-3 left-4 z-20">
                    <p className="text-xl font-black text-white italic uppercase tracking-tighter">
                        {discount > 0
                            ? `${Math.round(discount)}% OFF`
                            : "EXCLUSIVE PASS"}
                    </p>
                </div>
            </div>

            {/* Swiggy-inspired Info Section */}
            <div className="px-2 pb-2">
                <h4 className="font-extrabold text-lg text-secondary truncate mb-1 tracking-tight group-hover:text-primary transition-colors">
                    {gym.name}
                </h4>

                <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 bg-emerald-600 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span className="text-[11px] font-black text-white">{displayRating}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[12px] font-bold text-secondary uppercase tracking-tighter opacity-60">2.5 KM</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[12px] font-black text-secondary italic uppercase tracking-tighter">₹{discountedPrice}</span>
                        {discount > 0 && (
                            <span className="text-[10px] font-bold text-muted-foreground/40 line-through">₹{basePrice}</span>
                        )}
                        <span className="text-[9px] font-black text-muted-foreground/40 tracking-tight">DAY PASS</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[12px] font-medium text-muted-foreground/80 truncate">
                    {gym.specializations && gym.specializations.length > 0
                        ? gym.specializations.slice(0, 3).join(", ")
                        : "General Fitness, Strength"}
                </div>

                <div className="text-[12px] font-medium text-muted-foreground/60 truncate mt-0.5">
                    {displayLocation}
                </div>
            </div>
        </motion.div>
    );
}
