
const LED_POSITIONS = [[0, 0], [1, 0], [2, 0]];
const REPORT_LENGTH = 64;
const REPORT_ID = 0x21;
const ECHO = 0x03;
const COMMAND = 0x27;

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
    return "https://raw.githubusercontent.com/slinkybuky/o3c-signalrgb/main/icons/SayoDevice_O3C.png";
}

export function DeviceType() {
    return "Keyboard";
}

export function Type() {
    return "hid";
}

export function Size() {
    return [3, 1];
}

export function LedNames() {
    return ["Key 1", "Key 2", "Key 3"];
}

export function LedPositions() {
    return LED_POSITIONS;
}

export function Validate(endpoint) {
    return endpoint.usage_page === 0xFF11 &&
           endpoint.usage === 0x0002;
}

function buildPacket(colors) {
    const packet = new Array(REPORT_LENGTH).fill(0);

    packet[0] = REPORT_ID;
    packet[1] = ECHO;

    packet[4] = 0x10;
    packet[5] = 0x00;
    packet[6] = COMMAND;
    packet[7] = 0x00;

    for (let i = 0; i < 3; i++) {
        const offset = 8 + i * 4;
        const color = colors[i];

        packet[offset] = color[0] & 0xFF;
        packet[offset + 1] = color[1] & 0xFF;
        packet[offset + 2] = color[2] & 0xFF;
        packet[offset + 3] = 0xFF;
    }

    packet[2] = 0;
    packet[3] = 0;

    let sum = 0;

    for (let i = 0; i < REPORT_LENGTH; i += 2) {
        sum += packet[i] | ((packet[i + 1] ?? 0) << 8);
    }

    sum &= 0xFFFF;

    packet[2] = sum & 0xFF;
    packet[3] = (sum >> 8) & 0xFF;

    return packet;
}

export function Initialize() {
    previousPacket = null;
    device.log("SayoDevice O3C initialized");
}

export function Render() {
    const colors = [
        device.color(0, 0),
        device.color(1, 0),
        device.color(2, 0)
    ];

    const packet = buildPacket(colors);

    if (previousPacket !== null &&
        packet.every((value, index) => value === previousPacket[index])) {
        return;
    }

    device.write(packet, REPORT_LENGTH);
    previousPacket = packet;
}

export function Shutdown() {
    previousPacket = null;
}