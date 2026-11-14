const LED_POSITIONS = [[0, 0], [1, 0], [2, 0], [3, 0]];
const REPORT_LENGTH = 64;
const REPORT_ID = 0x02;
const COMMAND = 0x69;
const PAYLOAD_LENGTH = 0x10;

let previousColors = null;
let echoIndex = 0;

export function Name() {
    return "SayoDevice O3C++";
}

export function Publisher() {
    return "slinkybuky";
}

export function VendorId() {
    return 0x8089;
}

export function ProductId() {
    return 0x0009;
}

export function ImageUrl() {
    return "https://raw.githubusercontent.com/slinkybuky/o3c-signalrgb/main/icons/SayoDevice_O3C_PP.png";
}

export function DeviceType() {
    return "Keyboard";
}

export function Type() {
    return "hid";
}

export function Size() {
    return [4, 1];
}

export function LedNames() {
    return ["Key 1", "Key 2", "Key 3", "Key 4"];
}

export function LedPositions() {
    return LED_POSITIONS;
}

export function Validate(endpoint) {
    return endpoint.interface === 1;
}

function buildPacket(colors) {
    const packet = new Array(REPORT_LENGTH).fill(0);

    packet[0] = REPORT_ID;
    packet[1] = COMMAND;
    packet[2] = PAYLOAD_LENGTH;
    packet[3] = echoIndex & 0xFF;

    for (let i = 0; i < 12; i++) {
        packet[4 + i] = colors[i];
    }

    packet[0x13] = packet
        .slice(0, 0x13)
        .reduce((sum, value) => sum + value, 0) & 0xFF;

    packet[0x20] = COMMAND;

    return packet;
}

function drainInput() {
    for (let i = 0; i < 8; i++) {
        device.read([], REPORT_LENGTH, 0);

        if (device.getLastReadSize() <= 0) {
            break;
        }
    }
}

export function Initialize() {
    previousColors = null;
    echoIndex = 0;
    drainInput();
    device.log("SayoDevice O3C++ RGB controller initialized");
}

export function Render() {
    const colors = [];

    for (let i = 0; i < 4; i++) {
        colors.push(...device.color(i, 0));
    }

    if (previousColors !== null &&
        colors.every((value, index) => value === previousColors[index])) {
        return;
    }

    echoIndex = (echoIndex + 1) & 0xFF;

    const packet = buildPacket(colors);

    drainInput();
    device.write(packet, REPORT_LENGTH);

    previousColors = colors.slice();
}

export function Shutdown() {
    previousColors = null;
}
EOF