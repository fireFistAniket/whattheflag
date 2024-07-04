import { useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import mapData from "../assets/global-map.json";
import { DetailCover } from "../components/DetailCover";
import { BackgroundGradient } from "../components/BackgroundGradientCard";
import { useEffect, useState } from "react";
import PageDetailsDropDown from "../components/PageDetailsDropDown";
import { InfiniteMovingCards } from "../components/InfiniteImage";
import { ImageScroll } from "../components/ImageScroll";
import { FlagPin } from "../components/FlagPin";

interface ContinentDataTypes {
  name: string;
  cover: string;
  mapconfig: {
    scale: number;
    center: [number, number];
  };
  description: string;
  area: string;
  population: string;
  borders: string;
  covered_seas: string[];
  places_to_travel: string[];
  famous_monuments: string[];
}

const Continent = () => {
  let { continent } = useParams();
  const [continentData, setContinentData] = useState<ContinentDataTypes>({
    name: "",
    cover: "",
    mapconfig: {
      scale: 0,
      center: [0, 0],
    },
    description: "",
    area: "",
    population: "",
    borders: "",
    covered_seas: [],
    places_to_travel: [],
    famous_monuments: [],
  });
  const [countriesName, setCountriesName] = useState<string[]>([]);

  const [countriesDetails, setCountriesDetails] = useState<
    [
      {
        flags: { png: string; svg: string; alt: string };
        name: {
          common: string;
          official: string;
          nativeName: { eng: { common: string; official: string } };
        };
      }
    ]
  >([
    {
      flags: {
        png: "",
        svg: "",
        alt: "",
      },
      name: {
        common: "",
        official: "",
        nativeName: {
          eng: {
            common: "",
            official: "",
          },
        },
      },
    },
  ]);

  const [continentImage, setContinentImage] = useState<string[]>([]);

  const [pageNumber, setPageNumber] = useState<number>(1);

  async function getContinentDetails(name: string | any) {
    let str = name.split(" ").join("_");
    try {
      const res = await fetch(`/whattheflag/continent/${str}.json`, {
        cache: "no-cache",
      });
      const data = await res.json();

      setContinentData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getImagesContinent(name: string | any, page: number | any) {
    let str = name.split(" ").join("+");
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${
          import.meta.env.VITE_PIXABAY_API_KEY
        }&q=${str}&image_type=photo&category=fashion,nature,people,places,animals,transportation,travel,buildings&orientation=horizontal&page=${page}`,
        {
          cache: "no-cache",
        }
      );
      const data = await res.json();
      let images: string[] = [];
      images = data.hits.map(
        (item: { largeImageURL: string }) => item.largeImageURL
      );
      setContinentImage((prev) => [...prev, ...images]);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCountryName(name: string | any) {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_REST_COUNTRY_API_URL
        }/region/${name}/?fields=name,flags`,
        {
          cache: "no-cache",
        }
      );
      const data = await res.json();
      let names: string[] = [];
      names = data.map(
        (item: { name: { common: string } }) => item.name.common
      );
      setCountriesName(names);
      setCountriesDetails(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getContinentDetails(continent);
    getCountryName(continent);
  }, []);

  useEffect(() => {
    getImagesContinent(continent, pageNumber);
  }, [pageNumber]);

  return (
    <main>
      <div className='relative flex items-center justify-center'>
        <DetailCover imageUrl={continentData.cover}>
          <p className='font-bold text-[3vmax] capitalize heading'>
            {continent}
          </p>
          <p className='font-normal text-[1.2vmax]'>
            {continentData.population}
          </p>
        </DetailCover>
      </div>
      <div className='flex items-start mx-[3vmax] gap-[3vmax] my-[3vmin]'>
        <BackgroundGradient className='rounded-[22px] min-w-[35vmax] bg-black'>
          <div className='flex flex-col items-center bg-dot-thick-neutral-700 p-4 sm:p-10'>
            <ComposableMap
              projection='geoMercator'
              projectionConfig={continentData.mapconfig}
            >
              <Geographies geography={mapData}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) =>
                      countriesName.includes(geo.properties.name)
                    )
                    .map((geo) => (
                      <>
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: "#ffcc00",
                              outline: "none",
                            },
                            hover: {
                              fill: "#f0a500",
                              outline: "none",
                            },
                            pressed: {
                              fill: "#d28000",
                              outline: "none",
                            },
                          }}
                        />
                        <Marker coordinates={geoCentroid(geo)}>
                          <circle r={3} fill='#000' />
                        </Marker>
                      </>
                    ))
                }
              </Geographies>
            </ComposableMap>
            <p className='text-white capitalize text-[2.5vmin] heading font-bold underline'>
              {continent}
            </p>
          </div>
        </BackgroundGradient>
        <div className='flex flex-col gap-[3vmin]'>
          <PageDetailsDropDown
            btnTitle={"description"}
            description={
              <p className='text-white text-lg'>{continentData.description}</p>
            }
            isOpen
          />
          <PageDetailsDropDown
            btnTitle={"area"}
            description={
              <p className='text-white text-lg'>{continentData.area}</p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"borders"}
            description={
              <p className='text-white text-lg'>{continentData.borders}</p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"population"}
            description={
              <p className='text-white text-lg'>{continentData.population}</p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"covered seas"}
            description={
              <p className='text-white text-lg'>
                {continentData.covered_seas.join(", ")}
              </p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"places to travel"}
            description={
              <p className='text-white text-lg'>
                {continentData.places_to_travel.join(", ")}
              </p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"famous monuments"}
            description={continentData.famous_monuments.join(", ")}
            isOpen={false}
          />
        </div>
      </div>
      <div className='flex flex-col items-center mx-[2vmax] my-[3vmax]'>
        <h1 className='text-[5vmin] text-white capitalize font-bold heading text-center'>
          Countries
        </h1>
        <div className='min-h-[40rem] flex flex-wrap gap-8 justify-center '>
          {countriesDetails.map((item, index) => (
            <FlagPin
              key={index}
              title={item.name.common}
              href={`/country/${item.name.common}`}
            >
              <div className='flex basis-full p-4 tracking-tight text-slate-100/50 '>
                <img
                  src={item.flags.png}
                  alt={`${item.name.common} flag`}
                  className='w-full'
                />
              </div>
            </FlagPin>
          ))}
        </div>
      </div>
      <div className='h-[40rem] rounded-md flex flex-col gap-[2vmin] antialiased justify-center relative overflow-hidden'>
        <h1 className='text-[3vmin] text-white capitalize font-bold heading mx-[3vmax]'>
          photobooth
        </h1>
        <InfiniteMovingCards
          items={continentImage.slice(0, 7)}
          direction='right'
          speed='slow'
        />
      </div>
      <div className='flex flex-col items-center'>
        <h1 className='text-[5vmin] text-white capitalize font-bold heading text-center'>
          gallery
        </h1>
        <ImageScroll images={continentImage} />
        <button
          type='button'
          onClick={() => setPageNumber(pageNumber + 1)}
          className='rounded-2xl text-xl text-white capitalize font-semibold border-neutral-300 border mt-[2vmin] py-[2vmin] para px-[4vmin]'
        >
          load more
        </button>
      </div>
    </main>
  );
};

export default Continent;
