import { useState } from "react";
import type { FormEvent } from "react";
import { LuKeyRound, LuEye, LuEyeOff } from "react-icons/lu";

type SettingsProps = {
  onUpdatePassword?: (data: {
    password: string;
    newPassword: string;
    rePassword: string;
  }) => Promise<void>;
};

export default function Settings({ onUpdatePassword }: SettingsProps) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !newPassword || !rePassword) {
      setError("All fields are required.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError("New password does not meet the requirements.");
      return;
    }

    if (newPassword !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password === newPassword) {
      setError("New password must be different.");
      return;
    }

    if (!onUpdatePassword) {
      setError("Password update API is not connected yet.");
      return;
    }

    setIsPending(true);

    try {
      await onUpdatePassword({
        password,
        newPassword,
        rePassword,
      });

      setPassword("");
      setNewPassword("");
      setRePassword("");
      setSuccess("Password updated successfully!");
    } catch (error) {
      setError(error ? error.message : "Unable to update password.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-deep-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-[10px] font-black tracking-[0.2em] text-acid-lime">
            NEXO / ACCOUNT
          </p>

          <h1 className="mt-2 text-3xl font-black">Settings.</h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage your account security.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border-gray bg-charcoal p-5 sm:p-8"
        >
          {/* HEADER */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-acid-lime/10 text-acid-lime">
              <LuKeyRound size={25} />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">Change Password</h2>

              <p className="mt-1 text-sm text-gray-400">
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                Current password
              </label>

              <input
                id="currentPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-border-gray bg-input-gray p-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-acid-lime"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-border-gray bg-input-gray p-4 pr-12 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-acid-lime"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-acid-lime"
                >
                  {showPassword ? <LuEyeOff size={19} /> : <LuEye size={19} />}
                </button>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                At least 8 characters with uppercase, lowercase, number, and
                special character.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-200"
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={rePassword}
                onChange={(event) => setRePassword(event.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-border-gray bg-input-gray p-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-acid-lime"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-acid-lime">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-acid-lime px-5 py-3 text-sm font-black text-deep-black transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
