import React, { MouseEventHandler, useState } from "react";
import { Col, Row } from "react-bootstrap";
import classNames from "classnames";



export declare interface AttributeTabProps {
    tabs: string[];
    children: any;
}
export declare interface ModuleType {
    key: string;
    name: string;
    group: string;
    image: any;
    designer: React.FunctionComponent,
    settings: React.FunctionComponent,
    data: any;
}
export declare interface ControlType {
    key: string;
    name: string;
    designer: React.FunctionComponent,
    settings: React.FunctionComponent,
    required?: boolean;
    data: any;
}

export const AttributeTabs: React.FC<AttributeTabProps> = (props) => {
    const { tabs, children} = props;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const tabChange = (newIndex: number) => {
        setActiveIndex(newIndex);
    }
    // const tabChildren = children?.[activeIndex];
    return (
        <>
            <Row className={'tabs'}>
                {tabs.map((item, index) => {
                    return (
                        <Col className={classNames(activeIndex === index ? 'active':'tab')} key={index} onClick={() => tabChange(index)}>{item}</Col>
                    );
                })}
            </Row>
            {children?.map((child: React.ReactNode, index: number) => {
                return (
                    <div key={'tabs_'+index} style={{display: activeIndex==index? 'block': 'none'}}>
                        {child}
                    </div>
                );
            })}

        </>
    );
}


export declare interface ComponentProps {
    data?: any,
    onActive: (component: any) => void;
    placeholder?: boolean;
    index?: number;
    isPreview?: boolean;
    className?: string;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
    dataKey?: string;
}

const withDesignComponent = (key: string, Component: any) => {
    return class extends React.Component<ComponentProps> {
        constructor(props: ComponentProps) {
            super(props);
        }

        shouldComponentUpdate(nextProps: any) {
            if (nextProps.isPreview != this.props.isPreview) {
                return true;
            }
            if (nextProps.data != this.props.data) {
                return true;
            }
            if (nextProps.placeholder != this.props.placeholder) {
                return true;
            }
            if (nextProps.className != this.props.className) {
                return true;
            }
            return false;
        }

        render() {
            const { onActive, placeholder, index, className, onMouseEnter, onMouseLeave, isPreview, data, dataKey } = this.props;
            return (
                <>
                    <div className={className} data-index={index} onClickCapture={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onActive?.(key);
                    }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        <span className={'xline'}></span>
                        <span className={'xline'}></span>
                        <span className={'xline'}></span>
                        <span className={'xline'}></span>
                        <Component index={index} data={data} isPreview={isPreview} data-key={dataKey} />
                    </div>
                    {placeholder && <div className={'placeholder'} data-index={index! + 1} data-type="placeholder">放在这里</div>}
                </>
            );
        }
    }
}
const withSettingsComponent = (key: string, Component: React.FunctionComponent) => {
    return class extends React.Component<ComponentProps> {
        constructor(props: ComponentProps) {
            super(props);
        }

        shouldComponentUpdate(nextProps: any) {
            if (nextProps.data != this.props.data) {
                return true;
            }
            return false;
        }

        render() {
            const { ...rest } = this.props;
            return (
                //@ts-ignore
                <Component {...rest} />
            );
        }
    }
}

const registeredModules: any = {};
const registeredControls: any = {};
const registerModule = (key: string, name: string, image: any, group: string, designer: React.FunctionComponent, settings: React.FunctionComponent, data: any) => {
    if (registeredModules[key]) {
        // throw new Error("组件注册失败，已有同名组件");
    }
    registeredModules[key] = {
        key,
        name,
        group,
        image,
        designer: withDesignComponent(key, designer),
        settings: withSettingsComponent(key, settings),
        data
    };
}



const registerControl = (key: string, required: boolean, name: string, designer: React.FunctionComponent, settings: React.FunctionComponent, data: any) => {
    if (registeredControls[key]) {
        // throw new Error("组件注册失败，已有同名组件");
    }
    console.log('register control', key);
    registeredControls[key] = { key, required, name, designer: withDesignComponent(key, designer), settings: withSettingsComponent(key, settings), data };
}

const getControl = (key: string) => {
    return registeredControls[key];
}

const getControls = (): ControlType[] => {
    let controls: ControlType[] = [];
    for (let key in registeredControls) {
        controls.push(registeredControls[key]);
    }
    return controls.sort((a,b)=>{
        if(a.name < b.name) {
            return 1;
        }
        if(a.name > b.name) {
            return -1;
        }
        return 0;
    });
}
const getModule = (key: string) => {
    return registeredModules[key];
}
const getModules = (): ModuleType[] => {
    let modules: ModuleType[] = [];
    for (let key in registeredModules) {
        modules.push(registeredModules[key]);
    }
    return modules;
}

const presetColors = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#F5F5F5', '#FFFFFF', 'transparent'];


export {
    registerModule,
    registerControl,
    getModule,
    getControl,
    getControls,
    getModules,
    withDesignComponent,
    withSettingsComponent,
    presetColors,
};
