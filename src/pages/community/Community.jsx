import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Heart, MessageCircle } from "lucide-react";
import CommunityHero from "./CommunityHero";
import CommunityCategoryNav from "./CommunityCategoryNav";

// API & Custom Hooks
import { useFetch } from "../../hooks/useFetch";
import { getPosts } from "../../api/postsApi";
import { communityCategories } from "../../data/communityCategories";
import { postCategoryIcons } from "../../data/communityCategories";

function Community() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: posts, loading, error } = useFetch(getPosts);

  function getFilteredPosts() {
    if (!posts) return [];
    if (activeCategory === "all") return posts;

    if (activeCategory === "help") {
      return posts.filter((post) => post.category === "Help & Troubleshooting");
    }

    return posts.filter(
      (post) => post.boardTag?.toLowerCase().trim() === activeCategory,
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div>
      <CommunityHero />

      <CommunityCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div
        className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16"
        id="projectsSection"
      >
        {loading ? (
          /* Loading State */
          <div className="text-center py-16">
            <Loader2
              size={32}
              className="mx-auto text-primary animate-spin mb-3"
            />
            <p className="text-text-muted">Loading project details...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16 text-red-400">
            <p>Failed to load community posts: {error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-text-muted">
            <p>No projects found here yet!</p>
          </div>
        ) : (
          /* Data List Display Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const Icon = postCategoryIcons[post.category];
              const boardTagIcon = communityCategories.find(
                (category) => category.id === post.boardTag?.toLowerCase(),
              )?.icon;
              const BoardTagIcon = boardTagIcon || null;
              const isHelp = post.category === "Help & Troubleshooting";

              return (
                <Link
                  key={post.id}
                  to={`/community/project/${post.id}`}
                  className="block h-full"
                >
                  <div className="h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-bg-elevated hover:shadow-lg">
                    {/* image wrapper — relative so the badge overlays the image, not the card */}
                    <div className="p-1 relative">
                      <img
                        src={
                          post.image ||
                          "https://placehold.co/500x300/1c2128/64748b?text=No+Image"
                        }
                        alt={post.title}
                        className="w-full h-[200px] rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.01]"
                      />

                      {/* premium glass-style category badge */}
                      <span
                        className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-sm ${
                          isHelp
                            ? "bg-red-500/20 border-red-400/40 text-red-100"
                            : "bg-black/40 border-white/15 text-white"
                        }`}
                      >
                        {Icon && <Icon size={12} />}
                        {post.category}
                      </span>
                    </div>

                    {/* card-content */}
                    <div className="p-3 flex flex-col flex-1">
                      {post.boardTag && (
                        <span className="text-text-subtle text-xs font-medium mb-1 inline-block border-b border-border-muted pb-0.5">
                          {/* icon */}
                          <span className="inline-flex items-center gap-1 mr-1">
                            {BoardTagIcon && <BoardTagIcon size={12} />}
                          </span>
                          {post.boardTag}
                        </span>
                      )}
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
                              post.avatarUrl || "https://via.placeholder.com/40"
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
                            {post.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={13} /> {post.comments || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;
