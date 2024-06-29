import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spotlight } from "../components/Spotlight";
import { ImagesSlider } from "../components/ContinentSlider";
import { HeroHighlight, Highlight } from "../components/HighlightText";
import { GlowingBorderButton } from "../components/MovingBorder";
import { BentoGrid, BentoGridItem } from "../components/RegionGrid";
import Loading from "../components/Loading";

const World = lazy(() => import("../components/Globe"));

interface Countries {
  name: CountryName;
}

interface CountryName {
  common: string;
  official: string;
}

const Home = () => {
  const [countries, setCountries] = useState<Countries[]>([]);
  const [fullHeight, setFullHeight] = useState<boolean>(false);

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * (colors.length - 1))],
    },
  ];

  const images = [
    {
      uri: "https://cdn.pixabay.com/photo/2021/01/19/19/28/street-5932230_1280.jpg",
      title: "northern europe",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2020/09/06/17/52/island-5549660_1280.jpg",
      title: "western europe",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2018/10/18/15/56/cesky-krumlov-3756735_1280.jpg",
      title: "eastern europe",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2023/08/05/16/25/elephants-8171393_1280.jpg",
      title: "western africa",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2017/05/08/15/11/capetown-2295679_1280.jpg",
      title: "eastern africa",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2015/04/11/22/15/volcano-718277_1280.jpg",
      title: "northern africa",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2022/02/12/06/21/roys-peak-7008528_1280.jpg",
      title: "Australia and New Zealand",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2016/11/06/17/17/north-america-1803504_1280.jpg",
      title: "north america",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2016/04/03/02/28/rio-1303951_1280.jpg",
      title: "south america",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2022/06/04/11/19/city-7241725_1280.jpg",
      title: "south eastern asia",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2019/08/10/03/15/bridge-4396131_1280.jpg",
      title: "eastern asia",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2020/03/16/11/10/austria-4936672_1280.jpg",
      title: "Southern Europe",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2022/12/15/20/08/curacao-7658440_1280.jpg",
      title: "Caribbean",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2019/11/29/18/46/kyrgyzstan-4661907_1280.jpg",
      title: "Southern Asia",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2013/06/08/21/13/palu-123403_1280.jpg",
      title: "Micronesia",
    },
    {
      uri: "https://cdn.pixabay.com/photo/2017/12/16/22/22/bora-bora-3023437_1280.jpg",
      title: "polynesia",
    },
  ];

  async function getAllCountriesName() {
    try {
      const res: Response = await fetch(
        `${import.meta.env.VITE_REST_COUNTRY_API_URL}/all?fields=name`
      );
      const data: Countries[] = await res.json();
      setCountries(data);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllCountriesName();
  }, []);

  const items = [
    {
      title: "Oceania",
      description: "Explore the countries which is belong from Oceania region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2019/05/15/18/22/sydney-4205646_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="Oceania"
        />
      ),
    },
    {
      title: "Europe",
      description: "Explore the countries which is belong from Europe region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2023/05/03/19/57/passau-7968535_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="europe"
        />
      ),
    },
    {
      title: "Africa",
      description: "Explore the countries which is belong from Africa region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2019/04/12/11/46/antelope-4121962_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="africa"
        />
      ),
    },
    {
      title: "North America",
      description:
        "Explore the countries which is belong from North America region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2017/03/05/00/34/panorama-2117310_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="north america"
        />
      ),
    },
    {
      title: "South America",
      description:
        "Explore the countries which is belong from South America region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2019/08/19/10/44/peru-4416038_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="south america"
        />
      ),
    },
    {
      title: "Asia",
      description: "Explore the countries which is belong from Asia region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2018/05/01/07/52/tuscany-3364921_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="asia"
        />
      ),
    },
    {
      title: "Antarctic",
      description:
        "Explore the countries which is belong from Antarctic region.",
      header: (
        <img
          src="https://cdn.pixabay.com/photo/2018/09/26/18/44/hut-3705346_1280.jpg"
          className="max-h-[10rem] object-cover"
          alt="Antarctic"
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-row items-center justify-center py-24 h-screen md:h-auto relative w-full">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="div"
          >
            <h2 className="text-center text-xl md:text-5xl font-bold text-white heading">
              What the Flag
            </h2>
            <p className="text-center text-base md:text-lg font-normal text-neutral-200 max-w-xl mt-2 mx-auto para">
              What the flag is encyclopedia of world countries. Here you can get
              captial city, population, currency, region e.t.c of a certain
              country.
            </p>
          </motion.div>
          <div className="absolute w-full bottom-0 inset-x-0 h-40 pointer-events-none select-none z-40" />
          <div className="absolute w-full -bottom-20 h-80 md:h-full z-10">
            <World data={sampleArcs} globeConfig={globeConfig} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white leading-relaxed lg:leading-snug text-center mx-auto "
          >
            There are total of{"  "}
            <Highlight className="">7 Continents in our world.</Highlight>
          </motion.h1>
        </HeroHighlight>
        <BentoGrid className="max-w-6xl mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
      <div className="flex flex-col items-center gap-[4vh] mx-[3vmax] my-[2vmax]">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white leading-relaxed lg:leading-snug text-center mx-auto "
          >
            There are total of{"  "}
            <Highlight className="">195 countries in our world.</Highlight>
          </motion.h1>
        </HeroHighlight>
        <p className="text-white text-xl font-medium">
          We gather all information of countries like captial city, population,
          currency, region. In below you can find all 195 countries.
        </p>
        <div
          className={`flex justify-between gap-[2vmin] overflow-hidden flex-wrap ${
            fullHeight ? "" : "h-[28vh]"
          }`}
        >
          {countries.length > 0 &&
            countries.map((country, ind) => (
              <GlowingBorderButton
                key={ind}
                borderRadius="1.75rem"
                className="bg-gradient-to-r from-[#1abc9c] to-[#9b59b6] text-white border-neutral-200"
              >
                {country.name.common}
              </GlowingBorderButton>
            ))}
        </div>
        <button
          type="button"
          onClick={() => setFullHeight(!fullHeight)}
          className="rounded-2xl text-xl text-white capitalize font-semibold border-neutral-300 border py-[2vmin] px-[4vmin]"
        >
          view all
        </button>
      </div>
      <div className="flex flex-col items-center gap-6">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white leading-relaxed lg:leading-snug text-center mx-auto "
          >
            Find countries based on{"  "}
            <Highlight className="">their Sub-Region.</Highlight>
          </motion.h1>
        </HeroHighlight>
        <ImagesSlider className="h-[70vh]" images={images} />
      </div>
    </Suspense>
  );
};

export default Home;
