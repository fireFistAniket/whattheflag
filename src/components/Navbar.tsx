import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  onClick,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClick: (e: React.MouseEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the interval when the tab is not visible
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation(); // Restart the interval when the tab becomes visible
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit && onSubmit(e);
  };
  const handleClick = (e: React.MouseEvent<HTMLFormElement>) => {
    onClick(e);
  };
  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-transparent border h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value && ""
      )}
      onSubmit={handleSubmit}
      onClick={handleClick}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none  text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      <input
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange && onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none text-white bg-transparent h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20 pointer-events-none",
          animating && "text-transparent"
        )}
      />

      <button
        disabled={!value}
        type="submit"
        className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%",
            }}
            transition={{
              duration: 0.3,
              ease: "linear",
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="text-sm sm:text-base font-normal text-neutral-400 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              Search for {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const handelModalOpen = (_e: React.MouseEvent<HTMLFormElement>) => {
    setIsModalOpen(!isModalOpen);
  };

  const placeholders = ["country", "sub-region", "continent", "currencies"];

  return (
    <nav className="bg-transparent w-full z-20 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/whattheflag/logo.png" className="h-8" alt="logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white heading">
            What the Flag
          </span>
        </Link>
        <div className="flex md:order-2">
          <button
            type="button"
            data-collapse-toggle="navbar-search"
            aria-controls="navbar-search"
            aria-expanded="false"
            className="md:hidden text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
              onClick={handelModalOpen}
            />
          </div>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 para"
          id="navbar-search"
        >
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-white border border-gray-600 rounded-lg bg-gray-700 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Search..."
            />
          </div>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 text-xl">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white rounded hover:text-blue-700 md:p-0"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:text-blue-700 md:p-0"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:text-blue-700 md:p-0"
              >
                Services
              </a>
            </li>
          </ul>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.6 }}
        animate={
          isModalOpen
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }
            : {}
        }
        exit={{ opacity: 0, y: 20, scale: 0.6 }}
        className="overflow-hidden flex items-center justify-center"
      >
        <div className="border border-neutral-500 rounded-lg px-[4vmax] py-[2vmax]">
          <form className="max-w-lg mx-auto">
            <div className="flex">
              <div>
                <select
                  name=""
                  id=""
                  className="z-10 divide-y divide-gray-100 h-full rounded-tl-lg rounded-bl-lg shadow w-44 bg-gray-100"
                >
                  <option
                    value=""
                    className="py-2 text-sm hovetext-gray-200 inline-flex w-full px-4"
                  >
                    country
                  </option>
                  <option
                    value=""
                    className="py-2 text-sm hovetext-gray-200 inline-flex w-full px-4"
                  >
                    continent
                  </option>
                  <option
                    value=""
                    className="py-2 text-sm hovetext-gray-200 inline-flex w-full px-4"
                  >
                    currencies
                  </option>
                </select>
              </div>
              <div className="relative w-[45vmax]">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm bg-gray-50 rounded-e-lg border-s border focus:ring-blue-500 border-s-gray-700 border-gray-600 placeholder-gray-400 text-white"
                  placeholder="Search Mockups, Logos, Design Templates..."
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
