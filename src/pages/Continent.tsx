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
import {
  FollowerPointerCard,
  TitleComponent,
} from "../components/FollowPointer";
import PageDetailsDropDown from "../components/PageDetailsDropDown";
import { InfiniteMovingCards } from "../components/InfiniteImage";

const asiaCountries = [
  "Afghanistan",
  "Armenia",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Myanmar",
  "Cambodia",
  "China",
  "Cyprus",
  "Georgia",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Israel",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Lebanon",
  "Malaysia",
  "Maldives",
  "Mongolia",
  "Nepal",
  "Oman",
  "Pakistan",
  "Philippines",
  "Qatar",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Sri Lanka",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Thailand",
  "Timor-Leste",
  "Turkey",
  "Turkmenistan",
  "United Arab Emirates",
  "Uzbekistan",
  "Vietnam",
  "Yemen",
];

interface ContinentDataTypes {
  name: string;
  cover: string;
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
    description: "",
    area: "",
    population: "",
    borders: "",
    covered_seas: [],
    places_to_travel: [],
    famous_monuments: [],
  });

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

  useEffect(() => {
    getContinentDetails(continent);
    getImagesContinent(continent);
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
        <BackgroundGradient className="rounded-[22px] min-w-[30vmax] bg-black">
          <FollowerPointerCard
            title={<TitleComponent title={`${continent}`} />}
          >
            <div className="flex flex-col items-center bg-dot-thick-neutral-700 p-4 sm:p-10">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 300,
                  center: [95, 20], // Center of Asia
                }}
              >
                <Geographies geography={mapData}>
                  {({ geographies }) =>
                    geographies
                      .filter((geo) =>
                        asiaCountries.includes(geo.properties.name)
                      )
                      .map((geo) => (
                        <>
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseOver={() => console.log(geo)}
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
          </FollowerPointerCard>
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
      <div className="h-[40rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={continentImage}
          direction="right"
          speed="slow"
        />
      </div>
    </main>
  );
};

export default Continent;
