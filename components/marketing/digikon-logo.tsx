import { cn } from "@/lib/utils";

type DigikonLogoProps = {
  className?: string;
};

/**
 * Vector wordmark: DIGIK + solid circle O + N + TM (matches brand lockup).
 * Uses currentColor for theme-aware rendering.
 */
export function DigikonLogo({ className }: DigikonLogoProps) {
  return (
    <svg
      viewBox="0 0 112 24"
      className={cn("h-7 w-auto shrink-0", className)}
      aria-hidden
    >
      <text
        x="0"
        y="17.5"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="15"
        fontWeight="700"
        letterSpacing="-0.05em"
      >
        DIGIK
      </text>
      {/* Solid “O” — single fill, no inner hub or aperture blades */}
      <circle cx="64" cy="11.75" r="7" fill="currentColor" />
      <text
        x="79"
        y="17.5"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="15"
        fontWeight="700"
        letterSpacing="-0.05em"
      >
        N
      </text>
      <text
        x="92"
        y="8.5"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="5.2"
        fontWeight="600"
      >
        TM
      </text>
    </svg>
  );
}
