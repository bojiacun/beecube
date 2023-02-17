import registerMiniAppHeader from "./controls/MiniAppHeader";
import registerPopAdvertise from './controls/PopAdvertise';
import registerModuleDivider from './modules/common/Divider';
import registerModuleImageText from './modules/common/ImageText';
import registerModuleMenus from './modules/common/Menus';
import registerModuleMultipleImages from './modules/common/MultipleImages';
import registerModuleSingleImage from './modules/common/SingleImage';
import registerModuleSwiper from './modules/common/Swiper';



export default function register(module=null) {
    registerMiniAppHeader(module);
    registerPopAdvertise(module);
    registerModuleDivider(module);
    registerModuleImageText(module);
    registerModuleMenus(module);
    registerModuleSwiper(module);
    registerModuleMultipleImages(module);
    registerModuleSingleImage(module);
}