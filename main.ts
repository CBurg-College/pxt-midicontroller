serial.redirect(SerialPin.P14, SerialPin.P13, 31250)

let BEAT = 6        // 2.6 * 192 = 499 msec
let TONE = 0        // midi notes up(+) or down(-)

const SONG_PART = 0
const SONG_START = 1
const SONG_DURA = 2
const SONG_MSG = 9
const NOTE_OFF = 0
const CHORD_ROOT = 3
const CHORD_MAX = 9
const PART_MAX = 5
const NOTE_PAUSE = 127

let MIDIRESTART = true
let MIDIREPEAT = false
let MIDIPLAY = false
let MIDINOTE = 0

let midinotes =
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // [0] time noteOff + [3..8] chord notes partiture 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // [0] time noteOff + [3..8] chord notes partiture 2
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // [0] time noteOff + [3..8] chord notes partiture 3
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // [0] time noteOff + [3..8] chord notes partiture 4
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // [0] time noteOff + [3..8] chord notes partiture 5
    ]

let partinstrument = [0, 0, 0, 0, 0]
let partvolume = [0, 0, 0, 0, 0]

function noteOn(note: number, volume: number) {
    let buffer = pins.createBuffer(3)
    buffer.setUint8(0, 0x90)
    buffer.setUint8(1, note)
    buffer.setUint8(2, volume)
    serial.writeBuffer(buffer)
}

function noteOff(note: number) {
    let buffer = pins.createBuffer(3)
    buffer.setUint8(0, 0x80)
    buffer.setUint8(1, note)
    buffer.setUint8(2, 0)
    serial.writeBuffer(buffer)
}

function percussionOn(instrument: number, volume: number) {
    let buffer = pins.createBuffer(3)
    buffer.setUint8(0, 0x99)
    buffer.setUint8(1, instrument)
    buffer.setUint8(2, volume)
    serial.writeBuffer(buffer)
}

function persussionOff(instrument: number) {
    let buffer = pins.createBuffer(3)
    buffer.setUint8(0, 0x89)
    buffer.setUint8(1, instrument)
    buffer.setUint8(2, 0)
    serial.writeBuffer(buffer)
}

function instrument(instr: number) {
    let buffer = pins.createBuffer(2)
    buffer.setUint8(0, 0xC0)
    buffer.setUint8(1, instr)
    serial.writeBuffer(buffer)
}

let part = -1
let tone = 0
let start = control.millis()
let tm = control.millis()

basic.forever(function () {

    if (!MIDIPLAY) return

    if (MIDIRESTART) {
        part = -1
        tone = 0
        start = control.millis()
        MIDIRESTART = false
    }

    tm = control.millis();
    if (tm >= start + BEAT * songnotes[MIDINOTE][SONG_START]) {
        if (songnotes[MIDINOTE][SONG_MSG])
            radio.sendNumber(songnotes[MIDINOTE][SONG_MSG])
        tone = TONE;
        part = songnotes[MIDINOTE][SONG_PART];
        for (let i = CHORD_ROOT; i < CHORD_MAX; i++) {
            if (midinotes[part][i] >= 0 && midinotes[part][i] < NOTE_PAUSE)
                noteOff(midinotes[part][i]);
            midinotes[part][i] = songnotes[MIDINOTE][i];
        }
        midinotes[part][NOTE_OFF] = start +
            BEAT * (songnotes[MIDINOTE][SONG_START] + songnotes[MIDINOTE][SONG_DURA]);
        for (let i = CHORD_ROOT; i < CHORD_MAX; i++)
            if (midinotes[part][i] >= 0 && midinotes[part][i] < NOTE_PAUSE) {
                midinotes[part][i] = midinotes[part][i] + TONE;
                if (partinstrument[part] < 0)
                    percussionOn(-partinstrument[part], partvolume[part]);
                else {
                    instrument(partinstrument[part]);
                    noteOn(midinotes[part][i], partvolume[part]);
                }
            }
        MIDINOTE += 1;
        if (songnotes[MIDINOTE][SONG_PART] < 0) {

            // let MIDINOTE notes finish
            let cnt = 0;
            while (MIDIPLAY && (cnt < 5)) {
                cnt = 0;
                for (part = 0; part < PART_MAX; part++) {
                    if (midinotes[part][NOTE_OFF]) {
                        if (midinotes[part][NOTE_OFF] < control.millis()) {
                            for (let i = CHORD_ROOT; i < CHORD_MAX; i++)
                                noteOff(midinotes[part][i]);
                            midinotes[part][NOTE_OFF] = 0;
                            cnt += 1;
                        }
                    }
                    else
                        cnt += 1;
                }
            }

            MIDIRESTART = true;
            MIDINOTE = 0
            if (MIDIREPEAT) {
                CMidiController.pause(true)
                basic.pause(500)
                CMidiController.pause(false)
            }
            else
                CMidiController.stop()
        }
    }
})

namespace CMidiController {
    export function start() {
        basic.showLeds(`
                        . # # . .
                        . # # # .
                        . # # # #
                        . # # # .
                        . # # . .
                        `)
        MIDINOTE = 0
        MIDIPLAY = true
        MIDIRESTART = true
    }

    export function pause(status: boolean) {
        if (status) {
            MIDIPLAY = false
            basic.showLeds(`
                        # # . # #
                        # # . # #
                        # # . # #
                        # # . # #
                        # # . # #
                        `)
        }
        else {
            basic.showLeds(`
                        . # # . .
                        . # # # .
                        . # # # #
                        . # # # .
                        . # # . .
                        `)
            MIDIPLAY = true
        }
    }

    export function repeat(status: boolean) {
        MIDIREPEAT = status
    }

    export function stop() {
        MIDIPLAY = false
        basic.showLeds(`
                        . . . . .
                        . # # # .
                        . # # # .
                        . # # # .
                        . . . . .
                        `)
    }

    export function setInstrument(partiture: number, instrument: number) {
        if (partiture < 1 || partiture > 5) return;
        if (instrument < -127 || instrument > 127) return
        partinstrument[partiture - 1] = instrument;
    }

    export function setVolume(partiture: number, volume: number) {
        if (partiture < 1 || partiture > 5) return;
        if (volume > 127) return
        partvolume[partiture - 1] = volume;
    }

    // the length of a whole note
    // a whole note has value 192
    // a quarter note has value 48, etc.
    // the duration of a beat is measured in msec
    export function duration(msec: number) {
        BEAT = msec / 192
    }

    // transposing is performed by tone distances
    // negative values lower the tone
    export function transpose(distance: number) {
        TONE = Math.floor(distance);
    }
} // end namespace

CMidiController.setInstrument(1, 0)
CMidiController.setInstrument(2, 0)
CMidiController.setInstrument(3, 0)
CMidiController.setInstrument(4, 0)
CMidiController.setInstrument(5, 0)

CMidiController.setVolume(1, 64)
CMidiController.setVolume(2, 64)
CMidiController.setVolume(3, 64)
CMidiController.setVolume(4, 64)
CMidiController.setVolume(5, 64)

input.onButtonPressed(Button.A, function () {
    CMidiController.start()
})

input.onButtonPressed(Button.B, function () {
    CMidiController.stop()
})

radio.onReceivedNumber(function (cmd: number) {
    // 0: stop playing
    // 1: start playing
    // 2: pause playing

    // 100-500: transposing = value - 300

    // 1000-1199: instrument partiture 1
    // 1200-1399: instrument partiture 2
    // 1400-1599: instrument partiture 3
    // 1600-1799: instrument partiture 4
    // 1800-1999: instrument partiture 5

    // 2000-2199: volume partiture 1
    // 2200-2399: volume partiture 2
    // 2400-2599: volume partiture 3
    // 2600-2799: volume partiture 4
    // 2800-2999: volume partiture 5

    // > 3000: duration = value - 3000

    if (!cmd) CMidiController.stop()
    else
    if (cmd == 1) CMidiController.start()
    else
    if (cmd == 2) CMidiController.pause(true)
    else
    if (cmd == 3) CMidiController.pause(false)
    else
    if (cmd == 4) CMidiController.repeat(true)
    else
    if (cmd == 5) CMidiController.repeat(false)
    else

    if (cmd <= 500) CMidiController.transpose(cmd - 300)
    else

    if (cmd < 1200) CMidiController.setInstrument(1, cmd - 1000)
    else
    if (cmd < 1400) CMidiController.setInstrument(2, cmd - 1200)
    else
    if (cmd < 1600) CMidiController.setInstrument(3, cmd - 1400)
    else
    if (cmd < 1800) CMidiController.setInstrument(4, cmd - 1600)
    else
    if (cmd < 2000) CMidiController.setInstrument(5, cmd - 1800)
    else

    if (cmd < 2200) CMidiController.setVolume(1, cmd - 2000)
    else
    if (cmd < 2400) CMidiController.setVolume(2, cmd - 2200)
    else
    if (cmd < 2600) CMidiController.setVolume(3, cmd - 2400)
    else
    if (cmd < 2800) CMidiController.setVolume(4, cmd - 2600)
    else
    if (cmd < 3000) CMidiController.setVolume(5, cmd - 2800)
    else
        CMidiController.duration(cmd - 3000)
})
