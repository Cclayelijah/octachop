import type p5Type from "p5";

export const handleMouseClick = (song, p5: p5Type) => {
  if (song.isPlaying()) {
    song.pause();
    p5.noLoop();
  } else {
    song.play();
    p5.loop();
  }
};
