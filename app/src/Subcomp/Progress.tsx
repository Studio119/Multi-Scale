/*
 * @Author: Antoine YANG 
 * @Date: 2020-08-22 15:29:48 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2020-08-22 17:23:55
 */

import React, { Component } from "react";


export interface ProgressProps {
    width: number;
    height: number;
    padding: [number, number];
    hideAfterCompleted: boolean;
    styleContainer?: React.CSSProperties;
    styleBox?: React.CSSProperties;
    styleBar?: React.CSSProperties;
};

export interface ProgressState {
    total: number;
    eached: number;
};

export class Progress extends Component<ProgressProps, ProgressState, {}> {
    protected eached: number;

    public constructor(props: ProgressProps) {
        super(props);
        this.state = {
            total: 0,
            eached: 0
        };

        this.eached = 0;
    }

    public render(): JSX.Element {
        const width: number = this.props.width - this.props.padding[1] * 2;
        const height: number = this.props.height - this.props.padding[0] * 2;
        const r: number = Math.sqrt(height / 2 + 36);

        return (
            <div style={{
                position: 'absolute',
                width: this.props.width,
                height: this.props.height,
                top: '0px',
                ...this.props.styleContainer,
                display: this.props.hideAfterCompleted && (
                    this.state.eached === this.state.total
                ) ? "none" : undefined
            }} >
                <svg width={ this.props.width } height={ this.props.height }
                style={{}} >
                    <rect key="box"
                    x={ this.props.padding[1] } y={ this.props.padding[0] }
                    width={ width } height={ height }
                    rx={ r } ry={ r }
                    style={{
                        fill: "#F2DFFF80",
                        ...this.props.styleBox
                    }} />
                    <rect key="bar"
                    x={ this.props.padding[1] } y={ this.props.padding[0] }
                    width={ width * this.state.eached / (this.state.total | 1) }
                    height={ height }
                    style={{
                        fill: "rgb(170,255,162)",
                        ...this.props.styleBar
                    }} />
                    <rect key="border"
                    x={ this.props.padding[1] } y={ this.props.padding[0] }
                    width={ width } height={ height }
                    rx={ r } ry={ r }
                    style={{
                        stroke: "#F4E6FF",
                        strokeWidth: 2,
                        ...this.props.styleBox,
                        fill: "none"
                    }} />
                </svg>
            </div>
        );
    }

    public start(total: number): void {
        this.eached = 0;
        this.setState({
            total: total,
            eached: this.eached
        });
    }

    public next(): void {
        this.eached += 1;
        this.setState({
            eached: this.eached
        });
    }

    public close(): void {
        this.eached = 0;
        this.setState({
            total: 0,
            eached: 0
        });
    }
};
