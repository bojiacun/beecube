import LayoutVertical from "~/layouts/layout-vertical/LayoutVertical";
import {useContext} from "react";
import ThemeContext from "themeConfig";


export default function Console() {
    const {startPageLoading, stopPageLoading} = useContext(ThemeContext);
    console.log(startPageLoading, stopPageLoading);
    return (
        <LayoutVertical startPageLoading={startPageLoading} stopPageLoading={stopPageLoading}>

        </LayoutVertical>
    );
}