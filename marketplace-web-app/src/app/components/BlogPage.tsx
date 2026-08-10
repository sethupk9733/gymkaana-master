import { useState, useEffect } from 'react';
import { 
  FileText, Search, Clock, Eye, User, Calendar, Tag, 
  ArrowLeft, Share2, Sparkles, BookOpen, ChevronRight, TrendingUp 
} from 'lucide-react';
import { fetchPublishedBlogs, fetchBlogBySlug } from '../lib/api';

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
    _id: 'fb-1',
    title: '10 High-Intensity Workouts to Transform Your Strength in 30 Days',
    slug: '10-high-intensity-workouts-strength',
    category: 'Fitness',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    author: 'Coach Alex Vance',
    readTime: '4 min read',
    views: 1420,
    createdAt: new Date().toISOString(),
    excerpt: 'Unlock progressive overload technique, compound resistance movements, and interval splits engineered for explosive muscle growth.',
    tags: ['HIIT', 'Strength', 'Muscle Gain'],
    content: `## Maximizing Explosive Strength with Targeted Training\n\nBuilding sustainable muscle requires more than just lifting heavy weights. High-Intensity Interval Training (HIIT) coupled with compound resistance movements provides the ideal stimulus for hypertrophic adaptation.\n\n### Key Principles for Maximum Gains\n\n1. **Progressive Overload**: Consistently increase weight or repetitions week over week.\n2. **Nutritional Recovery**: Ensure adequate protein intake (1.6g to 2.2g per kg of bodyweight).\n3. **Optimal Rest**: Muscle recovery occurs during sleep, aim for 7-9 hours per night.\n\nCombine squat variations, deadlifts, overhead presses, and high-tempo cardio intervals for maximum results.`
  },
  {
    _id: 'fb-2',
    title: 'The Ultimate Guide to Pre-Workout & Post-Workout Nutrition',
    slug: 'ultimate-pre-post-workout-nutrition',
    category: 'Nutrition',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop',
    author: 'Dr. Sarah Jenkins',
    readTime: '6 min read',
    views: 2890,
    createdAt: new Date().toISOString(),
    excerpt: 'Learn what macronutrients your body needs before hitting the gym and how to accelerate muscle recovery post-workout.',
    tags: ['Nutrition', 'Diet', 'Recovery'],
    content: `## Fueling Peak Performance\n\nTiming your nutrition around your workouts can dramatically improve stamina, endurance, and anabolic recovery.\n\n### What to Consume Pre-Workout (60-90 mins prior)\n- Fast-digesting complex carbohydrates (oatmeal, bananas, rice cakes)\n- Lean protein source (whey isolate or Greek yogurt)\n- Hydration with essential electrolytes\n\n### Post-Workout Anabolic Window\n- Consuming protein within 45 minutes triggers muscle protein synthesis.\n- Pair protein with simple carbs to replenish glycogen stores.`
  },
  {
    _id: 'fb-3',
    title: 'How Gym Owners Can Maximize Member Retention in 2026',
    slug: 'gym-owners-maximize-member-retention',
    category: 'Gym Owners',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    author: 'Gymkaana Insights Team',
    readTime: '5 min read',
    views: 3100,
    createdAt: new Date().toISOString(),
    excerpt: 'Explore automated check-in systems, digital membership management, and community challenges that keep members engaged year-round.',
    tags: ['Business', 'Gym Growth', 'Management'],
    content: `## Transforming Gym Operations for Sustainable Growth\n\nMember retention is the backbone of any successful fitness center. In today's digital fitness ecosystem, providing seamless access and community motivation is paramount.\n\n### Top Retention Strategies:\n- **Gamified Challenges**: Run weekly step and workout challenges with leaderboards.\n- **Flexible Day Passes**: Attract hybrid fitness enthusiasts with Gymkaana digital passes.\n- **Instant Support & Feedback**: Resolve member queries fast with automated support tools.`
  }
];

export function BlogPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogItem | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Fitness', 'Nutrition', 'Gym Owners', 'Workout Tips', 'News', 'Guides'];

  useEffect(() => {
    loadBlogs();
  }, [selectedCategory]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await fetchPublishedBlogs({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined
      });
      const fetchedBlogs: BlogItem[] = data.blogs || [];
      const mergedBlogs = [...fetchedBlogs];
      FALLBACK_BLOGS.forEach(fb => {
        if (!mergedBlogs.some(b => b.slug === fb.slug || b._id === fb._id)) {
          mergedBlogs.push(fb);
        }
      });
      setBlogs(mergedBlogs);
      
      // Auto-open blog if specified in URL
      const params = new URLSearchParams(window.location.search);
      const targetSlug = params.get('article') || params.get('slug') || window.location.pathname.split('/blog/')[1];
      if (targetSlug) {
        const found = mergedBlogs.find(b => b.slug === targetSlug || b._id === targetSlug);
        if (found) {
          handleOpenArticle(found, false);
        }
      }
    } catch (err) {
      console.warn('Backend API offline or empty, showing curated articles:', err);
      setBlogs(FALLBACK_BLOGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBlogs();
  };

  const handleOpenArticle = async (blog: BlogItem, updateUrl = true) => {
    setActiveArticle(blog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${blog.title} | Gymkaana Blog`;

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('screen', 'blogs');
      url.searchParams.set('article', blog.slug);
      window.history.pushState({ article: blog.slug }, '', url.toString());
    }

    try {
      const detailed = await fetchBlogBySlug(blog.slug);
      if (detailed) {
        setActiveArticle(detailed);
      }
    } catch (e) {
      console.log('Using active article cache:', e);
    }
  };

  const handleBackToList = () => {
    setActiveArticle(null);
    document.title = 'Gymkaana Blog & Fitness Journal';
    const url = new URL(window.location.href);
    url.searchParams.set('screen', 'blogs');
    url.searchParams.delete('article');
    url.searchParams.delete('slug');
    window.history.pushState({}, '', url.toString());
  };

  const handleShareArticle = () => {
    if (!activeArticle) return;
    const shareUrl = `${window.location.origin}/?screen=blogs&article=${activeArticle.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogs.find(b => b.category === 'Fitness') || blogs[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Full-Screen Article Reader */}
      {activeArticle ? (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-slate-800 transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </button>

            <button
              onClick={handleShareArticle}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#A3E635] hover:bg-[#8ece28] text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Link Copied!' : 'Share Article URL'}
            </button>
          </div>

          <article className="bg-slate-900/90 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
            {activeArticle.coverImage && (
              <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-[#A3E635] text-black font-black text-xs rounded-full uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight drop-shadow-md">
                    {activeArticle.title}
                  </h1>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-10 space-y-6">
              {!activeArticle.coverImage && (
                <div>
                  <span className="px-3 py-1 bg-[#A3E635] text-black font-black text-xs rounded-full uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 leading-tight">
                    {activeArticle.title}
                  </h1>
                </div>
              )}

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center font-bold text-sm">
                    {activeArticle.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-sm">{activeArticle.author}</p>
                    <p className="text-slate-400">Published by Gymkaana Journal</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#A3E635]" />
                    {activeArticle.readTime || '5 min read'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-blue-400" />
                    {(activeArticle.views || 0).toLocaleString()} Views
                  </span>
                  <button
                    onClick={handleShareArticle}
                    className="flex items-center gap-1 text-[#A3E635] hover:underline font-semibold"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>


              {/* Excerpt */}
              {activeArticle.excerpt && (
                <p className="text-lg font-medium text-slate-300 italic border-l-4 border-[#A3E635] pl-4 py-1">
                  "{activeArticle.excerpt}"
                </p>
              )}

              {/* Main Body */}
              <div className="prose prose-invert max-w-none text-slate-200 space-y-4 leading-relaxed text-base">
                {activeArticle.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold text-[#A3E635] mt-5 mb-2">{paragraph.replace('### ', '')}</h3>;
                  }
                  return <p key={index} className="text-slate-300 text-base">{paragraph}</p>;
                })}
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {activeArticle.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      ) : (
        /* Blog Home Directory View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-black border border-slate-800 p-8 sm:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/10 rounded-full filter blur-3xl -z-0" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#A3E635]/20 text-[#A3E635] rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-[#A3E635]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Gymkaana Fitness Journal
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Workouts, Nutrition & Gym Science
              </h1>
              <p className="text-slate-400 text-base sm:text-lg mt-3">
                Expert insights, training protocols, and fitness management strategies tailored for athletes and gym enthusiasts.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mt-8 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles by title, workout, or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A3E635] shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#A3E635] hover:bg-[#8ee016] text-black font-black text-sm rounded-2xl transition-all shadow-lg shadow-[#A3E635]/20 shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#A3E635] text-black shadow-lg shadow-[#A3E635]/20 scale-[1.02]'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Hero Article Card (If applicable) */}
          {featuredPost && selectedCategory === 'All' && !searchQuery && (
            <div
              onClick={() => handleOpenArticle(featuredPost)}
              className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 hover:border-[#A3E635]/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />
                </div>
                <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A3E635]/20 text-[#A3E635] rounded-full text-xs font-black uppercase tracking-wider mb-3">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Featured Article
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#A3E635] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-3 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#A3E635]" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                      <span>Read Article</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article Cards Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#A3E635]" />
                Latest Published Articles
              </h3>
              <span className="text-xs font-semibold text-slate-500">{filteredBlogs.length} articles found</span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-[#A3E635] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Fetching articles...
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
                <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p className="font-semibold text-slate-300">No articles match your search criteria</p>
                <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-3 text-xs text-[#A3E635] underline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => handleOpenArticle(blog)}
                    className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-[#A3E635]/40 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">
                            <FileText className="w-10 h-10" />
                          </div>
                        )}
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md text-[#A3E635] font-black text-xs rounded-full uppercase tracking-wider border border-[#A3E635]/20">
                          {blog.category}
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <h4 className="text-lg font-bold text-white group-hover:text-[#A3E635] transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h4>
                        <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A3E635]" />
                        {blog.readTime || '4 min read'}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-300 group-hover:text-[#A3E635]">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
