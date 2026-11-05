import { LuSparkles } from "react-icons/lu";

type EmptyStateProps = {
  view: "latest" | "popular" | "saved";
};

export default function EmptyState({ view }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border-gray bg-charcoal p-10 text-center">
      <LuSparkles
        size={32}
        className="mx-auto text-acid-lime"
      />

      <h3 className="mt-5 text-xl font-black text-white">
        NOTHING HERE. YET.
      </h3>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-400">
        {view === "saved"
          ? "Save a post to build your collection."
          : "New conversations will appear here when posts are available."}
      </p>
    </div>
  );
}