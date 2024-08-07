import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface Pageprops {
  btnTitle: string;
  description?: ReactNode;
  isOpen: boolean;
}

const PageDetailsDropDown = ({ btnTitle, description, isOpen }: Pageprops) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(
    isOpen ? isOpen : false
  );
  return (
    <motion.div
      className='flex flex-col overflow-hidden p-2 gap-[3vmin]'
      initial={{ height: "6vh" }}
      animate={isExpanded ? { height: "auto" } : { height: "6vh" }}
      transition={{ duration: 0.5 }}
    >
      <button
        type='button'
        onClick={() => setIsExpanded(!isExpanded)}
        className='text-3xl font-bold text-white inline-flex items-center justify-between'
      >
        <span className='capitalize heading'>{btnTitle}</span>
        <motion.svg
          xmlns='http://www.w3.org/2000/svg'
          width={24}
          height={24}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          initial={{ rotate: "0deg" }}
          animate={isExpanded ? { rotate: "-180deg" } : { rotate: "0deg" }}
          transition={{ duration: 0.5 }}
          className='icon icon-tabler icons-tabler-outline icon-tabler-chevron-down'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M6 9l6 6l6 -6' />
        </motion.svg>
      </button>
      {description}
    </motion.div>
  );
};

export default PageDetailsDropDown;
