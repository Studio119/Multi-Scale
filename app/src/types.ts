/*
 * @Author: Kanata You 
 * @Date: 2020-09-23 10:33:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-20 00:39:25
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
