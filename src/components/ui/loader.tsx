import { cn } from "@/lib/utils";

export function Loader({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <div
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2",
        className,
        variant === "primary" && "border-primary/15 border-t-primary",
        variant === "secondary" && "border-secondary/15 border-t-secondary"
      )}
    />
  );
}
