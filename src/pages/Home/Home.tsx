
import axios from "axios";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import { LuRefreshCw } from "react-icons/lu";
import { CreatedAuthenticationContext } from "../../Context/authContext";
import HomeSideBar from "../../components/homeSideBar/homeSideBar";
import PostCard from "../../components/PostCard/PostCard";
import type { HomeView, PostType, Privacy } from "./home.types";
import LoadingPosts from "../../components/Loading/LoadingPost";
import EmptyState from "../../components/emptystate/EmptyState";
import { useParams } from "react-router-dom";
import CreatePost from "../../components/CreatePost/CreatePost";
export default function Home() {
  const { Token } = useContext(CreatedAuthenticationContext)!;
  const [view, setView] = useState<HomeView>("latest");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts", Token],

    queryFn: ({ signal }) => {
      return axios.get(
        "https://route-posts.routemisr.com/Posts",
        {
          headers: {
            token: Token,
          },
          signal,
        },
      );
    },
    
    enabled: Boolean(Token),
    staleTime: 60000,
  })
  
  const {id} = useParams()
  const {data:commentData , isLoading:commentLoading , isError:commentsIsError}= useQuery({
    queryKey:["comments", id],
    queryFn:({ signal }) => {
      return axios.get(
        `https://route-posts.routemisr.com/posts/${id}/comments`,
        {
          headers: {
            token: Token,
          },
          signal,
        },
      );
    },
  })
  const posts: PostType[] = data?.data?.data?.posts ?? [];
  async function createPost(
    body: string,
    privacy: Privacy,
    image: File | null,
  ): Promise<void> {
    if (!Token) {
      throw new Error("Please sign in first.");
    }
    const formData = new FormData();
    formData.append("body", body);
    formData.append("privacy", privacy);
    if (image) {
      formData.append("image", image);
    }
    try {
      await axios.post(
        "https://route-posts.routemisr.com/Posts",
        formData,
        {
          headers: {
            token: Token,
          },
        },
      );
      toast.success("Post published successfully!");
      setView("latest");
      await refetch();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to publish post."
        : "Unable to publish your post.";
      toast.danger(message);
      throw new Error(message);
    }
  }

  function toggleSaved(id: string) {
    setSavedIds((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id],
    );
  }

  let visiblePosts = [...posts];

  if (view === "saved") {
    visiblePosts = visiblePosts.filter((post) =>
      savedIds.includes(post._id),
    );
  }

  if (view === "popular") {
    visiblePosts.sort(
      (a, b) =>
        (b.likesCount ?? b.likes?.length ?? 0) -
        (a.likesCount ?? a.likes?.length ?? 0),
    );
  } else {
    visiblePosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
  }


  const views: { id: HomeView; label: string }[] = [
    { id: "latest", label: "Latest" },
    { id: "popular", label: "Popular" },
    { id: "saved", label: "Saved" },
  ];

  return (
    <main className="min-h-screen bg-deep-black px-3 pb-16 pt-7 text-white sm:px-6 lg:pt-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] text-acid-lime">
              THE SOCIAL SPACE
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              THE{" "}
              <span className="text-acid-lime">
                CURRENT.
              </span>
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Real people. Fresh perspectives. One shared space.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border-gray bg-charcoal px-4 py-2 text-[10px] font-bold tracking-widest text-gray-300">
            <span className="h-2 w-2 rounded-full bg-acid-lime" />
            NEXO NETWORK
          </div>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[235px_minmax(0,1fr)_270px]">
          <HomeSideBar
            activeView={view}
            setActiveView={setView}
            savedCount={savedIds.length}
          />

          <div className="min-w-0 space-y-5">
            <CreatePost onCreatePost={createPost} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-border-gray bg-charcoal p-1">
                {views.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    className={`cursor-pointer rounded-lg px-3 py-2.5 text-xs font-bold transition sm:px-5 ${
                      view === item.id
                        ? "bg-acid-lime text-deep-black"
                        : "text-gray-400 hover:bg-input-gray hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

              </div>

              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching || !Token}
                aria-label="Refresh feed"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border-gray text-gray-400 transition hover:text-acid-lime disabled:opacity-50"
              >
                <LuRefreshCw
                  size={18}
                  className={
                    isFetching ? "animate-spin" : ""
                  }
                />
              </button>
            </div>

            {!Token && (
              <div className="rounded-3xl border border-border-gray bg-charcoal p-8 text-center">
                <p className="text-gray-400">
                  Sign in to explore your NEXO feed.
                </p>
              </div>
            )}

            {Token && isError && !data && (
              <div
                role="alert"
                className="rounded-3xl border border-red-400/30 bg-charcoal p-8 text-center"
              >
                <p className="font-bold text-red-400">
                  Connection interrupted.
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {error.message}
                </p>

                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-5 cursor-pointer rounded-xl bg-acid-lime px-5 py-3 text-xs font-black text-deep-black"
                >
                  TRY AGAIN
                </button>
              </div>
            )}

            {Token && isPending && !isError && (
              <LoadingPosts
                loadMsg="Loading NEXO Posts..."
              />
            )}

            {Token &&
              !isPending &&
              visiblePosts.map((post) => (
                <PostCard
                  key={post._id}
                  allComments={commentData?.data.data.comments}
                  post={post}
                  saved={savedIds.includes(post._id)}
                  onToggleSave={toggleSaved}
                />
              ))}

            {Token &&
              !isPending &&
              !isError &&
              visiblePosts.length === 0 && (
                <EmptyState view={view} />
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
