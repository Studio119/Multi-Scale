/*
 * @Author: Kanata You 
 * @Date: 2020-09-23 11:49:47 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-21 09:53:18
 */

import axios from "axios";


export type geojsonData = {
    adcode: number;
    name: string | null;
    level: "province" | "district";
    geometry: geometry<"MultiPolygon">;
    children: Array<number>;
};

export type geojsonLocal = Omit<geojsonData, "children">;

export type geometry<T extends ("MultiPolygon" | "?")> = {
    type: T;
    coordinates: (
        T extends "MultiPolygon" ? Array<Array<Array<[number, number]>>> : any
    );
};

export const getGeoJSON = async (
    adcode: string | number, callback: (geojson: Array<geojsonData>) => void
): Promise<Array<geojsonData>> => {
    let nodes: Array<geojsonData> = [];

    const data: Array<geojsonData> = (
        await axios.get<Array<geojsonLocal>>(`/geojson/${ adcode }`)
    ).data.map(d => {
        return {
            ...d,
            children: []
        };
    });

    nodes.concat(data);

    callback(data);

    data.forEach(async d => {
        if (d.name) {
            try {
                const children: Array<geojsonData> = await getGeoJSON(
                    d.adcode, callback
                );

                nodes.concat(children);

                d.children.concat(children.map(c => c.adcode));
            } catch {
                return;
            }
        }
    });
    
    return nodes;
};
