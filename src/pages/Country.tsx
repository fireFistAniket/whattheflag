import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DetailCover } from "../components/DetailCover";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import mapData from "../assets/global-map.json";
import { feature } from "topojson-client";
import { BackgroundGradient } from "../components/BackgroundGradientCard";
import { GeoGeometryObjects, geoBounds, geoCentroid } from "d3-geo";
import { Topology, GeometryCollection } from "topojson-specification";
import PageDetailsDropDown from "../components/PageDetailsDropDown";
import { InfiniteMovingCards } from "../components/InfiniteImage";
import { PreviewCity } from "../components/PreviewCity";
import { State, City } from "country-state-city";
import { ImageScroll } from "../components/ImageScroll";
import { GlowingBorderButton } from "../components/MovingBorder";
import { HeroHighlight, Highlight } from "../components/HighlightText";
import { motion } from "framer-motion";

interface GeoProperties {
  name: string;
}

interface GeoFeature {
  type: string;
  properties: GeoProperties;
  geometry: any; // Use any type for geometry to avoid conflicts
}

const Country = () => {
  let { country } = useParams();
  const [continentImage, setContinentImage] = useState<string[]>([]);

  const [scale, setScale] = useState<number>(200);

  const [pageNumber, setPageNumber] = useState<number>(1);

  const [countryDetails, setCountryDetails] = useState<any>({});

  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const [borderCountriesName, setBorderCountriesName] = useState<string[]>([]);

  const [statesName, setStatesName] = useState<any[]>([]);

  const mapContainerRef = useRef<null | HTMLDivElement>(null);

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

  async function getCountryDetails(name: string | any) {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_REST_COUNTRY_API_URL
        }/name/${name}?fullText=true`,
        {
          cache: "no-cache",
        }
      );
      const data = await res.json();
      const allStates = State.getStatesOfCountry(data[0].cca2);

      setStatesName(allStates);
      if (data[0].borders) {
        const alphacodes = data[0].borders?.join(",");
        const borderRes = await fetch(
          `${
            import.meta.env.VITE_REST_COUNTRY_API_URL
          }/alpha?codes=${alphacodes}&fields=name`
        );

        const borders = await borderRes.json();

        let names: string[] = [];
        names = borders.map(
          (item: { name: { common: string } }) => item.name.common
        );
        setBorderCountriesName(names);
      }

      setCountryDetails(data[0]);
    } catch (error) {
      console.log(error);
    }
  }

  function getAllCitiesOfStates(cc: string, sc: string): string[] {
    const cities = City.getCitiesOfState(cc, sc);
    const names: string[] = cities.map((c) => c.name);
    return names;
  }

  function formatNumber(num: number): string {
    if (num === undefined || num === null) {
      return "N/A";
    }

    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + " B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + " M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + " K";
    } else {
      return num.toString();
    }
  }

  useEffect(() => {
    if (mapContainerRef.current) {
      const containerWidth = mapContainerRef.current.offsetWidth;
      const containerHeight = mapContainerRef.current.offsetHeight;

      const topojsonData = mapData as unknown as Topology<{
        countries: GeometryCollection;
      }>;

      const geoData = feature(topojsonData, topojsonData.objects.countries);

      if ("features" in geoData) {
        const selectedGeo: GeoGeometryObjects | any = (
          geoData.features as GeoFeature[]
        ).find((geo: GeoFeature) => geo.properties.name === country);

        if (selectedGeo) {
          const centroid = geoCentroid(selectedGeo);
          const bounds = geoBounds(selectedGeo);

          const [[x0, y0], [x1, y1]] = bounds;
          const newScale =
            30 /
            Math.max((x1 - x0) / containerWidth, (y1 - y0) / containerHeight);

          setCenter(centroid);
          setScale(newScale);
        }
      }
    }
  }, [country, mapContainerRef.current, mapData]);

  useEffect(() => {
    getImagesContinent(country, pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    getCountryDetails(country);
  }, [country]);

  return (
    <main>
      <div className="relative flex items-center justify-center">
        <DetailCover imageUrl={continentImage[0]}>
          <div className="flex items-center gap-[2vmin]">
            <p className="font-bold text-[3vmax] capitalize heading">
              {country}
            </p>
            <img
              src={`${countryDetails.flags?.png}`}
              alt={`${country} flag`}
              className="max-w-[4vmax]"
            />
          </div>
          <p className="font-normal text-[1.2vmax]">
            {formatNumber(countryDetails?.population)}
          </p>
        </DetailCover>
      </div>
      <div className="flex items-start mx-[3vmax] gap-[3vmax] my-[3vmin]">
        <BackgroundGradient className="rounded-[22px] min-w-[35vmax] bg-black">
          <div
            className="flex flex-col items-center bg-dot-thick-neutral-700 p-4 sm:p-10"
            ref={mapContainerRef}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: scale,
                center: center,
              }}
            >
              <Geographies geography={mapData}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => country === geo.properties.name)
                    .map((geo) => (
                      <React.Fragment key={geo.rsmKey}>
                        <Geography
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
                          <circle r={5} fill="#000" />
                        </Marker>
                      </React.Fragment>
                    ))
                }
              </Geographies>
            </ComposableMap>
            <p className="text-white capitalize text-[2.5vmin] heading font-bold underline">
              {country}
            </p>
          </div>
        </BackgroundGradient>
        <div className="flex flex-col gap-[3vmin] w-full">
          <PageDetailsDropDown
            btnTitle={"area"}
            description={
              <p className="text-white text-lg">{countryDetails.area} sq km.</p>
            }
            isOpen
          />
          <PageDetailsDropDown
            btnTitle={"capital city"}
            description={
              <p className="text-white text-lg">
                {countryDetails.capital?.join(", ")}
              </p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"car sign"}
            description={
              <div className="flex items-center gap-2 text-white text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  className="w-8 h-8"
                >
                  <path
                    stroke="white"
                    d="m18.5,10c.276,0,.5-.224.5-.5v-3.191l4.348-2.175c.408-.28.652-.757.652-1.276s-.243-.996-.652-1.277c-.025-.017-3.276-1.46-3.474-1.52-.438-.133-.9-.049-1.271.227-.378.281-.604.728-.604,1.197v8.016c0,.276.224.5.5.5Zm.5-8.516c0-.154.074-.301.199-.394.052-.038.144-.091.264-.091.038,0,.433.124.584.191l2.764,1.237c.119.097.189.255.189.43,0,.188-.082.357-.159.417l-3.841,1.917V1.484Zm5,17.016c0,1.93-1.57,3.5-3.5,3.5h-6c-.276,0-.5-.224-.5-.5s.224-.5.5-.5h6c1.379,0,2.5-1.122,2.5-2.5s-1.121-2.5-2.5-2.5h-8c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5h3c.276,0,.5.224.5.5s-.224.5-.5.5h-3c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5h8c1.93,0,3.5,1.57,3.5,3.5Zm-14-.5h-.93l-1.258-1.887c-.465-.697-1.242-1.113-2.08-1.113h-3.232c-1.378,0-2.5,1.122-2.5,2.5v2.5c0,.771.443,1.434,1.084,1.768-.05.157-.084.317-.084.482,0,.965.785,1.75,1.75,1.75s1.75-.785,1.75-1.75c0-.086-.03-.166-.044-.25h2.088c-.013.084-.044.164-.044.25,0,.965.785,1.75,1.75,1.75s1.75-.785,1.75-1.75c0-.086-.03-.166-.044-.25h.044c1.103,0,2-.897,2-2s-.897-2-2-2Zm-7.5-2h3.232c.502,0,.969.25,1.248.668l.888,1.332H1v-.5c0-.827.673-1.5,1.5-1.5Zm1,6.25c0,.414-.336.75-.75.75s-.75-.336-.75-.75c0-.084.018-.167.054-.25h1.392c.036.083.054.166.054.25Zm5.5,0c0,.414-.336.75-.75.75s-.75-.336-.75-.75c0-.084.018-.167.054-.25h1.392c.036.083.054.166.054.25Zm1-1.25H2c-.551,0-1-.449-1-1v-1h9c.551,0,1,.449,1,1s-.449,1-1,1Z"
                  />
                </svg>
                <p className="capitalize font-semibold">
                  {countryDetails.car?.side}
                </p>
              </div>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"continent"}
            description={
              <Link
                to={`/continent/${countryDetails.continents
                  ?.join("")
                  .toLowerCase()}`}
                className="text-white text-lg capitalize font-semibold"
              >
                {countryDetails.continents?.join("")}
              </Link>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"timezone"}
            description={
              <p className="text-white text-lg">
                {countryDetails.timezones?.join(", ")}
              </p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"political status"}
            description={
              <p className="text-white text-lg">
                {countryDetails.independent ? "Independent" : "Not independent"}
              </p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"week start day"}
            description={
              <p className="text-white text-lg capitalize">
                {countryDetails.startOfWeek}
              </p>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"coat of arms"}
            description={
              <img
                src={countryDetails.coatOfArms?.png}
                alt={countryDetails.name?.common + " coat of arms logo"}
                width={450}
                height={300}
                className="w-[10vmax]"
              />
            }
            isOpen={false}
          />
          {countryDetails.languages && (
            <PageDetailsDropDown
              btnTitle={"languages"}
              description={
                <div className="flex items-center gap-4">
                  {Object.values(countryDetails.languages).map(
                    (value: any, index) => (
                      <p
                        className='text-white text-lg capitalize relative [&:not(:last-child)]:after:content-[","]'
                        key={index}
                      >
                        {value}
                      </p>
                    )
                  )}
                </div>
              }
              isOpen={false}
            />
          )}
          <PageDetailsDropDown
            btnTitle={"borders"}
            description={
              <div className="flex items-center gap-4">
                {borderCountriesName.map((value: any, index) => (
                  <Link
                    to={`/country/${value}`}
                    className='text-white text-lg capitalize relative [&:not(:last-child)]:after:content-[","]'
                    key={index}
                  >
                    {value}
                  </Link>
                ))}
              </div>
            }
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"fifa team"}
            description={
              <div className="flex items-center gap-2 text-white text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  className="w-8 h-8"
                >
                  <path
                    stroke="white"
                    d="m21.5,3H2.5c-1.378,0-2.5,1.121-2.5,2.5v13c0,1.379,1.122,2.5,2.5,2.5h19c1.378,0,2.5-1.121,2.5-2.5V5.5c0-1.379-1.122-2.5-2.5-2.5ZM1,9h3v6H1v-6Zm10.5,11H2.5c-.827,0-1.5-.673-1.5-1.5v-2.5h4v-8H1v-2.5c0-.827.673-1.5,1.5-1.5h9v4.051c-1.968.249-3.5,1.915-3.5,3.949s1.532,3.7,3.5,3.949v4.051Zm-2.5-8c0-1.654,1.346-3,3-3s3,1.346,3,3-1.346,3-3,3-3-1.346-3-3Zm14,3h-3v-6h3v6Zm0-7h-4v8h4v2.5c0,.827-.673,1.5-1.5,1.5h-9v-4.051c1.968-.249,3.5-1.915,3.5-3.949s-1.532-3.7-3.5-3.949v-4.051h9c.827,0,1.5.673,1.5,1.5v2.5Z"
                  />
                </svg>

                <p className="capitalize font-semibold">
                  {countryDetails.fifa}
                </p>
              </div>
            }
            isOpen={false}
          />
        </div>
      </div>
      <div className="min-h-[40rem] rounded-md flex flex-col gap-[2vmin] antialiased justify-center relative overflow-hidden">
        <HeroHighlight className="heading">
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
            <Highlight className="">Photobooth</Highlight>
          </motion.h1>
        </HeroHighlight>
        <InfiniteMovingCards
          items={continentImage.slice(0, 7)}
          direction="right"
          speed="slow"
        />
      </div>
      <div className="flex flex-col mx-[3vmax]">
        <HeroHighlight className="heading">
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
            <Highlight className="">
              States and its&apos; popular cities
            </Highlight>
          </motion.h1>
        </HeroHighlight>

        <div className="flex items-center flex-wrap min-h-[35vmax] gap-4 px-4">
          {statesName.map((state, index) => (
            <PreviewCity
              key={index}
              texts={getAllCitiesOfStates(countryDetails.cca2, state.isoCode)}
              className=""
            >
              <GlowingBorderButton
                borderRadius="1.75rem"
                className="bg-gradient-to-r from-[#1abc9c] to-[#9b59b6] text-white border-neutral-200 font-bold flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  width="512"
                  height="512"
                >
                  <path
                    fill="red"
                    stroke="white"
                    d="M14.041,13.641l-5.448-4.264c-.644-.504-1.542-.504-2.185,0L.959,13.641c-.61,.477-.959,1.194-.959,1.969v8.391H15V15.609c0-.774-.35-1.492-.959-1.969Zm-.041,9.359H1v-7.391c0-.465,.21-.896,.576-1.182l5.448-4.264c.28-.219,.672-.219,.952,0l5.448,4.264c.366,.286,.576,.717,.576,1.182v7.391ZM23,0V2h-3V0h-1V2h-3V0h-1V2h-3V0h-1V5c0,1.103,.897,2,2,2v3.217l1,.783V7h7V23h-4v1h5V7c1.103,0,2-.897,2-2V0h-1Zm-1,6H13c-.551,0-1-.448-1-1V3h11v2c0,.552-.449,1-1,1ZM5,20h5v-5H5v5Zm1-4h3v3h-3v-3Z"
                  />
                </svg>
                <span>{state.name}</span>
              </GlowingBorderButton>
            </PreviewCity>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-[5vmin] text-white capitalize font-bold heading text-center">
          gallery
        </h1>
        <ImageScroll images={continentImage} />
        <button
          type="button"
          onClick={() => setPageNumber(pageNumber + 1)}
          className="rounded-2xl text-xl text-white capitalize font-semibold border-neutral-300 border mt-[2vmin] py-[2vmin] para px-[4vmin]"
        >
          load more
        </button>
      </div>
    </main>
  );
};

export default Country;
