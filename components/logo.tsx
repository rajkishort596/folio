import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon uniColor={uniColor} />
      <span className="text-xl font-bold tracking-tight text-foreground">
        folio
      </span>
    </div>
  );
};

export const LogoIcon = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
      />
      <path
        d="M8 8V16M8 8H16M8 12H14"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="3"
          y1="3"
          x2="21"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ED2224" />
          <stop offset="1" stopColor="#A01214" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("size-7 w-7", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 8V16M9 8H15M9 12H13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
