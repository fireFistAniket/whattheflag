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

  const [continentImage, setContinentImage] = useState<string[]>([]);

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

  async function getImagesContinent(name: string | any) {
    let str = name.split(" ").join("+");
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${
          import.meta.env.VITE_PIXABAY_API_KEY
        }&q=${str}&image_type=photo&category=fashion,nature,people,places,animals,transportation,travel,buildings&orientation=horizontal`,
        {
          cache: "no-cache",
        }
      );
      const data = await res.json();
      let images: string[] = [];
      images = data.hits.map(
        (item: { largeImageURL: string }) => item.largeImageURL
      );
      setContinentImage(images);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCountryName(name: string | any) {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_REST_COUNTRY_API_URL
        }/region/${name}/?fields=name`,
        {
          cache: "no-cache",
        }
      );
      const data = await res.json();
      let names: string[] = [];
      console.log(data.name);
      names = data.map(
        (item: { name: { common: string } }) => item.name.common
      );

      setCountriesName(names);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getContinentDetails(continent);
    getImagesContinent(continent);
    getCountryName(continent);
  }, []);

  return (
    <main>
      <div className="relative flex items-center justify-center">
        <DetailCover imageUrl={continentData.cover}>
          <p className="font-bold text-[3vmax] capitalize heading">
            {continent}
          </p>
          <p className="font-normal text-[1.2vmax]">
            {continentData.population}
          </p>
        </DetailCover>
      </div>
      <div className="flex items-start mx-[3vmax] gap-[3vmax] my-[3vmin]">
        <BackgroundGradient className="rounded-[22px] min-w-[35vmax] bg-black">
          <div className="flex flex-col items-center bg-dot-thick-neutral-700 p-4 sm:p-10">
            <ComposableMap
              projection="geoMercator"
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
                          <circle r={3} fill="#000" />
                        </Marker>
                      </>
                    ))
                }
              </Geographies>
            </ComposableMap>
            <p className="text-white capitalize text-[2.5vmin] heading font-bold underline">
              {continent}
            </p>
          </div>
        </BackgroundGradient>
        <div className="flex flex-col gap-[3vmin]">
          <PageDetailsDropDown
            btnTitle={"description"}
            description={continentData.description}
            isOpen
          />
          <PageDetailsDropDown
            btnTitle={"area"}
            description={continentData.area}
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"borders"}
            description={continentData.borders}
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"population"}
            description={continentData.population}
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"covered seas"}
            description={continentData.covered_seas.join(", ")}
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"places to travel"}
            description={continentData.places_to_travel.join(", ")}
            isOpen={false}
          />
          <PageDetailsDropDown
            btnTitle={"famous monuments"}
            description={continentData.famous_monuments.join(", ")}
            isOpen={false}
          />
        </div>
      </div>
      <div className="h-[40rem] rounded-md flex flex-col gap-[2vmin] antialiased justify-center relative overflow-hidden">
        <h1 className="text-[3vmin] text-white capitalize font-bold heading mx-[3vmax]">
          photobooth
        </h1>
        <InfiniteMovingCards
          items={continentImage.slice(0, 7)}
          direction="right"
          speed="slow"
        />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-[5vmin] text-white capitalize font-bold heading text-center">
          gallery
        </h1>
        <ImageScroll images={continentImage} />
      </div>
    </main>
  );
};

export default Continent;
