export const cast = <T>(obj: any) => obj as unknown as T;

export class Probable<T> {

    protected readonly body: T | unknown;

    public constructor(obj: unknown) {
        this.body = obj;
    }

    public meets<K extends keyof T, R = T[K]>(key: K, callback: (value: T[K]) => R): R | null {
        try {
            const value = (this.body as T)[key];
            return callback(value);
        } catch {
            return null;
        }
    }

    public use<K extends keyof T>(key: K): T[K] | null {
        try {
            return (this.body as T)[key];
        } catch {
            return null;
        }
    }

    // public meetsAll<K extends keyof T>(...keys: Array<K>): T | null {
    //     try {
    //         for (let i: number = 0; i < keys.length; i++) {
    //             (() => (this.body as T)[keys[i]])();
    //         }
    //     } catch {
    //         return null;
    //     }

    //     return this.body as Partial<T, "">;
    // }

};


export const uncertain = function <T, K extends keyof T>(target: T, key: K) {
    delete target[key];

    const thisKey = key;

    Object.defineProperty(target, thisKey, {
        writable: true,
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(target, key, {
        get: function (this: T): T[K] {
            return this[thisKey];
        },
        set: function (this: T, newVal: T[K]): void {
            this[thisKey] = newVal;
        },
        enumerable: true,
        configurable: true
    });
};


export class Uncertain<T> {
    @uncertain
    public name: string;

    public constructor() {
        this.name = "";
    }

}


type T1 = {
    name: string;
    age: number;
    call: (a: number) => void;
    next: T1;
};

// const b = {
//     name: "b",
//     age: 16,
//     call: (a: number) => a + 1
// };

// const a = {
//     name: "sf",
//     age: 12,
//     next: b
// };

// const pa = new Probable<T1>(a);
// const pb = new Probable<T1>(b);
