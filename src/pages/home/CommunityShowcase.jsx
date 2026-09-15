import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Heart, MessageCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getPosts } from "../../api/postsApi";

function CommunityShowcase() {
  const { data: posts, loading, error } = useFetch(getPosts);

  // Newest post ၃ ခု — createdAt ကို compare လုပ်ပြီး sort (array insertion
  // order ကို reverse() လုပ်တဲ့ old-JS logic ထက် ပိုတိကျတယ်, MockAPI ရဲ့
  // return order က insertion order နဲ့ အမြဲတူချင်မှ တူမယ်).
  const latestThree = posts
    ? [...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
    : [];

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-border">
          <h2 className="text-text text-2xl font-bold">Community Showcase</h2>

          <Link
            to="/community"
            className="flex items-center gap-2 text-text font-semibold text-sm hover:text-primary transition-colors shrink-0 whitespace-nowrap"
          >
            <span className="hidden sm:inline">View Community</span>
            <span className="sm:hidden text-text-muted">View All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          /* Loading State */
          <div className="text-center py-6">
            <Loader2
              size={32}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-text-muted">Loading project details...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-6 text-red-400">
            <p>Failed to load projects: {error}</p>
          </div>
        ) : latestThree.length === 0 ? (
          /* Empty State */
          <div className="text-center py-6 text-text-muted">
            <p>No projects yet — be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestThree.map((post) => (
              <Link
                key={post.id}
                to={`/community/project/${post.id}`}
                className="block h-full"
              >
                <div className="h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-bg-elevated hover:shadow-lg">
                  <div className="p-1">
                    <img
                      src={
                        post.image ||
                        "https://placehold.co/500x300/1c2128/64748b?text=No+Image"
                      }
                      alt={post.title}
                      className="w-full h-[180px] rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.01]"
                    />
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-text text-base font-bold mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Footer — mt-auto so it sits at the bottom regardless of desc length */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            post.avatarUrl ||
                            "https://placehold.co/40x40/1c2128/64748b?text=U"
                          }
                          alt={post.authorName}
                          className="w-6 h-6 rounded-full border border-border-muted p-px"
                        />
                        <span className="text-text-subtle text-sm font-medium">
                          {post.authorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-text-subtle text-sm">
                        <span className="flex items-center gap-1">
                          <Heart size={13} className="text-red-500" />{" "}
                          {post.likedBy?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={13} />{" "}
                          {post.commentsList?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CommunityShowcase;
