import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  LuSparkles,
  LuImage,
  LuGlobe,
  LuUsers,
  LuLock,
  LuSend,
  LuX,
} from "react-icons/lu";
import { CreatedAuthenticationContext } from "../../Context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type Privacy = "public" | "followers" | "private";

type CreatePostProps = {
  onCreatePost: (
    body: string | null,
    privacy: Privacy,
    image: File | null,
  ) => Promise<void>;
};

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const { Token } = useContext(CreatedAuthenticationContext)!;
  const [body, setBody] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("public");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setImage(file);
    setError("");
  }

  function removeImage() {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => {
      return axios.post("https://route-posts.routemisr.com/posts", formData, {
        headers: {
          token: Token,
        },
      });
    },

    onSuccess: () => {
      setBody("");
      setPrivacy("public");
      removeImage();
      setError("");

      queryClient.invalidateQueries({
        queryKey: ["posts", Token],
      });
    },

    onError: (error) => {
      setError(
        error ? error.message : "Unable to publish post.",
      );
    },
  });
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!body.trim() && !image) {
      setError("Write something or select an image.");
      return;
    }

    const formData = new FormData();

    if (body.trim()) {
      formData.append("body", body.trim());
    }

    formData.append("privacy", privacy);

    if (image) {
      formData.append("image", image);
    }

    setError("");

    mutate(formData);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border-gray bg-charcoal p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-acid-lime">
            NEXO / CREATE
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Start a conversation.
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Share a thought. Spark something new.
          </p>
        </div>

        <LuSparkles size={25} className="shrink-0 text-acid-lime" />
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        maxLength={3000}
        placeholder="What's worth sharing today?"
        className="mt-5 w-full resize-y rounded-2xl border border-border-gray bg-input-gray/60 p-4 text-sm leading-7 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-acid-lime"
      />

      {preview && (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-border-gray bg-dark-forest">
          <img
            src={preview}
            alt="Selected post image"
            className="max-h-80 w-full object-contain"
          />

          <button
            type="button"
            aria-label="Remove image"
            onClick={removeImage}
            disabled={submitting}
            className="absolute right-3 top-3 rounded-full bg-deep-black/90 p-2 text-white hover:text-red-400"
          >
            <LuX size={19} />
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-gray pt-4">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={submitting}
            className="hidden"
            aria-label="Select post image"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            aria-label="Add image"
            title="Add image"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-acid-lime transition hover:bg-acid-lime/10 disabled:opacity-50"
          >
            <LuImage size={21} />
          </button>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-acid-lime">
              {privacy === "public" ? (
                <LuGlobe size={17} />
              ) : privacy === "followers" ? (
                <LuUsers size={17} />
              ) : (
                <LuLock size={17} />
              )}
            </span>

            <select
              value={privacy}
              disabled={submitting}
              onChange={(event) => setPrivacy(event.target.value as Privacy)}
              aria-label="Post privacy"
              className="h-11 cursor-pointer rounded-xl border border-border-gray bg-input-gray py-2 pl-10 pr-3 text-xs font-semibold text-white outline-none focus:border-acid-lime"
            >
              <option value="public">Public</option>
              <option value="followers">Followers</option>
              <option value="private">Only Me</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || (!body.trim() && !image)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-acid-lime px-5 py-3 text-xs font-black text-deep-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "PUBLISHING..." : "PUBLISH POST"}
          <LuSend size={18} />
        </button>
      </div>
    </form>
  );
}
