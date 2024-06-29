import Lottie from "react-lottie-player";
import animatedLoader from "../assets/loading-animation.json";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        loop
        animationData={animatedLoader}
        play
        style={{ width: "25vmax" }}
      />
      <p className="text-[2vmin] font-medium text-white">
        Please wait while we complete the process
      </p>
    </div>
  );
};

export default Loading;
