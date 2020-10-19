/*
 * @Author: Antoine YANG 
 * @Date: 2020-08-22 16:44:31 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2020-08-22 18:05:41
 */


// 映射规则
const HilbertMap = {
    a: {
        "0,0": [0, 'd'],
        "0,1": [1, 'a'],
        "1,0": [3, 'b'],
        "1,1": [2, 'a']
    },
    b: {
        "0,0": [2, 'b'],
        "0,1": [1, 'b'],
        "1,0": [3, 'a'],
        "1,1": [0, 'c']
    },
    c: {
        "0,0": [2, 'c'],
        "0,1": [3, 'd'],
        "1,0": [1, 'c'],
        "1,1": [0, 'b']
    },
    d: {
        "0,0": [0, 'a'],
        "0,1": [3, 'c'],
        "1,0": [1, 'd'],
        "1,1": [2, 'd']
    },
};

const HilbertMapReverse = {
    a: {
        0: [0, 0, 'd'],
        1: [0, 1, 'a'],
        3: [1, 0, 'b'],
        2: [1, 1, 'a']
    },
    b: {
        2: [0, 0, 'b'],
        1: [0, 1, 'b'],
        3: [1, 0, 'a'],
        0: [1, 1, 'c']
    },
    c: {
        2: [0, 0, 'c'],
        3: [0, 1, 'd'],
        1: [1, 0, 'c'],
        0: [1, 1, 'b']
    },
    d: {
        0: [0, 0, 'a'],
        3: [0, 1, 'c'],
        1: [1, 0, 'd'],
        2: [1, 1, 'd']
    }
};

export const HilbertEncode = (lng: number, lat: number, level: number): string => {
    let lngRange: [number, number] = [-180.0, 180.0];
    let latRange: [number, number] = [-90.0, 90.0]

    let curSquare: 'a' | 'b' | 'c' | 'd' = 'a';

    let position: string = "";

    for (let i: number = level - 1; i >= 0; i--) {
        const lngMid: number = (lngRange[0] + lngRange[1]) / 2;
        const latMid: number = (latRange[0] + latRange[1]) / 2;

        let quadX: 1 | 0 = lng >= lngMid ? 1 : 0;
        lngRange[1 - quadX] = lngMid;
        let quadY: 1 | 0 = lat >= latMid ? 1 : 0;
        latRange[1 - quadY] = latMid;

        let quadPos: 0 | 1 | 2 | 3 = 0;

        [quadPos, curSquare] = HilbertMap[curSquare][
            `${ quadX },${ quadY }` as unknown as "0,0" | "0,1" | "1,0" | "1,1"
        ] as [0 | 1 | 2 | 3, 'a' | 'b' | 'c' | 'd'];

        position += (quadPos >= 2 ? "1" : "0") + (quadPos % 2 ? "1" : "0");
    }

    return position || "0";
};

export const HilbertDecode = (code: string): { lng: number; lat: number; } => {
    let lngRange: [number, number] = [-180.0, 180.0];
    let latRange: [number, number] = [-90.0, 90.0];

    let curSquare: 'a' | 'b' | 'c' | 'd' = 'a';

    for (let i: number = 0; i < code.length; i += 2) {
        const lngMid: number = (lngRange[0] + lngRange[1]) / 2;
        const latMid: number = (latRange[0] + latRange[1]) / 2;

        const quadPos: 0 | 1 | 2 | 3 = parseInt(code.substr(i, 2), 2) as 0 | 1 | 2 | 3;
        let quadX: 1 | 0 = 0;
        let quadY: 1 | 0 = 0;

        [quadX, quadY, curSquare] = HilbertMapReverse[curSquare][quadPos] as [1 | 0, 1 | 0, 'a' | 'b' | 'c' | 'd'];

        lngRange[1 - quadX] = lngMid;
        latRange[1 - quadY] = latMid;
    }

    return {
        lng: (lngRange[0] + lngRange[1]) / 2,
        lat: (latRange[0] + latRange[1]) / 2
    };
};

export const HilbertDecodeValidArea = (code: string): {
    lng: [number, number];
    lat: [number, number];
} => {
    let lngRange: [number, number] = [-180.0, 180.0];
    let latRange: [number, number] = [-90.0, 90.0];

    let curSquare: 'a' | 'b' | 'c' | 'd' = 'a';

    for (let i: number = 0; i < code.length; i += 2) {
        const lngMid: number = (lngRange[0] + lngRange[1]) / 2;
        const latMid: number = (latRange[0] + latRange[1]) / 2;

        const quadPos: 0 | 1 | 2 | 3 = parseInt(code.substr(i, 2), 2) as 0 | 1 | 2 | 3;
        let quadX: 1 | 0 = 0;
        let quadY: 1 | 0 = 0;

        [quadX, quadY, curSquare] = HilbertMapReverse[curSquare][quadPos] as [1 | 0, 1 | 0, 'a' | 'b' | 'c' | 'd'];

        lngRange[1 - quadX] = lngMid;
        latRange[1 - quadY] = latMid;
    }

    return {
        lng: lngRange,
        lat: latRange
    };
};
