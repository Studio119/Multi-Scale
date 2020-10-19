/*
 * @Author: Kanata You 
 * @Date: 2020-09-23 10:33:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-19 20:08:23
 */

export declare namespace FileData {
    export type nCov19 = {
        date: string,
        country: string,
        countryCode: string,
        province: string | null,
        provinceCode: string | null,
        city: string | null,
        cityCode: string | null,
        confirmed: null,
        suspected: null,
        cured: null,
        dead: null
    };
};

export type statistics = {
    id: number;
    name: string;
    value: number;
};


export const isBasicTyped = (obj: any) => {
    const bType = typeof obj;
    return bType !== "function" && bType !== "object";
};

export type validInstance<T, CurrentType> = CurrentType extends T ? true : false;

export const equalsInstance = <T, K>(obj: K) => {
    return validInstance<T, K> extends true;
};
