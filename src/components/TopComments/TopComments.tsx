
import { LuUserRound } from "react-icons/lu";
import type { TopComment } from "../../pages/Home/home.types";

interface TopCommenstsProps {
  topComment: TopComment;
}

export default function TopComments({
  topComment,
}: TopCommenstsProps) {
  const commentAuthor =
    topComment.commentCreator ??
    topComment.commentCreater ??
    null;

  return (
    <div className="mx-5 mb-5 border-t border-border-gray pt-4 sm:mx-6">
      <p className="mb-4 text-[10px] font-black tracking-[0.18em] text-acid-lime">
        ✳ TOP COMMENT
      </p>

      <div className="flex items-start gap-3">
        {commentAuthor?.photo ? (
          <img
            src={commentAuthor.photo}
            alt={commentAuthor.name}
            className="h-10 w-10 shrink-0 rounded-full border border-acid-lime/40 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-input-gray">
            <LuUserRound
              size={20}
              className="text-acid-lime"
            />
          </div>
        )}

        <div className="min-w-0 flex-1 rounded-2xl bg-input-gray p-4">
          <p className="text-sm font-bold text-white">
            {commentAuthor?.name || "NEXO Member"}
          </p>

          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-300">
            {topComment.content ?? topComment.text ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}
