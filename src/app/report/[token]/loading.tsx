function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse ${className ?? ''}`}
      style={{ backgroundColor: 'var(--color-border)', ...style }}
    />
  )
}

export default function ReportLoading() {
  return (
    <div className="min-h-dvh px-4 py-8" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="max-w-sm mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <Bone className="h-3 w-20 rounded-full" />
          <Bone className="w-20 h-20 rounded-full" />
          <Bone className="h-7 w-40 rounded-full" />
          <Bone className="h-4 w-32 rounded-full" />
        </div>

        {/* 7-day grid */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <Bone className="h-3 w-24 rounded-full mb-3" />
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <Bone className="w-full rounded-xl animate-pulse" style={{ aspectRatio: '1' }} />
                <Bone className="h-2 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <Bone className="h-3 w-20 rounded-full mb-3" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <Bone className="w-8 h-8 rounded-full" />
                <Bone className="h-5 w-6 rounded" />
                <Bone className="h-3 w-10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Warm message */}
        <Bone className="rounded-2xl h-20" />
      </div>
    </div>
  )
}
