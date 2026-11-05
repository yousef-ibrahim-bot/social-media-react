import { use, useContext, useEffect, useState } from "react";
import {
  LuBookmark,
  LuGlobe,
  LuHeart,
  LuLock,
  LuUsers,
  LuMessageCircle,
  LuRepeat2,
  LuEllipsis,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import type { PostCardProps, User } from "../../pages/Home/home.types";
import TopCommensts from "../TopComments/TopComments";
import CommentCard from "../CommentsCard/CommentCard";
import CreateComment from "./../CreateComments/CreateComments";
import { CreatedAuthenticationContext } from "../../Context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@heroui/react";

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function PostAvatar({
  user,
  size = "md",
}: {
  user?: User | null;
  size?: "sm" | "md";
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const name = user?.name || "NEXO Member";
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-acid-lime/40 bg-input-gray ${
        size === "sm" ? "h-10 w-10" : "h-12 w-12"
      }`}
    >
      {user?.photo && failedUrl !== user.photo ? (
        <img
          src={user.photo}
          alt={`${name} profile`}
          onError={() => setFailedUrl(user.photo ?? null)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xs font-black text-acid-lime">
          {initialsOf(name)}
        </span>
      )}
    </div>
  );
}

export default function PostCard({
  post,
  saved,
  allComments,
  onToggleSave,
}: PostCardProps) {
  const author = post.user;
  const authorName = author?.name || "NEXO Member";
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { UserId } = useContext(CreatedAuthenticationContext)!;
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(post.body ?? "");
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const { Token } = useContext(CreatedAuthenticationContext)!;
  const queryClient = useQueryClient();

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: {
        token: Token,
      },
    });
  }

  const { isPending, mutate: deletePostMutation } = useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      toast.success("Post deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onError: (error) => {
      toast.danger(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to delete post."
          : "Failed to delete post.",
      );
    },
  });

  function editPost() {
    const formData = new FormData();

    formData.append("body", editedBody.trim());

    if (editedImage) {
      formData.append("image", editedImage);
    }

    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}`,
      formData,
      {
        headers: {
          token: Token,
        },
      },
    );
  }

  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: editPost,

    onSuccess: () => {
      setIsEditing(false);
      setEditedImage(null);

      queryClient.invalidateQueries({
        queryKey: ["singlePost", post._id],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onError: (error) => {
      toast.danger(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to update post."
          : "Failed to update post.",
      );
    },
  });
  const [editedImagePreview, setEditedImagePreview] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!editedImage) {
      setEditedImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(editedImage);
    setEditedImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [editedImage]);

  return (
    <article className="overflow-hidden rounded-3xl border border-border-gray bg-charcoal transition-colors duration-300 hover:border-acid-lime/30">
      <div className="flex items-center gap-3 p-5 sm:p-6">
        <PostAvatar user={author} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-white">
            {authorName}
          </h3>

          <Link
            to={`/post/${post._id}`}
            className="mt-1 block truncate text-xs text-gray-400 transition hover:text-acid-lime"
          >
            @{author?.username || "nexo_member"}
            <span className="mx-2">·</span>
            {formatDate(post.createdAt)}
          </Link>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border-gray bg-input-gray/60 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-400 sm:flex">
          {post.privacy === "private" ? (
            <LuLock size={13} />
          ) : post.privacy === "followers" ? (
            <LuUsers size={13} />
          ) : (
            <LuGlobe size={13} />
          )}

          {post.privacy || "Public"}
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(post._id)}
          aria-label={saved ? "Remove bookmark" : "Save post"}
          aria-pressed={saved}
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors ${
            saved
              ? "bg-acid-lime/10 text-acid-lime"
              : "text-gray-400 hover:bg-input-gray hover:text-acid-lime"
          }`}
        >
          <LuBookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>

        {UserId === post.user?._id ? (
          <>
            {" "}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Post options"
                aria-expanded={showMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-input-gray hover:text-acid-lime"
              >
                <LuEllipsis size={21} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-11 z-30 w-40 rounded-xl border border-border-gray bg-input-gray p-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedBody(post.body ?? "");
                      setEditedImage(null);
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-white hover:bg-charcoal"
                  >
                    <LuPencil size={15} />
                    Edit Post
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      deletePostMutation();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-red-400 hover:bg-red-400/10 disabled:opacity-50"
                  >
                    <LuTrash2 size={15} />
                    {isPending ? "Deleting..." : "Delete Post"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {(post.body || post.image || post.sharedPost || isEditing) && (
        <div className="px-5 pb-5 sm:px-6">
          {isEditing ? (
            <textarea
              value={editedBody}
              onChange={(event) => setEditedBody(event.target.value)}
              placeholder="What's worth sharing today?"
              rows={3}
              maxLength={3000}
              autoFocus
              disabled={isUpdating}
              className="w-full resize-y rounded-xl border border-acid-lime/50 bg-transparent p-2 text-[15px] leading-7 text-gray-200 outline-none focus:border-acid-lime"
            />
          ) : (
            post.body && (
              <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-gray-200">
                {post.body}
              </p>
            )
          )}

          {(post.image || isEditing) && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-border-gray bg-dark-forest">
              {isEditing ? (
                <label className="group relative block cursor-pointer">
                  {editedImagePreview || post.image ? (
                    <img
                      src={editedImagePreview || post.image || ""}
                      alt="Post attachment"
                      className="max-h-[520px] w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center text-sm text-gray-400">
                      Add Photo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUpdating}
                    className="sr-only"
                    onChange={(event) => {
                      setEditedImage(event.target.files?.[0] ?? null);
                    }}
                  />
                </label>
              ) : (
                post.image && (
                  <img
                    src={post.image}
                    alt="Post attachment"
                    loading="lazy"
                    className="max-h-[520px] w-full object-contain"
                  />
                )
              )}
            </div>
          )}

          {post.sharedPost && (
            <div className="mt-5 rounded-2xl border border-border-gray bg-deep-black/60 p-4">
              <p className="mb-4 text-[10px] font-black tracking-[0.15em] text-acid-lime">
                SHARED CONVERSATION
              </p>

              <div className="flex items-center gap-3">
                <PostAvatar user={post.sharedPost.user} size="sm" />

                <div>
                  <p className="text-sm font-bold text-white">
                    {post.sharedPost.user?.name || "NEXO Member"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {post.sharedPost.createdAt
                      ? formatDate(post.sharedPost.createdAt)
                      : "Shared on NEXO"}
                  </p>
                </div>
              </div>

              {post.sharedPost.body && (
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                  {post.sharedPost.body}
                </p>
              )}

              {post.sharedPost.image && (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img
                    src={post.sharedPost.image}
                    alt="Shared post attachment"
                    loading="lazy"
                    className="max-h-80 w-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => {
                  setIsEditing(false);
                  setEditedBody(post.body ?? "");
                  setEditedImage(null);
                }}
                className="rounded-xl border border-border-gray px-4 py-2 text-xs text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isUpdating ||
                  (editedBody.trim() === (post.body ?? "").trim() &&
                    !editedImage)
                }
                onClick={() => updatePost()}
                className="rounded-xl bg-acid-lime px-4 py-2 text-xs font-black text-deep-black disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border-gray px-5 py-4 text-xs text-gray-400 sm:px-6">
        <span>{likesCount} likes</span>

        <span className="text-right">
          {post.commentsCount ?? 0} comments
          <span className="mx-2">·</span>
          {post.sharesCount ?? 0} shares
        </span>
      </div>

      <div className="grid grid-cols-3 border-t border-border-gray">
        <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-gray-400">
          <LuHeart size={19} />
          Like
        </div>

        <button
          type="button"
          onClick={() => setShowCommentInput((previous) => !previous)}
          aria-expanded={showCommentInput}
          className={`flex cursor-pointer items-center justify-center gap-2 py-4 text-xs font-semibold transition ${
            showCommentInput
              ? "bg-acid-lime/10 text-acid-lime"
              : "text-gray-400 hover:bg-input-gray hover:text-acid-lime"
          }`}
        >
          <LuMessageCircle size={19} />
          Comment
        </button>

        <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-gray-400">
          <LuRepeat2 size={19} />
          Share
        </div>
      </div>

      {allComments ? (
        <div className="mx-5 mb-5 border-t border-border-gray pt-5 sm:mx-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[16px]  tracking-[0.18em] text-acid-lime">
              Comments
            </h3>

            <span className="text-xs text-gray-400">
              {post.commentsCount ?? allComments.length} Comments
            </span>
          </div>

          {allComments.length > 0 ? (
            <div className="space-y-4">
              {allComments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">
              No comments yet.
            </p>
          )}
        </div>
      ) : (
        post.topComment && <TopCommensts topComment={post.topComment} />
      )}
      {showCommentInput && (
        <div className="border-t border-border-gray p-4 sm:p-5">
          <CreateComment postId={post._id} autoFocus />
        </div>
      )}
    </article>
  );
}
