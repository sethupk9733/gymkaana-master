import { useState } from "react";
import { Star, MapPin, Zap } from "lucide-react";

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
        specializations?: string[];
    };
    onClick?: () => void;
    className?: string;
}

const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=800",
];

function getPlaceholder(id: string, name: string): string {
    const s = `${id}${name}`;
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h |= 0;
    }
    return PLACEHOLDER_IMAGES[Math.abs(h) % PLACEHOLDER_IMAGES.length];
}

export function VenueCard({ gym, onClick }: VenueCardProps) {
    const fallback = getPlaceholder(gym._id, gym.name);
    const [imgErr, setImgErr] = useState(false);
    const [hovered, setHovered] = useState(false);

    const src = !imgErr ? (gym.image || gym.images?.[0] || fallback) : fallback;
    const tags = gym.tags || gym.specializations || [];

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: "pointer",
                borderRadius: 24,
                overflow: "hidden",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${hovered ? "rgba(79,124,255,0.25)" : "rgba(255,255,255,0.07)"}`,
                transform: hovered ? "translateY(-6px)" : "translateY(0px)",
                boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,124,255,0.12)" : "none",
                transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
            }}
        >
            {/* Image */}
            <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#111" }}>
                <img
                    src={src}
                    alt={gym.name}
                    loading="lazy"
                    onError={() => setImgErr(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.7s ease" }}
                />
                {/* Dark gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }} />

                {/* Rating */}
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 100, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Star size={11} style={{ fill: "#FBBF24", color: "#FBBF24" }} />
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>{gym.rating || "0.0"}</span>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>({gym.reviews || 0})</span>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {tags.slice(0, 2).map(tag => (
                            <span key={tag} style={{ padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", background: "rgba(79,124,255,0.4)", border: "1px solid rgba(79,124,255,0.5)", backdropFilter: "blur(8px)" }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: "20px 20px 16px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: hovered ? "#4F7CFF" : "#fff", transition: "color 0.3s", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {gym.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                    <MapPin size={12} style={{ color: "#4F7CFF", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gym.location}</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                    style={{
                        width: "100%", padding: "11px", borderRadius: 14,
                        background: hovered ? "rgba(79,124,255,0.4)" : "rgba(79,124,255,0.12)",
                        border: "1px solid rgba(79,124,255,0.35)",
                        color: hovered ? "#fff" : "#4F7CFF",
                        fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        boxShadow: hovered ? "0 0 20px rgba(79,124,255,0.35)" : "none",
                        transition: "all 0.3s ease",
                    }}
                >
                    <Zap size={12} /> Book Pass
                </button>
            </div>
        </div>
    );
}
