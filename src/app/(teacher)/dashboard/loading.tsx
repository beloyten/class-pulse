function SkeletonPulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-full ${className ?? ''}`}
      style={{ backgroundColor: 'var(--color-border)', ...style }}
    />
  )
}

export default function DashboardLoading() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <SkeletonPulse className="h-5 w-24" />
        <SkeletonPulse className="h-5 w-16" />
      </div>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <SkeletonPulse className="h-6 w-28 mb-5" style={{ borderRadius: 8 }} />

        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-2xl border p-4"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <SkeletonPulse className="h-4 w-36" style={{ borderRadius: 6 }} />
                  <SkeletonPulse className="h-3 w-24" style={{ borderRadius: 6 }} />
                  <SkeletonPulse className="h-3 w-20" style={{ borderRadius: 6 }} />
                </div>
                <SkeletonPulse className="h-5 w-20" style={{ borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
