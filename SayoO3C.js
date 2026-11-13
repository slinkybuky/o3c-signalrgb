
const LED_POSITIONS = [[0, 0], [1, 0]];
const REPORT_LENGTH = 64;
const REPORT_ID = 0x02;
const COMMAND = 0x69;

let previousPacket = null;

export function Name() {
    return "SayoDevice O3C";
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
    return "https://raw.githubusercontent.com/slinkybuky/o3c-signalrgb/main/SayoO3C.png";
}

export function DeviceType() {
    return "Keyboard";
}

export function Type() {
    return "hid";
}

export function Size() {
    return [2, 1];
}

export function LedNames() {
    return ["Key 1", "Key 2"];
}

export function LedPositions() {
    return LED_POSITIONS;
}

export function Validate(endpoint) {
    return endpoint.interface === 1;
}

function buildPacket(key1, key2) {
    const packet = new Array(REPORT_LENGTH).fill(0);

    packet[0] = REPORT_ID;
    packet[1] = COMMAND;
    packet[2] = 0x06;

    packet[4] = key1[0];
    packet[5] = key1[1];
    packet[6] = key1[2];

    packet[7] = key2[0];
    packet[8] = key2[1];

    packet[3] = (
        key2[2] -
        packet[0] -
        packet[1] -
        packet[2] -
        packet[4] -
        packet[5] -
        packet[6] -
        packet[7] -
        packet[8]
    ) & 0xFF;

    packet[9] = packet.slice(0, 9).reduce((sum, value) => sum + value, 0) & 0xFF;

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
    previousPacket = null;
    drainInput();
    device.log("O3Cpatch RGB controller initialized");
}

export function Render() {
    const key1 = device.color(0, 0);
    const key2 = device.color(1, 0);

    const packet = buildPacket(key1, key2);

    if (previousPacket !== null &&
        packet.every((value, index) => value === previousPacket[index])) {
        return;
        }

        drainInput();
    device.write(packet, REPORT_LENGTH);

    previousPacket = packet;
}

export function Shutdown() {
    previousPacket = null;
}
