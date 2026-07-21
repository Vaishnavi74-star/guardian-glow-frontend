import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props extends HTMLMotionProps<"div"> {
  strong?: boolean;
}

export function GlassCard({ className, strong, children, ...props }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-2xl p-6",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
