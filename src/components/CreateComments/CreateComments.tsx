import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuSend, LuMessageCircle } from "react-icons/lu";
import { CreatedAuthenticationContext } from "../../Context/authContext";

interface CreateCommentProps {
  postId: string;
  autoFocus?: boolean;
}

export default function CreateComment({
  postId,
  autoFocus = false,
}: CreateCommentProps) {
  const auth = useContext(CreatedAuthenticationContext);
  const Token = auth?.Token;

  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;

    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [autoFocus]);

  const {
    mutate: createComment,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (content: string) => {
      if (!Token || !postId) {
        throw new Error("You must be logged in.");
      }

      const { data } = await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        {
          content,
        },
        {
          headers: {
            token: Token,
          },
        },
      );

      return data;
    },

onSuccess: async () => {
  setCommentText("");

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    }),

    queryClient.invalidateQueries({
      queryKey: ["singlePost", postId],
    }),

    queryClient.invalidateQueries({
      queryKey: ["posts", Token],
    }),
  ]);
},
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = commentText.trim();

    if (!content || isPending) return;

    createComment(content);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border-gray bg-charcoal p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-acid-lime/10 text-acid-lime">
          <LuMessageCircle size={20} />
        </div>

        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-acid-lime">
            NEXO / COMMENT
          </p>

          <h3 className="mt-1 text-sm font-bold text-white">
            Join the conversation.
          </h3>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder="Write a comment..."
        rows={3}
        maxLength={2000}
        disabled={isPending}
        className="w-full resize-y rounded-2xl border border-border-gray bg-input-gray p-4 text-sm leading-6 text-white outline-none transition focus:border-acid-lime placeholder:text-gray-500 disabled:opacity-60"
      />

      {isError && (
        <p role="alert" className="mt-3 text-xs text-red-400">
          {axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to publish comment."
            : error instanceof Error
              ? error.message
              : "Failed to publish comment."}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={!commentText.trim() || isPending || !Token}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-acid-lime px-5 py-3 text-xs font-black text-deep-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "PUBLISHING..." : "POST COMMENT"}

          <LuSend size={17} />
        </button>
      </div>
    </form>
  );
}
