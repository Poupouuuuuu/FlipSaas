import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <Image
      src="/icon-192.png"
      alt="Stockeesy"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
    />
  )
}

export function LogoWithText({ size = 32, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={size} />
      <span className="text-lg font-bold tracking-tight text-[#09B1BA]">Stockeesy</span>
    </div>
  )
}
