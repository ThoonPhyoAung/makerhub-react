import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";

// 📌 API မှ real community posts များကို ယူရန်
import { useFetch } from "../../hooks/useFetch";
import { getPosts } from "../../api/postsApi";
import { useAlert } from "../../context/AlertContext";

function Community() {
  const { data: apiPosts, loading, error } = useFetch(getPosts);
  const [posts, setPosts] = useState([]);
  const showAlert = useAlert();

  // API data ဝင်လာသည့်အခါ local state သို့ ထည့်သွင်းခြင်း
  useEffect(() => {
    if (Array.isArray(apiPosts)) {
      setPosts(apiPosts);
    }
  }, [apiPosts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal States for Deletion Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const title = post.title || "";
    const author = post.authorName || post.author || "Anonymous";
    const category = post.category || post.type || "Help Requests";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Toggle Hide/Unhide Post
  const toggleHidePost = async (id) => {
    const targetPost = posts.find((p) => String(p.id) === String(id));
    if (!targetPost) return;

    const currentStatus = targetPost.status || "Published";
    const newStatus = currentStatus === "Hidden" ? "Published" : "Hidden";

    const previousPosts = [...posts];
    const updatedPosts = posts.map((post) =>
      String(post.id) === String(id) ? { ...post, status: newStatus } : post,
    );
    setPosts(updatedPosts);

    try {
      showAlert(`Post status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update post status:", err);
      setPosts(previousPosts);
      showAlert("Failed to update post status.");
    }
  };

  // Open Delete Modal
  const confirmDelete = (post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  // Execute Delete after confirmation
  const handleDeleteConfirmed = async () => {
    if (postToDelete) {
      const previousPosts = [...posts];
      setPosts(
        posts.filter((post) => String(post.id) !== String(postToDelete.id)),
      );
      setIsDeleteModalOpen(false);

      try {
        showAlert("Community post removed successfully.");
        setPostToDelete(null);
      } catch (err) {
        console.error("Failed to delete post:", err);
        setPosts(previousPosts);
        showAlert("Failed to delete post.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading community management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Community Management</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Moderate showcase projects, help requests, and discussions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-bg-elevated border border-border text-xs font-medium text-text">
            Total Posts:{" "}
            <strong className="text-primary">{posts.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. Search & Category Filter Bar */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter size={16} className="text-text-muted" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary transition-colors w-full md:w-auto"
          >
            <option value="All">All Posts</option>
            <option value="Showcase Projects">Showcase Projects</option>
            <option value="Help Requests">Help Requests</option>
          </select>
        </div>
      </div>

      {/* 3. Community Posts Table */}
      <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/50 text-xs text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">
                  Post Title & Author
                </th>
                <th className="py-3.5 px-5 font-semibold">Category</th>
                <th className="py-3.5 px-5 font-semibold">Engagement</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const postTitle = post.title || "Untitled Post";
                  const authorName =
                    post.authorName || post.author || "Anonymous";
                  const postCategory =
                    post.category || post.type || "Help Requests";
                  const likesCount = Array.isArray(post.likedBy)
                    ? post.likedBy.length
                    : Number(post.likes || 0);
                  const commentsCount = Array.isArray(post.commentsList)
                    ? post.commentsList.length
                    : Number(post.comments || 0);
                  const postStatus = post.status || "Published";

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-surface/30 transition-colors"
                    >
                      <td className="py-4 px-5 max-w-md">
                        <p className="font-medium text-text line-clamp-1 hover:text-primary cursor-pointer">
                          {postTitle}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          by {authorName}
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            postCategory === "Showcase Projects"
                              ? "bg-primary/10 text-primary"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {postCategory}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={13} /> {likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={13} /> {commentsCount}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            postStatus === "Published"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : postStatus === "Reported"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {postStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleHidePost(post.id)}
                            title={
                              postStatus === "Hidden"
                                ? "Unhide Post"
                                : "Hide Post"
                            }
                            className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text hover:bg-surface/80 transition-colors"
                          >
                            {postStatus === "Hidden" ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>

                          {/* Trigger Delete Confirmation Modal */}
                          <button
                            onClick={() => confirmDelete(post)}
                            title="Delete Post"
                            className="p-2 rounded-xl bg-surface border border-border text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-text-muted text-sm"
                  >
                    No community posts found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-bg-elevated border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text">
                Are you sure you want to delete this post?
              </h3>
              <p className="text-sm text-text-muted mt-1">
                "{postToDelete?.title}" will be permanently removed. This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;
