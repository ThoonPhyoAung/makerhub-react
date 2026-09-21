import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowLeft,
  Loader2,
  Heart,
  MessageCircle,
  Cpu,
  Wrench,
  Code2,
  Download,
  ExternalLink,
  AlertTriangle,
  ImageOff,
  Bookmark,
  Send,
  User,
  Copy,
  Check,
  ShoppingBag,
} from "lucide-react";
import { getPostById, updatePost } from "../../api/postsApi";
import { postCategoryIcons, boardIconMap } from "../../utils/iconMaps";
import { useFetch } from "../../hooks/useFetch";
// show alert
import { useAlert } from "../../context/AlertContext";

const CATEGORY_SHOWCASE = "Project Showcase";
const CATEGORY_HELP = "Help & Troubleshooting";

function getTocSections(post) {
  const isShowcase = post.category === CATEGORY_SHOWCASE;
  const isHelp = post.category === CATEGORY_HELP;

  const sections = [{ id: "intro", label: "Intro" }];

  if (isShowcase) {
    if (post.hardware?.length > 0) {
      sections.push({ id: "devices", label: "Devices & Components" });
    }
    if (post.software?.length > 0) {
      sections.push({ id: "software", label: "Software & Tools" });
    }
  }

  if (isHelp) {
    sections.push({ id: "troubleshooting", label: "Troubleshooting Details" });
  }

  sections.push({ id: "description", label: "Project description" });

  if (post.sourceCode || post.sourceCodeLink) {
    sections.push({ id: "code", label: "Code" });
  }

  if (isShowcase && post.downloads?.length > 0) {
    sections.push({ id: "downloads", label: "Documentation" });
  }

  return sections;
}

function PostDetails() {
  const { id } = useParams();

  const activeUser = useSelector((state) => state.auth.user);

  const fetchFn = useCallback(() => getPostById(id), [id]);
  const { data: post, loading, error } = useFetch(fetchFn, [fetchFn]);

  const [activeSection, setActiveSection] = useState("intro");

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  //  Code copy state
  const [isCopied, setIsCopied] = useState(false);

  // shop items
  const navigate = useNavigate();

  const handleMarketplaceSearch = (itemName) => {
    // Marketplace Page သို့ Search Query ပါဝင်သော URL ဖြင့် သွားမည်
    navigate(`/marketplace?search=${encodeURIComponent(itemName)}`);
  };

  // check login user for comment , like and save
  const showAlert = useAlert();
  const checkAuth = () => {
    if (!activeUser) {
      showAlert({
        title: "Authentication Required",
        message: "Please Login First to make this action.",
        type: "warning",
        actionText: "Go to Login",
        onAction: () => navigate("/login"),
      });
      return false;
    }
    return true;
  };

  // ★ 1. API ကနေ POST DATA ရလာရင် LIKES နဲ့ COMMENTS ကို LOCAL STATE ထဲ SYNC လုပ်ခြင်း
  // Post Data ရလာတာနဲ့ Like State နဲ့ Count ကို ရယူမည်
  useEffect(() => {
    if (post) {
      const likedByList = post.likedBy || [];

      // Active User ရဲ့ ID က likedBy Array ထဲမှာ ပါမပါ စစ်မည်
      const userHasLiked = activeUser?.id
        ? likedByList.includes(activeUser.id)
        : false;

      setIsLiked(userHasLiked);
      setLikesCount(likedByList.length); // Array ရဲ့ length က Total Likes Count ဖြစ်သည်
      setCommentsList(post.commentsList || []);
    }
  }, [post, activeUser]);

  // --- 2. LOCAL STORAGE CHECK FOR USER LIKED/SAVED POSTS ---
  useEffect(() => {
    const activeUserStorage = JSON.parse(
      localStorage.getItem("makerhub_active_user") || "{}",
    );

    const likedPosts = activeUserStorage.likedPosts || [];
    if (likedPosts.includes(id)) {
      setIsLiked(true);
    }

    const savedPosts = activeUserStorage.savedPosts || [];
    if (savedPosts.includes(id)) {
      setIsSaved(true);
    }
  }, [id]);

  // --- 3. SCROLLSPY LOGIC ---
  useEffect(() => {
    if (!post) return;

    const handleScroll = () => {
      const sectionElements = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 200;

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (isAtBottom) {
        const lastSection = sectionElements[sectionElements.length - 1];
        if (lastSection) {
          setActiveSection(lastSection.id);
          return;
        }
      }

      sectionElements.forEach((el) => {
        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(el.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  // --- 4. HANDLE LIKE TOGGLE (API-BASED) ---
  const handleLikeToggle = async () => {
    if (!checkAuth()) return;

    const currentLikedBy = post.likedBy || [];
    const userId = activeUser.id;

    // Active User ID ကို ထည့်မည် သို့မဟုတ် ဖယ်ထုတ်မည်
    const updatedLikedBy = isLiked
      ? currentLikedBy.filter((id) => id !== userId) // Unlike
      : [...currentLikedBy, userId]; // Like

    // UI မှာ ချက်ချင်း အရောင်နဲ့ Count ပြောင်းနိုင်ရန် (Optimistic Update)
    const nextIsLiked = !isLiked;
    const nextCount = updatedLikedBy.length;

    setIsLiked(nextIsLiked);
    setLikesCount(nextCount);

    try {
      // API ပေါ်က Post Data ကို likedBy Array အသစ်ဖြင့် Update လုပ်မည်
      await updatePost(id, {
        ...post,
        likedBy: updatedLikedBy,
      });
    } catch (err) {
      console.error("Failed to update like:", err);
      // Error တက်ခဲ့ရင် မူလ State သို့ ပြန်ပြောင်းမည်
      setIsLiked(isLiked);
      setLikesCount(currentLikedBy.length);
    }
  };

  // --- 5. HANDLE SAVE TOGGLE ---
  const handleSaveToggle = () => {
    if (!checkAuth()) return;
    let activeUserStorage = JSON.parse(
      localStorage.getItem("makerhub_active_user") || "{}",
    );
    let allUsers = JSON.parse(localStorage.getItem("makerhub_users") || "[]");
    let savedPosts = activeUserStorage.savedPosts || [];

    if (isSaved) {
      savedPosts = savedPosts.filter((postId) => postId !== id);
      setIsSaved(false);
    } else {
      savedPosts.push(id);
      setIsSaved(true);
    }

    activeUserStorage.savedPosts = savedPosts;
    localStorage.setItem(
      "makerhub_active_user",
      JSON.stringify(activeUserStorage),
    );

    const updatedAllUsers = allUsers.map((user) =>
      user.id === activeUserStorage.id
        ? { ...user, savedPosts: savedPosts }
        : user,
    );
    localStorage.setItem("makerhub_users", JSON.stringify(updatedAllUsers));
    showAlert(isSaved ? "Removed from Saved" : "Added to Saved!");
  };

  // --- 6. HANDLE ADD COMMENT ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!checkAuth()) return;
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      userId: activeUser?.id || "unknown",
      authorName: activeUser?.name || "Anonymous",
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...commentsList, newComment];
    setCommentsList(updatedComments);
    setCommentText("");

    try {
      await updatePost(id, { ...post, commentsList: updatedComments });
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // for code color
  const codeRef = useRef(null);

  useEffect(() => {
    if (window.hljs && codeRef.current && post?.sourceCode) {
      const result = window.hljs.highlightAuto(post.sourceCode);
      codeRef.current.innerHTML = result.value;
    }
  }, [post?.sourceCode]);

  // --- 7. code copy
  const handleCopyCode = async () => {
    if (!post?.sourceCode) return;
    try {
      await navigator.clipboard.writeText(post.sourceCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2 စက္ကန့်ကြာရင် မူလ icon ပြန်ပြောင်းမည်
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const handleSmoothScroll = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);

    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <Loader2 size={32} className="mx-auto text-primary animate-spin mb-3" />
        <p className="text-text-muted">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 text-red-400">
        <p>Failed to load this post: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-24">
        <p className="text-text-muted mb-3">This post could not be found.</p>
        <Link to="/community" className="text-primary font-semibold">
          ← Back to Community
        </Link>
      </div>
    );
  }

  const isShowcase = post.category === CATEGORY_SHOWCASE;
  const isHelp = post.category === CATEGORY_HELP;
  const sections = getTocSections(post);
  const BoardIcon = boardIconMap[post.boardTag?.toLowerCase()] || Cpu;
  const CategoryIcon = postCategoryIcons[post.category];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {/* Intro Section */}
          <section
            id="intro"
            className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl overflow-hidden p-5 md:p-6 flex flex-col gap-5"
          >
            <div>
              <h1 className="text-text text-2xl md:text-3xl font-extrabold leading-tight mb-2">
                {post.title}
              </h1>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                {post.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border-muted text-xs md:text-sm text-text-subtle">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  Posted at{" "}
                  {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="font-semibold text-text">
                  {likesCount} respects
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* ★ ADD MOBILE & DESKTOP VISIBLE EDIT BUTTON HERE ★ */}
                {activeUser?.id === post.authorId && (
                  <Link
                    to={`/community/edit/${post.id}`}
                    className="p-2 px-3 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    Edit
                  </Link>
                )}

                <button
                  onClick={handleLikeToggle}
                  className={`p-2 rounded-lg border transition-colors flex items-center gap-1 ${
                    isLiked
                      ? "text-red-500 border-red-500"
                      : "text-text-muted border-border-muted hover:text-red-500"
                  }`}
                >
                  <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                </button>
                <button
                  onClick={handleSaveToggle}
                  className={`p-2 rounded-lg border transition-colors ${
                    isSaved
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-bg-subtle border-border-muted hover:border-primary text-text-muted"
                  }`}
                  title={isSaved ? "Saved" : "Save post"}
                >
                  <Bookmark
                    size={16}
                    className={isSaved ? "fill-primary" : ""}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isHelp
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                {CategoryIcon && <CategoryIcon size={12} />}
                {post.category}
              </span>
              {post.boardTag && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-bg-subtle border border-border-muted text-text-muted">
                  <BoardIcon size={12} /> {post.boardTag}
                </span>
              )}
            </div>

            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[280px] md:h-[380px] object-cover rounded-xl border border-border-muted"
              />
            ) : (
              <div className="w-full h-[200px] bg-bg-subtle rounded-xl border border-border-muted flex items-center justify-center">
                <ImageOff size={28} className="text-text-subtle" />
              </div>
            )}
          </section>

          {/* Devices Section */}
          {isShowcase && post.hardware?.length > 0 && (
            <section
              id="devices"
              className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl p-5 md:p-6"
            >
              <h2 className="flex items-center gap-2 text-text font-bold text-lg mb-4">
                <Wrench size={18} className="text-primary" /> Devices &
                Components
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {post.hardware.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-bg-subtle border border-border-muted rounded-xl p-3 min-w-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                        <Wrench size={16} className="text-text-subtle" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-text text-sm font-semibold truncate">
                        {item.name}
                      </p>
                      <p className="text-text-subtle text-xs">
                        {item.quantity}
                      </p>
                    </div>

                    {/* Shop Icon / Button ကို ညာဘက်အစွန်းဆုံးသို့ ပို့ရန် ml-auto သုံးထားသည် */}
                    <button
                      onClick={() => handleMarketplaceSearch(item.name || item)}
                      className="ml-auto  flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/25 px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors shrink-0"
                      title={`Find ${item.name || item} in Marketplace`}
                    >
                      <ShoppingBag size={15} />
                      <span className="hidden sm:inline">Find</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Software Section */}
          {isShowcase && post.software?.length > 0 && (
            <section
              id="software"
              className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl p-5 md:p-6"
            >
              <h2 className="flex items-center gap-2 text-text font-bold text-lg mb-4">
                <Code2 size={18} className="text-primary" /> Software & Tools
              </h2>
              <div className="flex flex-col gap-2">
                {post.software.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-bg-subtle border border-border-muted rounded-xl px-4 py-3"
                  >
                    <span className="text-text text-sm font-medium">
                      {item.name}
                    </span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                      >
                        Visit <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Troubleshooting Section */}
          {isHelp && (
            <section
              id="troubleshooting"
              className="scroll-mt-24 bg-red-950/20 border border-red-500/20 rounded-2xl p-5 md:p-6"
            >
              <h2 className="flex items-center gap-2 text-red-400 font-bold text-lg mb-4">
                <AlertTriangle size={18} /> Troubleshooting Details
              </h2>
              {post.errorSymptom && (
                <div className="mb-4">
                  <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1.5">
                    Error Symptom
                  </p>
                  <p className="font-mono text-sm text-red-300 bg-bg-subtle border border-border-muted rounded-lg px-4 py-3">
                    {post.errorSymptom}
                  </p>
                </div>
              )}
              {post.triedSolutions && (
                <div>
                  <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-1.5">
                    What They've Tried
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {post.triedSolutions}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Description Section */}
          <section
            id="description"
            className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl p-5 md:p-6"
          >
            <h2 className="text-text font-bold text-lg mb-4">
              {isHelp ? "Problem Description" : "Project description"}
            </h2>

            {post.longDescription && (
              <p className="text-text-muted text-sm leading-relaxed whitespace-pre-line break-words">
                {post.longDescription}
              </p>
            )}

            {post.descriptionBlocks?.length > 0 && (
              <div className="flex flex-col gap-4">
                {post.descriptionBlocks.map((block, i) =>
                  block.type === "text" ? (
                    <p
                      key={i}
                      className="text-text-muted text-sm leading-relaxed whitespace-pre-line break-words"
                    >
                      {block.value}
                    </p>
                  ) : (
                    <img
                      key={i}
                      src={block.url}
                      alt={`Illustration ${i + 1}`}
                      className="w-full rounded-xl border border-border-muted"
                    />
                  ),
                )}
              </div>
            )}
          </section>

          {/* Code Section */}
          {(post.sourceCode || post.sourceCodeLink) && (
            <section
              id="code"
              className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl p-5 md:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-text font-bold text-lg mb-4">
                  <Code2 size={18} className="text-primary" /> Code
                </h2>

                {/* Copy Code Button */}
                {post.sourceCode && (
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text bg-bg-subtle hover:bg-bg-elevated border border-border-muted px-3 py-1.5 rounded-lg transition-colors"
                    title="Copy code to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} className="text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {post.sourceCode && (
                <pre className="max-h-[400px] overflow-x-auto bg-bg-subtle border border-border-muted rounded-xl p-4 overflow-x-auto text-sm font-mono text-text-muted mb-4 whitespace-pre-wrap">
                  <code ref={codeRef} className="hljs" />
                </pre>
              )}
              {post.sourceCodeLink && (
                <a
                  href={post.sourceCodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline"
                >
                  View full source on GitHub <ExternalLink size={13} />
                </a>
              )}
            </section>
          )}

          {/* Downloads Section */}
          {isShowcase && post.downloads?.length > 0 && (
            <section
              id="downloads"
              className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl p-5 md:p-6"
            >
              <h2 className="flex items-center gap-2 text-text font-bold text-lg mb-4">
                <Download size={18} className="text-primary" /> Documentation
              </h2>
              <div className="flex flex-col gap-2">
                {post.downloads.map((file, i) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-bg-subtle border border-border-muted rounded-xl px-4 py-3 hover:border-primary transition-colors"
                  >
                    <span className="text-text text-sm font-medium">
                      {file.name}
                    </span>
                    <Download size={15} className="text-primary" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Comments Section */}
          <section
            id="comments"
            className="scroll-mt-24 bg-bg-elevated border border-border rounded-2xl p-5 md:p-6 flex flex-col gap-6"
          >
            <h2 className="flex items-center gap-2 text-text font-bold text-lg">
              <MessageCircle size={18} className="text-primary" /> Comments (
              {commentsList.length})
            </h2>

            <form onSubmit={handleAddComment} className="flex flex-col gap-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment or ask a question..."
                rows={3}
                className="w-full bg-bg-subtle border border-border-muted rounded-xl p-3 text-text text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="inline-flex items-center gap-2 bg-primary text-bg font-semibold text-sm px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-primary-hover transition-colors"
                >
                  <Send size={14} /> Comment
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-4 pt-2 border-t border-border-muted">
              {commentsList.length > 0 ? (
                commentsList.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 bg-bg-subtle p-3 rounded-xl border border-border-muted"
                  >
                    {c.avatarUrl ? (
                      <img
                        src={c.avatarUrl}
                        alt={c.authorName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-muted flex items-center justify-center shrink-0">
                        <User size={14} className="text-text-subtle" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-text text-xs font-bold">
                          {c.authorName}
                        </p>
                        <p className="text-text-subtle text-[11px]">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : "Just now"}
                        </p>
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-subtle text-sm italic text-center py-4">
                  No comments yet. Be the first to start the discussion!
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Section */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-24">
          <div className="bg-bg-elevated border border-border rounded-2xl p-4 flex items-center gap-3">
            <img
              src={
                post.avatarUrl ||
                "https://placehold.co/40x40/1c2128/64748b?text=U"
              }
              alt={post.authorName}
              className="w-10 h-10 rounded-full border border-border-muted object-cover"
            />
            <div className="min-w-0">
              <p className="text-text text-sm font-bold truncate">
                {post.authorName}
              </p>
              <p className="text-text-subtle text-xs">
                Posted by {post.authorName}
              </p>
            </div>

            {activeUser?.id === post.authorId && (
              <Link
                to={`/community/edit/${post.id}`}
                className="ml-auto text-primary text-sm font-semibold hover:underline"
              >
                Edit
              </Link>
            )}
          </div>

          <div className="bg-bg-elevated border border-border rounded-2xl p-4">
            <h3 className="text-text font-bold text-sm mb-3">
              Table of contents
            </h3>
            <ul className="flex flex-col gap-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => handleSmoothScroll(e, section.id)}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                          : "text-text-muted hover:text-primary hover:bg-bg-subtle"
                      }`}
                    >
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-bg-elevated border border-border rounded-2xl p-3 flex items-center justify-around">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 p-2 rounded-lg ${
                isLiked ? "text-red-500" : "text-text-muted"
              }`}
            >
              <Heart size={18} className={isLiked ? "fill-red-500" : ""} />{" "}
              {likesCount}
            </button>

            {/* Vertical Divider */}
            <div className="h-5 w-[1px] bg-border-muted" />

            <button
              onClick={(e) => handleSmoothScroll(e, "comments")}
              className="flex items-center gap-1 p-2 rounded-lg text-text-muted hover:text-primary"
            >
              <MessageCircle size={18} /> {commentsList.length}
            </button>

            {/* Vertical Divider */}
            <div className="h-5 w-[1px] bg-border-muted" />

            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-lg ${
                isSaved ? "text-primary" : "text-text-muted"
              }`}
            >
              <Bookmark size={18} className={isSaved ? "fill-primary" : ""} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PostDetails;
