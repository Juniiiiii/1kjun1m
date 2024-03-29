const styles = getComputedStyle(document.documentElement);

const black = styles.getPropertyValue('--black');
const blue = styles.getPropertyValue('--blue');
const green = styles.getPropertyValue('--green');
const yellow = styles.getPropertyValue('--yellow');
const white = styles.getPropertyValue('--white');
const red = styles.getPropertyValue('--red');
const ghost = styles.getPropertyValue('--ghost');

const particleColors = [blue, green, yellow, white, red];
const charColors = [blue, green, yellow, red];