import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuUserRound, LuPencil, LuMessageCircle, LuSend } from "react-icons/lu";

import { CreatedAuthenticationContext } from "../../Context/authContext";
import type {
  CommentCardProps,
  CommentType,
  User,
} from "../../pages/Home/home.types";

function CommentAvatar({ user }: { user?: User | null }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-acid-lime/30 bg-input-gray">
      {user?.photo && !failed ? (
        <img
          key={user.photo}
          src={user.photo}
          alt={user.name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <LuUserRound size={20} className="text-acid-lime" />
      )}
    </div>
  );
}

export default function CommentCard({
  comment,
  postId,
  showDate = true,
}: CommentCardProps) {
  const { Token, UserId } = useContext(CreatedAuthenticationContext)!;
  const queryClient = useQueryClient();

  const author =
    comment.commentCreator ?? comment.commentCreater ?? comment.user ?? null;

  const content = comment.content ?? comment.text ?? "";
  const isOwner = Boolean(UserId && UserId === author?._id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setCurrentContent(content);

    if (!isEditing) {
      setEditedText(content);
    }
  }, [content]);

  const {
    data: replies = [],
    isPending: repliesLoading,
    isError: repliesError,
  } = useQuery<CommentType[]>({
    queryKey: ["replies", postId, comment._id],

    queryFn: async () => {
      const { data } = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
        {
          headers: {
            token: Token,
          },
        },
      );

      const result = data.data;

      if (Array.isArray(result)) {
        return result;
      }

      if (Array.isArray(result?.replies)) {
        return result.replies;
      }

      return [];
    },

    enabled: Boolean(Token && postId && comment._id),
  });

  function editComment() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      {
        content: editedText.trim(),
      },
      {
        headers: {
          token: Token,
        },
      },
    );
  }

  const {
    mutate: updateComment,
    isPending: isUpdating,
    error: editError,
  } = useMutation({
    mutationFn: editComment,

    onSuccess: () => {
      setCurrentContent(editedText.trim());
      setIsEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["singlePost", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  function replyToComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
      {
        content: replyText.trim(),
      },
      {
        headers: {
          token: Token,
        },
      },
    );
  }

  const {
    mutate: sendReply,
    isPending: isReplying,
    error: replyError,
  } = useMutation({
    mutationFn: replyToComment,

    onSuccess: () => {
      setReplyText("");
      setShowReply(false);

      queryClient.invalidateQueries({
        queryKey: ["replies", postId, comment._id],
      });

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["singlePost", postId],
      });
    },
  });

  return (
    <article className="flex items-start gap-3">
      <CommentAvatar user={author} />

      <div className="min-w-0 flex-1 rounded-2xl border border-border-gray bg-input-gray p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-white">
            {author?.name || "NEXO Member"}
          </p>

          {showDate && comment.createdAt && (
            <span className="text-[11px] text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {isEditing ? (
          <>
            <textarea
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
              rows={2}
              maxLength={2000}
              autoFocus
              disabled={isUpdating}
              className="mt-2 w-full resize-y rounded-xl border border-border-gray bg-charcoal p-3 text-sm text-white outline-none focus:border-acid-lime"
            />

            <div className="mt-3 flex justify-end gap-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(currentContent);
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isUpdating ||
                  !Token ||
                  !editedText.trim() ||
                  editedText.trim() === currentContent.trim()
                }
                onClick={() => updateComment()}
                className="rounded-lg bg-acid-lime px-4 py-2 text-xs font-bold text-deep-black disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
            {currentContent}
          </p>
        )}

        {!isEditing && (
          <div className="mt-3 flex items-center gap-4">
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setEditedText(currentContent);
                  setIsEditing(true);
                  setShowReply(false);
                }}
                className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-acid-lime"
              >
                <LuPencil size={13} />
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowReply((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-acid-lime"
            >
              <LuMessageCircle size={13} />
              Reply
            </button>
          </div>
        )}

        {showReply && !isEditing && (
          <div className="mt-3">
            <textarea
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Write a reply..."
              rows={2}
              maxLength={2000}
              disabled={isReplying}
              className="w-full rounded-xl border border-border-gray bg-charcoal p-3 text-sm text-white outline-none focus:border-acid-lime"
            />

            <div className="mt-3 flex justify-end gap-3">
              <button
                type="button"
                disabled={isReplying}
                onClick={() => {
                  setShowReply(false);
                  setReplyText("");
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!replyText.trim() || isReplying || !Token}
                onClick={() => sendReply()}
                className="flex items-center gap-2 rounded-lg bg-acid-lime px-4 py-2 text-xs font-bold text-deep-black disabled:opacity-50"
              >
                <LuSend size={14} />
                {isReplying ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        )}

        {(editError || replyError) && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {axios.isAxiosError(editError || replyError)
              ? (editError || replyError) instanceof Error
                ? "Request failed. Please try again."
                : "Request failed."
              : "Request failed."}
          </p>
        )}

        {repliesLoading && Token && (
          <p className="mt-4 text-xs text-gray-400">Loading replies...</p>
        )}

        {repliesError && (
          <p className="mt-4 text-xs text-red-400">Failed to load replies.</p>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-3 border-l-2 border-border-gray pl-4">
            {replies.map((reply) => {
              const replyAuthor =
                reply.commentCreator ??
                reply.commentCreater ??
                reply.user ??
                null;

              return (
                <div key={reply._id} className="flex items-start gap-2">
                  <CommentAvatar user={replyAuthor} />

                  <div className="min-w-0 flex-1 rounded-xl bg-charcoal p-3">
                    <p className="text-xs font-bold text-white">
                      {replyAuthor?.name || "NEXO Member"}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
                      {reply.content ?? reply.text ?? ""}
                    </p>

                    {showDate && reply.createdAt && (
                      <span className="mt-2 block text-[10px] text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
