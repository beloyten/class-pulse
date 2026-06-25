function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse ${className ?? ''}`}
      style={{ backgroundColor: 'var(--color-border)', ...style }}
    />
  )
}

export default function ClassDetailLoading() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <Bone className="w-8 h-8 rounded-lg" />
          <Bone className="h-5 w-32 rounded-full" />
        </div>
        <Bone className="w-8 h-8 rounded-lg" />
      </div>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Progress card */}
        <div
          className="rounded-2xl border p-4 mb-4 flex items-center justify-between animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex flex-col gap-2">
            <Bone className="h-4 w-36 rounded-full" />
            <Bone className="h-3 w-24 rounded-full" />
            <Bone className="h-1.5 w-40 rounded-full mt-1" />
          </div>
          <Bone className="h-9 w-32 rounded-xl" />
        </div>

        {/* Student rows */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border p-3 flex items-center gap-3 animate-pulse"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <Bone className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Bone className="h-4 rounded-full" style={{ width: `${60 + (i % 3) * 15}%` }} />
                <Bone className="h-3 rounded-full" style={{ width: `${35 + (i % 4) * 10}%` }} />
              </div>
              <Bone className="w-8 h-8 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
