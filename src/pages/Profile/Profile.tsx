import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  LuCamera,
  LuPencil,
  LuUsers,
  LuMail,
  LuFileText,
  LuBookmark,
  LuImage,
  LuLock,
  LuGlobe,
  LuUserRound,
  LuX,
  LuCheck,
  LuHeart,
  LuSend,
} from "react-icons/lu";

type Privacy = "public" | "followers" | "private";
type Tab = "posts" | "saved";

type ProfileUser = {
  name: string;
  username: string;
  email?: string;
  avatar?: string | null;
  cover?: string | null;
  bio?: string;
  followers: number;
  following: number;
};

type ProfilePost = {
  id: string;
  text: string;
  image?: string;
  privacy: Privacy;
  createdAt: string;
  saved: boolean;
  kind: "cover" | "post";
};

type ProfileProps = {
  initialUser?: ProfileUser;
  initialPosts?: ProfilePost[];
  onSaveCover?: (file: File, privacy: Privacy) => Promise<void>;
  onSaveAvatar?: (file: File) => Promise<void>;
  onSaveProfile?: (details: Pick<ProfileUser, "name" | "bio">) => Promise<void>;
};

const demoUser: ProfileUser = {
  name: "NEXO Member",
  username: "nexo_member",
  email: "member@example.com",
  avatar: null,
  cover: null,
  bio: "Sharing ideas, making connections, and going beyond the feed.",
  followers: 0,
  following: 2,
};

const privacyOptions: {
  value: Privacy;
  label: string;
  description: string;
  Icon: typeof LuGlobe;
}[] = [
  {
    value: "public",
    label: "Public",
    description: "Everyone can see this update",
    Icon: LuGlobe,
  },
  {
    value: "followers",
    label: "Followers",
    description: "Visible to your followers",
    Icon: LuUsers,
  },
  {
    value: "private",
    label: "Only Me",
    description: "Private to your account",
    Icon: LuLock,
  },
];

function getInitials(name: string) {
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

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Cannot read image"));
    reader.readAsDataURL(file);
  });
}

function ProfileAvatar({
  name,
  src,
  size = "large",
}: {
  name: string;
  src?: string | null;
  size?: "large" | "small";
}) {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-acid-lime bg-input-gray shadow-[0_0_28px_rgba(200,255,97,0.1)] ${
        size === "large" ? "h-24 w-24 sm:h-32 sm:w-32" : "h-11 w-11"
      }`}
    >
      {src && brokenSrc !== src ? (
        <img
          src={src}
          alt={`${name} avatar`}
          onError={() => setBrokenSrc(src)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={`font-black text-acid-lime ${
            size === "large" ? "text-3xl" : "text-xs"
          }`}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-2xl border border-border-gray bg-input-gray/50 px-2 py-4 sm:py-6">
      <p className="text-center text-[9px] font-bold tracking-wide text-gray-400 sm:text-xs">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default function Profile({
  initialUser = demoUser,
  initialPosts = [],
  onSaveCover,
  onSaveAvatar,
  onSaveProfile,
}: ProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [posts, setPosts] = useState(initialPosts);
  const [tab, setTab] = useState<Tab>("posts");

  const [coverDialog, setCoverDialog] = useState(false);
  const [pendingCover, setPendingCover] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [privacy, setPrivacy] = useState<Privacy>("public");

  const [editOpen, setEditOpen] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio || "");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const coverInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  const myPosts = posts;
  const savedPosts = posts.filter((post) => post.saved);
  const visiblePosts = tab === "posts" ? myPosts : savedPosts;

  async function handleCoverSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    try {
      const preview = await readImage(file);
      setPendingCover({ file, preview });
      setPrivacy("public");
      setError("");
      setCoverDialog(true);
    } catch {
      setError("Unable to read the selected image.");
    }
  }

  async function saveCover() {
    if (!pendingCover || busy) return;

    setBusy(true);
    setError("");

    try {
      if (onSaveCover) {
        await onSaveCover(pendingCover.file, privacy);
      }

      setUser((previous) => ({
        ...previous,
        cover: pendingCover.preview,
      }));

      const newPost: ProfilePost = {
        id: crypto.randomUUID(),
        text: "Updated their cover photo.",
        image: pendingCover.preview,
        privacy,
        createdAt: new Date().toISOString(),
        saved: false,
        kind: "cover",
      };

      setPosts((previous) => [newPost, ...previous]);
      setTab("posts");
      setPendingCover(null);
      setCoverDialog(false);
    } catch {
      setError("Cover update failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAvatarSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const preview = await readImage(file);

      if (onSaveAvatar) {
        await onSaveAvatar(file);
      }

      setUser((previous) => ({
        ...previous,
        avatar: preview,
      }));
    } catch {
      setError("Profile photo update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEditSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = editedName.trim();

    if (!name) {
      setError("Your name cannot be empty.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      if (onSaveProfile) {
        await onSaveProfile({ name, bio: editedBio.trim() });
      }

      setUser((previous) => ({
        ...previous,
        name,
        bio: editedBio.trim(),
      }));
      setEditOpen(false);
    } catch {
      setError("Profile update failed.");
    } finally {
      setBusy(false);
    }
  }

  function toggleSaved(id: string) {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === id ? { ...post, saved: !post.saved } : post,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-deep-black px-3 py-6 text-white sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <input
          ref={coverInput}
          type="file"
          accept="image/*"
          onChange={handleCoverSelect}
          className="hidden"
          aria-label="Select cover image"
        />

        <input
          ref={avatarInput}
          type="file"
          accept="image/*"
          onChange={handleAvatarSelect}
          className="hidden"
          aria-label="Select profile photo"
        />

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <section className="relative">
          <div className="relative h-48 overflow-hidden rounded-t-3xl border border-border-gray bg-dark-forest sm:h-64 lg:h-72">
            {user.cover && (
              <img
                src={user.cover}
                alt="Profile cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-deep-black/85 via-dark-forest/50 to-deep-black/30" />

            {!user.cover && (
              <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(#C8FF61 1px, transparent 1px),
                    linear-gradient(90deg, #C8FF61 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              />
            )}

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-9">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-black tracking-[0.2em] text-acid-lime sm:text-xs">
                  NEXO / PROFILE
                </span>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => coverInput.current?.click()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-deep-black/75 px-3 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:border-acid-lime hover:text-acid-lime disabled:opacity-50 sm:px-4"
                >
                  <LuCamera size={17} />
                  Change Cover
                </button>
              </div>

              {!user.cover && (
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-acid-lime">
                    YOUR SPACE. YOUR VOICE.
                  </p>

                  <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                    BEYOND THE <span className="text-acid-lime">FEED.</span>
                  </h2>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 mx-2 -mt-8 rounded-3xl border border-border-gray bg-charcoal p-4 shadow-2xl sm:mx-6 sm:-mt-12 sm:p-8 lg:mx-10">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <ProfileAvatar name={user.name} src={user.avatar} />

                  <button
                    type="button"
                    title="Change profile photo"
                    aria-label="Change profile photo"
                    disabled={busy}
                    onClick={() => avatarInput.current?.click()}
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-charcoal bg-acid-lime text-deep-black shadow-lg disabled:opacity-50"
                  >
                    <LuCamera size={17} />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-2xl font-black sm:text-3xl">
                    {user.name}
                  </h1>

                  <p className="mt-1 truncate text-sm text-gray-400">
                    @{user.username}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-acid-lime/30 bg-acid-lime/10 px-3 py-1 text-xs font-semibold text-acid-lime">
                    <LuUsers size={14} />
                    NEXO MEMBER
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <StatCard label="FOLLOWERS" value={user.followers} />
                <StatCard label="FOLLOWING" value={user.following} />
                <StatCard label="BOOKMARKS" value={savedPosts.length} />
              </div>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <section className="rounded-2xl border border-border-gray bg-dark-forest p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">About</h2>

                  <button
                    type="button"
                    aria-label="Edit profile"
                    onClick={() => {
                      setEditedName(user.name);
                      setEditedBio(user.bio || "");
                      setError("");
                      setEditOpen(true);
                    }}
                    className="cursor-pointer rounded-lg p-2 text-acid-lime transition hover:bg-acid-lime/10"
                  >
                    <LuPencil size={19} />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-gray-300">
                  {user.bio || "No bio added yet."}
                </p>

                <div className="mt-5 space-y-3">
                  {user.email && (
                    <div className="flex min-w-0 items-center gap-3 text-sm text-gray-400">
                      <LuMail className="shrink-0 text-acid-lime" size={18} />
                      <span className="break-all">{user.email}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <LuUsers className="text-acid-lime" size={18} />
                    Active on NEXO
                  </div>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => setTab("posts")}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-border-gray bg-input-gray/40 p-5 text-left transition hover:border-acid-lime/50"
                >
                  <div>
                    <p className="text-xs font-bold tracking-wider text-acid-lime">
                      MY POSTS
                    </p>
                    <p className="mt-2 text-3xl font-black">{posts.length}</p>
                  </div>
                  <LuFileText className="text-acid-lime" size={25} />
                </button>

                <button
                  type="button"
                  onClick={() => setTab("saved")}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-border-gray bg-input-gray/40 p-5 text-left transition hover:border-acid-lime/50"
                >
                  <div>
                    <p className="text-xs font-bold tracking-wider text-acid-lime">
                      SAVED POSTS
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {savedPosts.length}
                    </p>
                  </div>
                  <LuBookmark className="text-acid-lime" size={25} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border-gray bg-charcoal p-4 sm:p-7">
          <div className="flex items-center gap-2 border-b border-border-gray pb-4">
            <button
              type="button"
              onClick={() => setTab("posts")}
              className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition ${
                tab === "posts"
                  ? "bg-acid-lime text-deep-black"
                  : "text-gray-400 hover:bg-input-gray hover:text-white"
              }`}
            >
              My Posts ({posts.length})
            </button>

            <button
              type="button"
              onClick={() => setTab("saved")}
              className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition ${
                tab === "saved"
                  ? "bg-acid-lime text-deep-black"
                  : "text-gray-400 hover:bg-input-gray hover:text-white"
              }`}
            >
              Saved ({savedPosts.length})
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {visiblePosts.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border-gray bg-dark-forest p-6 text-center">
                {tab === "posts" ? (
                  <LuFileText size={30} className="text-acid-lime" />
                ) : (
                  <LuBookmark size={30} className="text-acid-lime" />
                )}

                <h3 className="mt-4 font-bold">
                  {tab === "posts" ? "No posts yet." : "Nothing saved yet."}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {tab === "posts"
                    ? "Your NEXO updates will appear here."
                    : "Bookmark posts to revisit them later."}
                </p>
              </div>
            ) : (
              visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-border-gray bg-dark-forest"
                >
                  <div className="flex items-center gap-3 p-4 sm:p-5">
                    <ProfileAvatar
                      name={user.name}
                      src={user.avatar}
                      size="small"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold">
                        {user.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                        <span>·</span>
                        {post.privacy === "public"
                          ? "Public"
                          : post.privacy === "followers"
                            ? "Followers"
                            : "Only Me"}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={
                        post.saved ? "Remove saved post" : "Save post"
                      }
                      onClick={() => toggleSaved(post.id)}
                      className={`cursor-pointer rounded-xl p-2 transition ${
                        post.saved
                          ? "bg-acid-lime/10 text-acid-lime"
                          : "text-gray-400 hover:text-acid-lime"
                      }`}
                    >
                      <LuBookmark size={20} />
                    </button>
                  </div>

                  <p className="px-5 pb-4 text-sm text-gray-200">{post.text}</p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt={
                        post.kind === "cover"
                          ? "Updated cover image"
                          : "Post attachment"
                      }
                      className="max-h-[420px] w-full object-cover"
                    />
                  )}

                  <div className="flex items-center gap-5 border-t border-border-gray px-5 py-4 text-xs text-gray-400">
                    <span className="flex items-center gap-2">
                      <LuHeart size={17} />
                      Like
                    </span>

                    <span className="flex items-center gap-2">
                      <LuSend size={17} />
                      Share
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {coverDialog && pendingCover && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cover-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-gray bg-charcoal p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-acid-lime">
                  NEXO / PROFILE
                </p>

                <h2 id="cover-modal-title" className="mt-2 text-xl font-black">
                  Cover Post Privacy
                </h2>
              </div>

              <button
                type="button"
                disabled={busy}
                aria-label="Close dialog"
                onClick={() => setCoverDialog(false)}
                className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-input-gray hover:text-white"
              >
                <LuX size={21} />
              </button>
            </div>

            <img
              src={pendingCover.preview}
              alt="New cover preview"
              className="mt-5 h-40 w-full rounded-xl object-cover"
            />

            <p className="mt-5 text-sm text-gray-400">
              Who can see your cover update?
            </p>

            <div className="mt-4 space-y-2">
              {privacyOptions.map(({ value, label, description, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPrivacy(value)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition ${
                    privacy === value
                      ? "border-acid-lime bg-acid-lime/10"
                      : "border-border-gray bg-input-gray/40 hover:border-gray-500"
                  }`}
                >
                  <Icon
                    size={21}
                    className={
                      privacy === value ? "text-acid-lime" : "text-gray-400"
                    }
                  />

                  <div className="flex-1">
                    <p className="text-sm font-bold">{label}</p>
                    <p className="mt-1 text-xs text-gray-400">{description}</p>
                  </div>

                  {privacy === value && (
                    <LuCheck className="text-acid-lime" size={20} />
                  )}
                </button>
              ))}
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setCoverDialog(false)}
                className="cursor-pointer rounded-xl border border-border-gray px-5 py-3 text-sm font-bold hover:bg-input-gray"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={saveCover}
                className="cursor-pointer rounded-xl bg-acid-lime px-5 py-3 text-sm font-black text-deep-black disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Cover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleEditSave}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="w-full max-w-md rounded-3xl border border-border-gray bg-charcoal p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="edit-profile-title" className="text-xl font-black">
                Edit Profile
              </h2>

              <button
                type="button"
                disabled={busy}
                aria-label="Close dialog"
                onClick={() => setEditOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <LuX size={21} />
              </button>
            </div>

            <label className="mt-6 block text-sm font-semibold">
              Display Name
              <input
                value={editedName}
                onChange={(event) => setEditedName(event.target.value)}
                maxLength={60}
                className="mt-2 w-full rounded-xl border border-border-gray bg-input-gray px-4 py-3 text-white outline-none focus:border-acid-lime"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold">
              Bio
              <textarea
                value={editedBio}
                onChange={(event) => setEditedBio(event.target.value)}
                rows={4}
                maxLength={250}
                className="mt-2 w-full resize-none rounded-xl border border-border-gray bg-input-gray px-4 py-3 text-white outline-none focus:border-acid-lime"
              />
            </label>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full cursor-pointer rounded-xl bg-acid-lime py-3 font-black text-deep-black disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
