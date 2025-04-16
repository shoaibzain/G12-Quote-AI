import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "small" | "medium" | "large"
  href?: string
}

export function Logo({ className = "", size = "medium", href }: LogoProps) {
  // Define sizes for different variants
  const sizes = {
    small: { width: 120, height: 36 },
    medium: { width: 180, height: 54 },
    large: { width: 240, height: 72 },
  }

  const { width, height } = sizes[size]

  const logoContent = (
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/G12-Final-Logo-Update-01-n3t164mVWAhMt7G5l29RAElHc0LZsA.png"
      alt="G12 Logo"
      width={width}
      height={height}
      priority
    />
  )

  return (
    <div className={`flex items-center ${className}`}>
      {href ? (
        <Link href={href} className="hover:opacity-80 transition-opacity">
          {logoContent}
        </Link>
      ) : (
        logoContent
      )}
    </div>
  )
}
