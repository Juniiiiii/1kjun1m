const styles = getComputedStyle(document.documentElement);

const black = styles.getPropertyValue('--black');
const blue = styles.getPropertyValue('--blue');
const green = styles.getPropertyValue('--green');
const yellow = styles.getPropertyValue('--yellow');
const white = styles.getPropertyValue('--white');
const red = styles.getPropertyValue('--red');
const ghost = styles.getPropertyValue('--ghost');

const blackRGB = hexToRgb(black);
const blueRGB = hexToRgb(blue);
const greenRGB = hexToRgb(green);
const yellowRGB = hexToRgb(yellow);
const whiteRGB = hexToRgb(white);
const redRGB = hexToRgb(red);
const ghostRGB = hexToRgb(ghost);

const particleColors = [blue, green, yellow, white, red];
const charColors = [blue, green, yellow, red];
const charColorsRGB = [blueRGB, greenRGB, yellowRGB, redRGB];