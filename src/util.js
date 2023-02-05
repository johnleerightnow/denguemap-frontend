export const getScreen = () => {
  const dim = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };

  return ({
    desktop: dim.width >= 1184,
    tabletOrLower: dim.width <= 1183,
    tablet: dim.width <= 1183 && dim.width > 768,
    mobile: dim.width <= 768 && dim.width >= 360,
    smaller: dim.width <= 359,
  });
};
