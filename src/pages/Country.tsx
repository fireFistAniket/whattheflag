import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DetailCover } from "../components/DetailCover";
// import { State, City } from "country-state-city";

const Country = () => {
  let { country } = useParams();
  const [continentImage, setContinentImage] = useState<string[]>([]);

  const [pageNumber, _setPageNumber] = useState<number>(1);

  const [countryDetails, setCountryDetails] = useState<any>({});

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
            {/* {countryDetails?.population} */}
          </p>
        </DetailCover>
      </div>
    </main>
  );
};

export default Country;
