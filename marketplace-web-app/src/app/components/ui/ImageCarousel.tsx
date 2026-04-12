import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
    images: string[];
    className?: string;
    altPrefix?: string;
    autoSlide?: boolean;
    autoSlideInterval?: number;
    externalHover?: boolean;
}

export function ImageCarousel({
    images,
    className = "",
    altPrefix = "Slide",
    autoSlide = true,
    autoSlideInterval = 3000,
    externalHover
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [internalHover, setInternalHover] = useState(false);

    const isHovered = externalHover !== undefined ? externalHover : internalHover;

    useEffect(() => {
        if (!autoSlide || images.length <= 1 || !isHovered) return;

        const slideInterval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, autoSlideInterval);

        return () => clearInterval(slideInterval);
    }, [images, autoSlide, autoSlideInterval, isHovered]);

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}>
                <span className="text-gray-400">No images</span>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full h-full overflow-hidden group ${className}`}
            onMouseEnter={() => setInternalHover(true)}
            onMouseLeave={() => setInternalHover(false)}
        >
            <img
                src={images[currentIndex]}
                alt={`${altPrefix} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 opacity-0 group-hover:opacity-100 transition-all z-30"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 opacity-0 group-hover:opacity-100 transition-all z-30"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-30">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all ${i === currentIndex ? "bg-white w-4" : "bg-white/40 w-1.5"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
