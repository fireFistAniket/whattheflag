import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "../utils/cn";

type LinkPreviewProps = {
  children: React.ReactNode;
  className?: string;
  texts: string[];
};

export const PreviewCity = ({
  children,
  className,
  texts,
}: LinkPreviewProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: any) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  return (
    <>
      {isMounted ? (
        <div className='hidden'>
          {texts.map((text, index) => (
            <p
              key={index}
              className='text-white [&:not(:last-child)]:after:content-[","] capitalize'
            >
              {text}
            </p>
          ))}
        </div>
      ) : null}

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn("text-white", className)}
        >
          {children}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className='[transform-origin:var(--radix-hover-card-content-transform-origin)] z-[1100]'
          side='top'
          align='center'
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className='shadow-xl rounded-xl flex flex-wrap max-w-[45vmax] bg-black/75 px-[2vmax] py-[2vmin] backdrop-blur border gap-6'
                style={{
                  x: translateX,
                }}
              >
                {texts.map((text, index) => (
                  <p
                    key={index}
                    className='text-white [&:not(:last-child)]:after:content-[","] capitalize'
                  >
                    {text}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};
