import tex00 from "/assets/tex00.jpg";
import tex01 from "/assets/tex01.jpg";
import tex02 from "/assets/tex02.jpg";
import tex03 from "/assets/tex03.jpg";
import tex04 from "/assets/tex04.jpg";
import tex05 from "/assets/tex05.jpg";
import tex06 from "/assets/tex06.jpg";
import tex07 from "/assets/tex07.jpg";
import tex08 from "/assets/tex08.jpg";
import tex09 from "/assets/tex09.jpg";
import tex10 from "/assets/tex10.jpg";
import tex11 from "/assets/tex11.jpg";
import tex12 from "/assets/tex12.jpg";
import tex13 from "/assets/tex13.jpg";
import tex14 from "/assets/tex14.jpg";
import tex15 from "/assets/tex15.jpg";
import tex16 from "/assets/tex16.jpg";
import tex17 from "/assets/tex17.jpg";
import tex18 from "/assets/tex18.jpg";
import tex19 from "/assets/tex19.jpg";
import tex20 from "/assets/tex20.jpg";

const defaultImages = [
  tex00,
  tex01,
  tex02,
  tex03,
  tex04,
  tex05,
  tex06,
  tex07,
  tex08,
  tex09,
  tex10,
  tex11,
  tex12,
  tex13,
  tex14,
  tex15,
  tex16,
  tex17,
  tex18,
  tex19,
  tex20,
];

function randomImage() {
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

export { randomImage };
