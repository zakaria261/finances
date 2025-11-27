// components/ui/mockup.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const MockupFrame = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-t-3xl h-[600px] w-full max-w-4xl",
      className
    )}
    {...props}
  />
))
MockupFrame.displayName = "MockupFrame"

interface MockupProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "responsive" | "mobile"
}

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
  ({ className, type = "responsive", children, ...props }, ref) => {
    if (type === "responsive") {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-t-xl overflow-hidden w-full h-full bg-white dark:bg-black",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }
    // Add other mockup types here if needed
    return null
  }
)
Mockup.displayName = "Mockup"

export { Mockup, MockupFrame }