import {Text, View} from "@tarojs/components";
import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import './index.scss';
import {setPosition} from "../../store/actions";

const QQMapWX = require('../../utils/qqmap-wx-jssdk.min');


export declare interface WeatherProps {
    mapKey: string,
    site?: any,
    dispatch: Function
}


const Weather: React.FC<WeatherProps> = (props) => {
    const {mapKey, dispatch} = props;
    const [loading, setLoading] = useState(true);
    // const [weather, setWeather] = useState('');
    // const [temperature, setTemperature] = useState('');
    const [city, setCity] = useState('');


    useEffect(() => {
        if(mapKey) {
            setLoading(true);
            const qqmapSdk = new QQMapWX({key: mapKey});
            qqmapSdk.reverseGeocoder({
                success(res) {
                    setLoading(false);
                    dispatch(setPosition(res.result.location));
                    setCity(res.result.address_component.city);
                },
                fail(err) {
                    setLoading(false);
                    console.error(err);
                }
            });
        }
    }, [mapKey]);

    if(loading) {
        return <></>
    }

    return (
        <>
            {
                !loading &&
                <View className='weather'>
                    {/*{weather === '多云' && <Image src="../../assets/images/index/duoyun.png"/>}*/}
                    {/*{weather === '晴' && <Image src="../../assets/images/index/qing.png"/>}*/}
                    {/*{*/}
                    {/*    weather != '多云' && weather != '晴' && weather != '阴' &&*/}
                    {/*    <Image src="../../assets/images/index/dayu.png"/>*/}
                    {/*}*/}
                    {/*{weather === '阴' && <Image src="../../assets/images/index/yin.png"/>}*/}
                    {/*<View>{temperature}℃</View>*/}
                    <Text className="cuIcon-location" />
                    <Text>{city}</Text>
                </View>
            }
        </>
    );
}

Weather.propTypes = {
    mapKey: PropTypes.string.isRequired,
    site: PropTypes.any
}

Weather.defaultProps = {
    site: null
}



export default Weather
