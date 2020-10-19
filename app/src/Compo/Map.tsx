/*
 * @Author: Antoine YANG 
 * @Date: 2020-08-20 22:43:10 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-19 19:37:15
 */

import React, { Component } from "react";
import MapBox from "../react-mapbox/MapBox";
import axios, { AxiosResponse } from "axios";
import Color from "../Design/Color";
import { Progress } from "../Subcomp/Progress";
import { debounced } from "../Tools/decorator";
import { statistics, FileData } from "../types";
import encodePath from "../Tools/pathEncoder";
import { getGeoJSON, geojsonData } from "../Tools/getGeoJSON";
import { findOne } from "../Tools/YArray";


const colorize = (val: number) => {
    return Color.toRgb(`hsl(${ 120 + Math.floor(Math.pow(val, 0.7) * 240) },1,0.5)`)
};

export interface MapProps {
    id: string;
    width: number;
    height: number;
};

export interface MapState {
    data: Array<statistics>;
    paths: Array<geojsonData>;
};

export class Map extends Component<MapProps, MapState, {}> {

    protected map: React.RefObject<MapBox>;

    protected canvasScatter: React.RefObject<HTMLCanvasElement>;
    protected ctxScatter: CanvasRenderingContext2D | null;

    protected progress: React.RefObject<Progress>;
    protected timers: Array<NodeJS.Timeout>;

    public constructor(props: MapProps) {
        super(props);
        this.state = {
            data: [],
            paths: []
        };

        this.repaint = debounced(this.repaint.bind(this));

        this.map = React.createRef<MapBox>();
        this.canvasScatter = React.createRef<HTMLCanvasElement>();
        this.ctxScatter = null;

        this.progress = React.createRef<Progress>();
        this.timers = [];
    }

    public render(): JSX.Element {
        return (
            <div>
                <div key="tools" style={{
                    display: "flex",
                    width: this.props.width - 18,
                    border: "1px solid rgb(28,28,28)",
                    padding: "5.5px 8px 6.5px",
                    textAlign: "left",
                    backgroundColor: "rgb(250,246,248)",
                    fontSize: "14px",
                    letterSpacing: "-0.2px"
                }} >
                    <label key="refresh" title="refresh" style={{
                        display: "inline-block",
                        width: "10px",
                        height: "23px",
                        boxShadow: "2px 2px 2px #00000060",
                        border: "1px solid #ddd",
                        cursor: "pointer"
                    }} onClick={
                        () => {
                            this.repaint();
                        }
                    } />
                    <label key="modeSwitch" title="display mode" style={{
                        display: "inline-block",
                        width: "64px",
                        height: "18px",
                        padding: "3.5px 4px 1.5px",
                        boxShadow: "2px 2px 2px #00000060",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        cursor: "pointer"
                    }} >
                        { "MapView" }
                    </label>
                </div>
                <div key="mapbox-container" id={ this.props.id } style={{
                    display: "block",
                    width: this.props.width,
                    height: this.props.height,
                    backgroundColor: "rgb(27,27,27)"
                }} >
                    <MapBox ref={ this.map } containerID={ this.props.id }
                    accessToken="pk.eyJ1IjoiaWNoZW4tYW50b2luZSIsImEiOiJjazF5bDh5eWUwZ2tiM2NsaXQ3bnFvNGJ1In0.sFDwirFIqR4UEjFQoKB8uA"
                    center={ [104.2, 38.2] } zoom={ 3.1 } allowInteraction={ true }
                    styleURL="mapbox://styles/ichen-antoine/cke5cvr811xb419mi5hd9otc3"
                    minZoom={ 1 } maxZoom={ 15 }
                    onBoundsChanged={ () => {
                        this.repaint();
                    } } />
                </div>
                <div key="canvas-container" style={{
                    display: "block",
                    width: this.props.width,
                    height: this.props.height,
                    top: 0 - this.props.height,
                    position: "relative",
                    pointerEvents: "none"
                }} >
                    <canvas ref={ this.canvasScatter }
                    width={ this.props.width } height={ this.props.height }
                    style={{}} />
                </div>
                <Progress ref={ this.progress }
                width={ this.props.width * 0.6 } height={ 18 }
                padding={ [0, 0] } hideAfterCompleted={ true }
                styleContainer={{
                    top: this.props.height * 0.92 - 9,
                    left: this.props.width * 0.2
                }} />
            </div>
        );
    }

    public componentDidMount(): void {
        this.ctxScatter = this.canvasScatter.current!.getContext("2d");

        getGeoJSON(100000, this.add.bind(this));

        this.getDataFile<Array<FileData.nCov19>>(
            "Wuhan-2019-nCoV.json"
        ).then(res => {
            this.load(this.getCurData(res.data));
        });
    }

    public async getDataFile<T>(filename: string): Promise<AxiosResponse<T>> {
        return await axios.get<T>(
            `/local_file/${ encodePath(`public/data/${ filename }`) }`
        );
    }

    public getCurData(data: Array<FileData.nCov19>): Array<statistics> {
        let dict: {[id: string]: { name: string; value: number; };} = {};

        data.forEach(d => {
            if (d.countryCode === "CN") {
                const id: string = d.cityCode || d.provinceCode || "CN";
                if (dict[id]) {
                    dict[id].value = Math.max(
                        dict[id].value, d.confirmed || 0
                    );
                } else {
                    dict[id] = {
                        name: d.city || d.province || "中国",
                        value: d.confirmed || 0
                    };
                }
            }
        });
        
        let box: Array<statistics> = [];

        Object.entries(dict).forEach(e => {
            box.push({
                id: parseInt(e[0]),
                name: e[1].name,
                value: e[1].value
            });
        });

        return box;
    }

    public load(data: Array<statistics>): void {
        const max: number = Math.max(...data.map(d => d.value));

        this.setState({
            data: data.map(d => {
                return {
                    ...d,
                    value: d.value / max
                };
            })
        });
    }

    public add(geojson: Array<geojsonData>): void {
        this.setState({
            paths: this.state.paths.concat(geojson)
        });
    }

    public componentWillUnmount(): void {
        this.clearTimers();
    }

    public componentDidUpdate(): void {
        this.repaint();
    }

    protected clearTimers(): void {
        this.progress.current?.close();
        this.timers.forEach(timer => {
            clearTimeout(timer);
        });
        this.timers = [];
    }

    protected paintPath(data: statistics): void {
        this.ctxScatter!.fillStyle = colorize(data.value);
        (window as any)['a'] = () => console.log(this.state.paths);
        const path = findOne(this.state.paths, path => (
            path.adcode === data.id || path.name === data.name
        ));
        if (path) {
            path.geometry.coordinates[0].forEach(cors => {
                this.ctxScatter!.beginPath();
                cors.forEach((cor, i) => {
                    const pos = this.map.current!.project({
                        lng: cor[0],
                        lat: cor[1]
                    });

                    if (i) {
                        this.ctxScatter!.lineTo(pos.x, pos.y);
                    } else {
                        this.ctxScatter!.moveTo(pos.x, pos.y);
                    }
                });
                this.ctxScatter!.globalAlpha = 0.2;
                this.ctxScatter!.fill();
                this.ctxScatter!.closePath();
                this.ctxScatter!.globalAlpha = 1;
            });
        }
    }
    
    /**
     * 重绘数据，内部封装绘制模式的分支.
     *
     * @returns {void}
     * @memberof Map
     */
    public repaint(): void {
        this.ctxScatter!.clearRect(0, 0, this.props.width, this.props.height);
        this.clearTimers();
        if (this.map.current) {
            if (!this.map.current!.ready()) {
                setTimeout(() => {
                    this.repaint();
                }, 200);
                return;
            }
            // TODO: 绘制
            this.state.data.forEach((d, i) => {
                this.timers.push(
                    setTimeout(() => {
                        this.paintPath(d);
                    }, i + 1)
                );
            });
        }
    }

};
