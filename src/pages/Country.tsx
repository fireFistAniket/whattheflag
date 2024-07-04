import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
// import { State, City } from "country-state-city";

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

  const [pageNumber, _setPageNumber] = useState<number>(1);

  const [countryDetails, setCountryDetails] = useState<any>({});

  const [center, setCenter] = useState<[number, number]>([0, 0]);

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
      // console.log(State.getStatesOfCountry(data[0].cca2));
      console.log(data[0]);

      setCountryDetails(data[0]);
    } catch (error) {
      console.log(error);
    }
  }

  function formatNumber(num: number): string {
    if (num === undefined || num === null) {
      return "N/A"; // or any other placeholder for undefined values
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

      // Convert TopoJSON to GeoJSON
      const geoData = feature(topojsonData, topojsonData.objects.countries);

      if ("features" in geoData) {
        // Find the selected geography
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
  }, []);

  return (
    <main>
      <div className="relative flex items-center justify-center">
        <DetailCover imageUrl={continentImage[0]}>
          <p className="font-bold text-[3vmax] capitalize heading">{country}</p>
          <p className="font-normal text-[1.2vmax]">
            {formatNumber(countryDetails?.population)}
          </p>
        </DetailCover>
      </div>
      <div className="">
        {/* <svg
          xmlns='http://www.w3.org/2000/svg'
          id='Layer_1'
          data-name='Layer 1'
          className='w-[4vmax] h-[4vmax]'
          viewBox='0 0 24 24'
          width='512'
          height='512'
        >
          <path
            fill='red'
            stroke='white'
            d='M14.041,13.641l-5.448-4.264c-.644-.504-1.542-.504-2.185,0L.959,13.641c-.61,.477-.959,1.194-.959,1.969v8.391H15V15.609c0-.774-.35-1.492-.959-1.969Zm-.041,9.359H1v-7.391c0-.465,.21-.896,.576-1.182l5.448-4.264c.28-.219,.672-.219,.952,0l5.448,4.264c.366,.286,.576,.717,.576,1.182v7.391ZM23,0V2h-3V0h-1V2h-3V0h-1V2h-3V0h-1V5c0,1.103,.897,2,2,2v3.217l1,.783V7h7V23h-4v1h5V7c1.103,0,2-.897,2-2V0h-1Zm-1,6H13c-.551,0-1-.448-1-1V3h11v2c0,.552-.449,1-1,1ZM5,20h5v-5H5v5Zm1-4h3v3h-3v-3Z'
          />
        </svg> */}
      </div>
      <div className="flex items-start">
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
                    .filter(
                      (geo) =>
                        // countriesName.includes(geo.properties.name)
                        country === geo.properties.name
                    )
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
                          <circle r={3} fill="#000" />
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
        <div></div>
      </div>
    </main>
  );
};

export default Country;
