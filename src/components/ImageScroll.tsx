import { useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import ImageViewer from "react-simple-image-viewer";
import { cn } from "../utils/cn";

export const ImageScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateYFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateXFirst = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<number>(0);

  const translateYThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXThird = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotateXThird = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  const openImageViewer = useCallback((index: number) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div
      className={cn(
        "h-[60vmax] items-start no-scroll overflow-x-hidden overflow-y-auto w-full",
        className
      )}
      ref={gridRef}
    >
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-[80vw] mx-auto gap-10 py-40 px-10'
        ref={gridRef}
      >
        <div className='grid gap-10'>
          {firstPart.map((el, idx) => (
            <motion.div
              style={{
                y: translateYFirst,
                x: translateXFirst,
                rotateZ: rotateXFirst,
              }} 
              key={"grid-1" + idx}
            >
              <img
                src={el}
                onClick={() =>
                  openImageViewer(images.findIndex((elm) => elm === el))
                }
                className='h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0 cursor-pointer'
                height='400'
                width='400'
                alt='thumbnail'
              />
            </motion.div>
          ))}
        </div>
        <div className='grid gap-10'>
          {secondPart.map((el, idx) => (
            <motion.div key={"grid-2" + idx}>
              <img
                src={el}
                onClick={() =>
                  openImageViewer(images.findIndex((elm) => elm === el))
                }
                className='h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0 cursor-pointer'
                height='400'
                width='400'
                alt='thumbnail'
              />
            </motion.div>
          ))}
        </div>
        <div className='grid gap-10'>
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{
                y: translateYThird,
                x: translateXThird,
                rotateZ: rotateXThird,
              }}
              key={"grid-3" + idx}
            >
              <img
                src={el}
                className='h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0 cursor-pointer'
                onClick={() =>
                  openImageViewer(images.findIndex((elm) => elm === el))
                }
                height='400'
                width='400'
                alt='thumbnail'
              />
            </motion.div>
          ))}
        </div>
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={true}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
};
