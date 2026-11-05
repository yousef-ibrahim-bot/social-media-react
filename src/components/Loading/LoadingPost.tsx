type LoadingProps = {
  loadMsg: string;
};

export default function LoadingPosts({ loadMsg }: LoadingProps) {
  return (
    <div role="status" className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-border-gray bg-charcoal p-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-input-gray" />

            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-input-gray" />
              <div className="h-2 w-20 rounded bg-input-gray" />
            </div>
          </div>

          <div className="mt-6 h-3 w-4/5 rounded bg-input-gray" />
          <div className="mt-3 h-3 w-2/3 rounded bg-input-gray" />
          <div className="mt-5 h-44 rounded-2xl bg-input-gray" />
        </div>
      ))}

      <span className="sr-only">{loadMsg}</span>
    </div>
  );
}