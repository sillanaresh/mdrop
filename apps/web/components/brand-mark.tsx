interface BrandMarkProps {
  className?: string
  size?: number
}

export function BrandMark({ className, size = 36 }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="var(--color-accent)" height="64" rx="18" width="64" />
      <path
        d="M32 11.5C24.1 19.35 17.5 27.84 17.5 37.03C17.5 46.03 23.92 53.5 32 53.5C40.08 53.5 46.5 46.03 46.5 37.03C46.5 27.84 39.9 19.35 32 11.5Z"
        fill="var(--color-surface)"
      />
      <path
        d="M22.5 43.5V29.6C22.5 28.95 22.98 28.5 23.58 28.5H26.72C27.14 28.5 27.5 28.73 27.69 29.08L32 36.9L36.31 29.08C36.5 28.73 36.86 28.5 37.28 28.5H40.42C41.02 28.5 41.5 28.95 41.5 29.6V43.5H37.36V35.38L33.95 41.36H30.05L26.64 35.38V43.5H22.5Z"
        fill="var(--color-accent)"
      />
      <path
        d="M20.5 21.75H43.5"
        stroke="var(--color-accent-soft)"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}
