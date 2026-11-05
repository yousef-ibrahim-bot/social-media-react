import axios from "axios";
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {  useQuery  } from "@tanstack/react-query";
import { CreatedAuthenticationContext } from "../../Context/authContext";
import PostCard from "../../components/PostCard/PostCard";
import LoadingPosts from "../../components/Loading/LoadingPost";
import type { PostType, CommentType } from "../Home/home.types";
import { LuArrowLeft } from "react-icons/lu";
export default function SinglePost() {
  const auth = useContext(CreatedAuthenticationContext);
  const Token = auth?.Token;

  const { id } = useParams<{ id: string }>();

  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = useQuery<PostType>({
    queryKey: ["singlePost", id],
    enabled: Boolean(id && Token),

    queryFn: async ({ signal }) => {
      const { data } = await axios.get(
        `${"https://route-posts.routemisr.com"}/posts/${id}`,
        {
          headers: { token: Token },
          signal,
        },
      );

      const result = data?.data?.post as PostType | undefined;

      if (!result) {
        throw new Error("Post not found.");
      }

      return result;
    },
  });

  const {
    data: allComments = [],
  } = useQuery<CommentType[]>({
    queryKey: ["comments", id],
    enabled: Boolean(id && Token),

    queryFn: async ({ signal }) => {
      const { data } = await axios.get(
        `${"https://route-posts.routemisr.com"}/posts/${id}/comments`,
        {
          headers: { token: Token },
          signal,
          params: {
            page: 1,
            limit: 50,
          },
        },
      );

      const comments = data?.data?.comments;

      if (!Array.isArray(comments)) {
        throw new Error("Unexpected comments response.");
      }

      return comments as CommentType[];
    },
  });

  return (
    <main className="min-h-screen bg-deep-black px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-acid-lime"
        >
          <LuArrowLeft size={18} />
          Back to Feed
        </Link>
        {postLoading && <LoadingPosts loadMsg="" />}
        {post && !postError && (
          <>
            <PostCard
              post={post}
              saved={Boolean(post.bookmarked)}
              onToggleSave={() => {}}
              allComments={allComments}
            />

          </>
        )}
      </div>
    </main>
  );
}
