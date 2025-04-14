import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      data-vjs-player
      style={{ width: "600px", alignSelf:'center'}}
    >
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;









// import React, { useRef, useEffect, useState, useCallback } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";
// import { Box, Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb, HStack, IconButton } from "@chakra-ui/react";
// import { FaPlay, FaPause, FaVolumeUp, FaExpand, FaForward } from "react-icons/fa";

// export const VideoPlayer = ({ options, onReady }) => {
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [showControls, setShowControls] = useState(true);
//   const hideControlsTimeout = useRef(null);

//   useEffect(() => {
//     if (!playerRef.current) {
//       const videoElement = document.createElement("video-js");
//       videoElement.classList.add("vjs-big-play-centered");
//       videoRef.current.appendChild(videoElement);

//       const player = (playerRef.current = videojs(videoElement, { ...options, controls: false }, () => {
//         videojs.log("Player is ready");
//         onReady && onReady(player);
//       }));

//       player.on("play", () => setIsPlaying(true));
//       player.on("pause", () => setIsPlaying(false));
//       player.on("timeupdate", () => setProgress((player.currentTime() / player.duration()) * 100));
//     }
//   }, [options]);

//   useEffect(() => {
//     return () => {
//       const player = playerRef.current;
//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, []);

//   const togglePlay = () => {
//     const player = playerRef.current;
//     if (player) {
//       player.paused() ? player.play() : player.pause();
//     }
//   };

//   const skipForward = () => {
//     const player = playerRef.current;
//     if (player) {
//       player.currentTime(player.currentTime() + 10);
//     }
//   };

//   const handleVolumeChange = (val) => {
//     const player = playerRef.current;
//     setVolume(val);
//     player.volume(val);
//   };

//   const handleProgressChange = (val) => {
//     const player = playerRef.current;
//     const newTime = (val / 100) * player.duration();
//     player.currentTime(newTime);
//     setProgress(val);
//   };

//   const enterFullScreen = () => {
//     const player = playerRef.current;
//     if (player) {
//       if (player.requestFullscreen) {
//         player.requestFullscreen();
//       } else if (player.webkitEnterFullscreen) {
//         player.webkitEnterFullscreen();
//       }
//       setShowControls(true);
//       resetHideControlsTimer();
//     }
//   };

//   const resetHideControlsTimer = useCallback(() => {
//     if (hideControlsTimeout.current) {
//       clearTimeout(hideControlsTimeout.current);
//     }
//     hideControlsTimeout.current = setTimeout(() => {
//       setShowControls(false);
//     }, 5000); // Hide after 5 seconds
//   }, []);

//   useEffect(() => {
//     const handleMouseMove = () => {
//       setShowControls(true);
//       resetHideControlsTimer();
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     return () => document.removeEventListener("mousemove", handleMouseMove);
//   }, [resetHideControlsTimer]);

//   return (
//     <Box w="100%" maxW="800px" alignSelf="center" position="relative">
//       {/* Video.js Player */}
//       <div data-vjs-player>
//         <div ref={videoRef} />
//       </div>

//       {/* Custom Controls (Auto-Hide After 5s in Fullscreen) */}
//       {showControls && (
//         <HStack
//           position="absolute"
//           bottom="10px"
//           left="50%"
//           transform="translateX(-50%)"
//           w="90%"
//           p={3}
//           bg="rgba(0, 0, 0, 0.5)"
//           borderRadius="10px"
//           justify="space-between"
//           align="center"
//         >
//           <IconButton icon={isPlaying ? <FaPause /> : <FaPlay />} onClick={togglePlay} colorScheme="teal" aria-label="Play/Pause" />
//           <IconButton icon={<FaForward />} onClick={skipForward} colorScheme="purple" aria-label="Skip 10s" />
//           <Slider value={progress} onChange={handleProgressChange} flex="1">
//             <SliderTrack>
//               <SliderFilledTrack />
//             </SliderTrack>
//             <SliderThumb />
//           </Slider>
//           <IconButton icon={<FaVolumeUp />} onClick={() => setVolume(1)} colorScheme="blue" aria-label="Volume Up" />
//           <Slider value={volume} onChange={handleVolumeChange} max={1} step={0.1} w="100px">
//             <SliderTrack>
//               <SliderFilledTrack />
//             </SliderTrack>
//             <SliderThumb />
//           </Slider>
//           <IconButton icon={<FaExpand />} onClick={enterFullScreen} colorScheme="gray" aria-label="Fullscreen" />
//         </HStack>
//       )}
//     </Box>
//   );
// };

// export default VideoPlayer;
