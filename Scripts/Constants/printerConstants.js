const relativeWidth = {
    "+": 1.1348684210526316,
    "-": 1.1348684210526316,
    "/": 1.019736842105263,
    "0": 0.9177631578947368,
    "1": 0.9177631578947368,
    "2": 0.9177631578947368,
    "3": 0.9177631578947368,
    "4": 0.9177631578947368,
    "5": 0.9177631578947368,
    "6": 0.9177631578947368,
    "7": 0.9177631578947368,
    "8": 0.9177631578947368,
    "9": 0.9177631578947368,
    "A": 1.644736842105263,
    "B": 1.0723684210526316,
    "C": 1.1019736842105263,
    "D": 1.0460526315789473,
    "E": 0.9605263157894737,
    "F": 0.8782894736842105,
    "G": 1.2960526315789473,
    "H": 1.1973684210526316,
    "I": 1.0921052631578947,
    "J": 1.1480263157894737,
    "K": 0.9671052631578947,
    "L": 0.9506578947368421,
    "M": 1.424342105263158,
    "N": 1.131578947368421,
    "O": 1.368421052631579,
    "P": 1.0855263157894737,
    "Q": 1.368421052631579,
    "R": 1.013157894736842,
    "S": 1.1842105263157894,
    "T": 1.1611842105263157,
    "U": 1.1546052631578947,
    "V": 1.2039473684210527,
    "W": 1.519736842105263,
    "X": 1.194078947368421,
    "Y": 1.3026315789473684,
    "Z": 1.2203947368421053,
    "a": 1.0,
    "b": 0.9868421052631579,
    "c": 0.9671052631578947,
    "d": 0.9638157894736842,
    "e": 0.9046052631578947,
    "f": 0.7072368421052632,
    "g": 0.9605263157894737,
    "h": 1.0296052631578947,
    "i": 0.48355263157894735,
    "j": 0.4769736842105263,
    "k": 0.7697368421052632,
    "l": 0.4440789473684211,
    "m": 1.0476973684210527,
    "n": 0.9588815789473685,
    "o": 0.9046052631578947,
    "p": 1.011513157894737,
    "q": 0.975328947368421,
    "r": 0.7927631578947368,
    "s": 0.8108552631578947,
    "t": 0.9588815789473685,
    "u": 0.8651315789473685,
    "v": 0.993421052631579,
    "w": 1.0855263157894737,
    "x": 0.930921052631579,
    "y": 1.0098684210526316,
    "z": 0.993421052631579
}
const relativeBoundingWidth = {
    "+": 1.0963855421686748,
    "-": 1.0983935742971886,
    "/": 1.0602409638554218,
    "0": 1.0160642570281124,
    "1": 1.0120481927710843,
    "2": 1.0120481927710843,
    "3": 1.0180722891566265,
    "4": 1.002008032128514,
    "5": 1.0120481927710843,
    "6": 1.0080321285140563,
    "7": 1.0040160642570282,
    "8": 1.0040160642570282,
    "9": 1.0080321285140563,
    "A": 1.8112449799196788,
    "B": 1.0562248995983936,
    "C": 1.176706827309237,
    "D": 1.072289156626506,
    "E": 0.9799196787148594,
    "F": 0.9156626506024096,
    "G": 1.393574297188755,
    "H": 1.3373493975903614,
    "I": 1.1606425702811245,
    "J": 1.2570281124497993,
    "K": 1.1365461847389557,
    "L": 1.0321285140562249,
    "M": 1.606425702811245,
    "N": 1.2409638554216869,
    "O": 1.5060240963855422,
    "P": 1.1927710843373494,
    "Q": 1.4578313253012047,
    "R": 1.0883534136546185,
    "S": 1.2811244979919678,
    "T": 1.2329317269076305,
    "U": 1.2971887550200802,
    "V": 1.3413654618473896,
    "W": 1.7469879518072289,
    "X": 1.3413654618473896,
    "Y": 1.461847389558233,
    "Z": 1.3734939759036144,
    "a": 1.0,
    "b": 1.0642570281124497,
    "c": 0.963855421686747,
    "d": 1.0200803212851406,
    "e": 0.9799196787148594,
    "f": 0.7108433734939759,
    "g": 0.9959839357429718,
    "h": 1.1365461847389557,
    "i": 0.39759036144578314,
    "j": 0.7349397590361446,
    "k": 0.8112449799196787,
    "l": 0.40562248995983935,
    "m": 1.1184738955823292,
    "n": 1.034136546184739,
    "o": 0.9457831325301205,
    "p": 1.0742971887550201,
    "q": 1.072289156626506,
    "r": 0.7891566265060241,
    "s": 0.8714859437751004,
    "t": 1.0441767068273093,
    "u": 0.9096385542168675,
    "v": 1.072289156626506,
    "w": 1.248995983935743,
    "x": 1.0,
    "y": 1.0562248995983936,
    "z": 1.0401606425702812
}

const lowerPath = './Glyphs/lower/';
const upperPath = './Glyphs/upper/';
const numberPath = './Glyphs/number/';
const operPath = './Glyphs/operation/';

const lsLower = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i)); // 'a' through 'z'
const lsUpper = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)); // 'A' through 'Z'
const lsNumber = Array.from({length: 10}, (_, i) => String.fromCharCode(48 + i)); // '0' through '9'
const lsOper = ['+', '-', '/'];

//Size of the space in between adjacent characters. Percentage of 'a'
const inBetween = 0.3;

//Height of the character ascents in both directions. Percentage of 'a'.
//Moves the character height by a_height * charAscent.
const charAscent = 0.15;

//Height of capital letters. Percentage of 'a'
//Moves the character height by a_height * capsAscent.
const capsAscent = 0.18;

//Moves numbers up and down. Namely 7 and 9 because it needs adjustment.
const numberAdjustment = 0.15;





