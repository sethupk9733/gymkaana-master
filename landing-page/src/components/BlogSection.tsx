import React, { useState, useEffect } from "react";
import { 
  FileText, Search, Clock, Eye, User, Tag, ArrowLeft, Sparkles, BookOpen, ChevronRight, TrendingUp, X 
} from "lucide-react";

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  createdAt: string;
}

const FALLBACK_BLOGS: BlogItem[] = [
  {
    _id: "fb-1",
    title: "10 High-Intensity Workouts to Transform Your Strength in 30 Days",
    slug: "10-high-intensity-workouts-strength",
    category: "Fitness",
    coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    author: "Coach Alex Vance",
    readTime: "4 min read",
    views: 1420,
    createdAt: new Date().toISOString(),
    excerpt: "Unlock progressive overload technique, compound resistance movements, and interval splits engineered for explosive muscle growth.",
    tags: ["HIIT", "Strength", "Muscle Gain"],
    content: `## Maximizing Explosive Strength with Targeted Training\n\nBuilding sustainable muscle requires more than just lifting heavy weights. High-Intensity Interval Training (HIIT) coupled with compound resistance movements provides the ideal stimulus for hypertrophic adaptation.\n\n### Key Principles for Maximum Gains\n\n1. **Progressive Overload**: Consistently increase weight or repetitions week over week.\n2. **Nutritional Recovery**: Ensure adequate protein intake (1.6g to 2.2g per kg of bodyweight).\n3. **Optimal Rest**: Muscle recovery occurs during sleep, aim for 7-9 hours per night.\n\nCombine squat variations, deadlifts, overhead presses, and high-tempo cardio intervals for maximum results.`
  },
  {
    _id: "fb-2",
    title: "The Ultimate Guide to Pre-Workout & Post-Workout Nutrition",
    slug: "ultimate-pre-post-workout-nutrition",
    category: "Nutrition",
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
    author: "Dr. Sarah Jenkins",
    readTime: "6 min read",
    views: 2890,
    createdAt: new Date().toISOString(),
    excerpt: "Learn what macronutrients your body needs before hitting the gym and how to accelerate muscle recovery post-workout.",
    tags: ["Nutrition", "Diet", "Recovery"],
    content: `## Fueling Peak Performance\n\nTiming your nutrition around your workouts can dramatically improve stamina, endurance, and anabolic recovery.\n\n### What to Consume Pre-Workout (60-90 mins prior)\n- Fast-digesting complex carbohydrates (oatmeal, bananas, rice cakes)\n- Lean protein source (whey isolate or Greek yogurt)\n- Hydration with essential electrolytes\n\n### Post-Workout Anabolic Window\n- Consuming protein within 45 minutes triggers muscle protein synthesis.\n- Pair protein with simple carbs to replenish glycogen stores.`
  },
  {
    _id: "fb-3",
    title: "How Gym Owners Can Maximize Member Retention in 2026",
    slug: "gym-owners-maximize-member-retention",
    category: "Gym Owners",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    author: "Gymkaana Insights Team",
    readTime: "5 min read",
    views: 3100,
    createdAt: new Date().toISOString(),
    excerpt: "Explore automated check-in systems, digital membership management, and community challenges that keep members engaged year-round.",
    tags: ["Business", "Gym Growth", "Management"],
    content: `## Transforming Gym Operations for Sustainable Growth\n\nMember retention is the backbone of any successful fitness center. In today's digital fitness ecosystem, providing seamless access and community motivation is paramount.\n\n### Top Retention Strategies:\n- **Gamified Challenges**: Run weekly step and workout challenges with leaderboards.\n- **Flexible Day Passes**: Attract hybrid fitness enthusiasts with Gymkaana digital passes.\n- **Instant Support & Feedback**: Resolve member queries fast with automated support tools.`
  }
];

const GREEN = "#A3E635";
const ACCENT = "#4F7CFF";

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<BlogItem | null>(null);

  const categories = ["All", "Fitness", "Nutrition", "Gym Owners", "Workout Tips", "News", "Guides"];

  useEffect(() => {
    loadBlogs();
  }, [selectedCategory]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (selectedCategory !== "All") query.append("category", selectedCategory);
      if (searchQuery) query.append("search", searchQuery);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/blogs?_t=${Date.now()}&${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const fetchedBlogs: BlogItem[] = data.blogs || [];
        
        // Merge uploaded database blogs at the top with sample fallbacks
        const mergedBlogs = [...fetchedBlogs];
        FALLBACK_BLOGS.forEach(fb => {
          if (!mergedBlogs.some(b => b.slug === fb.slug || b._id === fb._id)) {
            mergedBlogs.push(fb);
          }
        });
        setBlogs(mergedBlogs);
      } else {
        setBlogs(FALLBACK_BLOGS);
      }
    } catch (e) {
      setBlogs(FALLBACK_BLOGS);
    } finally {
      setLoading(false);
    }
  };


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBlogs();
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogs.find(b => b.category === "Fitness") || blogs[0];

  return (
    <section id="blogs" style={{ position: "relative", padding: "100px 24px", background: "#080808", color: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyCenter: "center", padding: 24, overflowY: "auto"
          }}>
            <div style={{
              background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 32, maxWidth: 840, width: "100%",
              margin: "auto", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.8)", position: "relative"
            }}>
              {/* Header Bar */}
              <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setActiveArticle(null)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 12, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                >
                  <ArrowLeft size={16} /> Back to Articles
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: 32, maxHeight: "80vh", overflowY: "auto" }}>
                {activeArticle.coverImage && (
                  <div style={{ height: 320, borderRadius: 24, overflow: "hidden", marginBottom: 24 }}>
                    <img src={activeArticle.coverImage} alt={activeArticle.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}

                <span style={{ padding: "6px 14px", borderRadius: 100, background: `${GREEN}20`, color: GREEN, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {activeArticle.category}
                </span>

                <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 12, marginBottom: 16, lineHeight: 1.2 }}>
                  {activeArticle.title}
                </h1>

                <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 24, pb: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><User size={14} style={{ color: GREEN }} /> {activeArticle.author}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} style={{ color: ACCENT }} /> {activeArticle.readTime || '4 min read'}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} /> {(activeArticle.views || 0).toLocaleString()} views</span>
                </div>

                {activeArticle.excerpt && (
                  <p style={{ fontSize: 16, fontStyle: "italic", borderLeft: `4px solid ${GREEN}`, paddingLeft: 16, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>
                    "{activeArticle.excerpt}"
                  </p>
                )}

                <div style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>
                  {activeArticle.content.split('\n\n').map((p, idx) => {
                    if (p.startsWith('## ')) return <h2 key={idx} style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 24, marginBottom: 12 }}>{p.replace('## ', '')}</h2>;
                    if (p.startsWith('### ')) return <h3 key={idx} style={{ fontSize: 18, fontWeight: 800, color: GREEN, marginTop: 20, marginBottom: 8 }}>{p.replace('### ', '')}</h3>;
                    return <p key={idx} style={{ marginBottom: 16 }}>{p}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: `${GREEN}15`, border: `1px solid ${GREEN}30`, color: GREEN, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
            <Sparkles size={14} /> Gymkaana Fitness Journal
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
            Workouts, Nutrition & Gym Science
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            Read the latest training insights, high-intensity workout routines, and fitness management strategies from industry experts.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyBetween: "space-between", marginBottom: 40, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: 16, borderRadius: 24 }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: "1 1 280px", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder="Search fitness articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px 12px 48px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, color: "#fff", fontSize: 13, outline: "none"
              }}
            />
          </form>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "10px 18px", borderRadius: 100, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                  background: selectedCategory === cat ? GREEN : "rgba(255,255,255,0.05)",
                  color: selectedCategory === cat ? "#000" : "rgba(255,255,255,0.6)"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Hero Article */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <div
            onClick={() => setActiveArticle(featuredPost)}
            style={{
              cursor: "pointer", background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 32, overflow: "hidden", marginBottom: 40,
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", transition: "all 0.3s"
            }}
          >
            <div style={{ height: 340, overflow: "hidden", position: "relative" }}>
              <img src={featuredPost.coverImage} alt={featuredPost.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.6))" }} />
            </div>
            <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span style={{ padding: "6px 14px", borderRadius: 100, background: `${GREEN}20`, color: GREEN, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Featured Post
                </span>
                <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginTop: 12, marginBottom: 12, lineHeight: 1.3 }}>
                  {featuredPost.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {featuredPost.excerpt}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                <span>By {featuredPost.author}</span>
                <span style={{ color: GREEN, fontWeight: 900, display: "flex", alignItems: "center", gap: 4 }}>
                  Read Article <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => setActiveArticle(blog)}
              style={{
                cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between",
                transition: "all 0.3s"
              }}
            >
              <div>
                <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
                  <img src={blog.coverImage} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 16, left: 16, padding: "4px 12px", borderRadius: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", color: GREEN, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", border: `1px solid ${GREEN}30` }}>
                    {blog.category}
                  </span>
                </div>
                <div style={{ padding: 24 }}>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
                    {blog.title}
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={12} style={{ color: GREEN }} /> {blog.readTime || '4 min read'}</span>
                <span style={{ color: GREEN, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                  Read <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
