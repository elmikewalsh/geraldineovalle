 // Prev / Next buttons
const setupPrevNextBtns = (prevBtn, nextBtn, embla) => {
   prevBtn.addEventListener('click', embla.scrollPrev, false);
   nextBtn.addEventListener('click', embla.scrollNext, false);
 };
 
const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
   return () => {
     if (embla.canScrollPrev()) prevBtn.removeAttribute('disabled');
     else prevBtn.setAttribute('disabled', 'disabled');
 
     if (embla.canScrollNext()) nextBtn.removeAttribute('disabled');
     else nextBtn.setAttribute('disabled', 'disabled');
   };
 };

 // Paralax style
 const PARALLAX_FACTOR = 1.9;

 const parallax = embla => {
   const scrollSnaps = embla.scrollSnapList();
   const slides = embla.slideNodes();
   const layers = slides.map(node =>
     node.querySelector(".embla__slide__parallax")
   );
 
   const applyParallaxStyles = () => {
     scrollSnaps.forEach((scrollSnap, index) => {
       const diffToTarget = scrollSnap - embla.scrollProgress();
       const x = diffToTarget * (-1 / PARALLAX_FACTOR) * 100;
       layers[index].style.transform = `translateX(${x}%)`;
     });
   };
 
   return applyParallaxStyles;
 };


// Main
const wrap = document.querySelector(".embla");
const viewPort = wrap.querySelector(".embla__viewport");
const prevBtn = wrap.querySelector(".embla__button--prev");
const nextBtn = wrap.querySelector(".embla__button--next");
const embla = EmblaCarousel(viewPort);

const applyParallaxStyles = parallax(embla);
embla.on("init", applyParallaxStyles);
embla.on("scroll", applyParallaxStyles);
embla.on("resize", applyParallaxStyles);

const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);
setupPrevNextBtns(prevBtn, nextBtn, embla);
embla.on("init", disablePrevAndNextBtns);
embla.on("select", disablePrevAndNextBtns);
