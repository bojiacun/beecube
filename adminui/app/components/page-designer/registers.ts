import registerMiniAppHeader from "./controls/MiniAppHeader";
import registerPopAdvertise from './controls/PopAdvertise';
import registerModuleDivider from './modules/common/Divider';
import registerModuleImageText from './modules/common/ImageText';
import registerModuleMenus from './modules/common/Menus';
import registerModuleMultipleImages from './modules/common/MultipleImages';
import registerModuleSingleImage from './modules/common/SingleImage';
import registerModuleSwiper from './modules/common/Swiper';
import registerModuleGoodsList from './modules/paimai/GoodsList';



export default function register(module='') {
    //@ts-ignore
    registerMiniAppHeader(module);
    //@ts-ignore
    registerPopAdvertise(module);
    //@ts-ignore
    registerModuleDivider(module);
    //@ts-ignore
    registerModuleImageText(module);
    //@ts-ignore
    registerModuleMenus(module);
    //@ts-ignore
    registerModuleSwiper(module);
    //@ts-ignore
    registerModuleMultipleImages(module);
    //@ts-ignore
    registerModuleSingleImage(module);
    //@ts-ignore
    registerModuleGoodsList(module);
}