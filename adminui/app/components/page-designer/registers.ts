import registerMiniAppHeader from "./controls/MiniAppHeader";
import registerPopAdvertise from './controls/PopAdvertise';
import registerModuleDivider from './modules/common/Divider';
import registerModuleImageText from './modules/common/ImageText';



export default function register() {
    registerMiniAppHeader();
    registerPopAdvertise();
    registerModuleDivider();
    registerModuleImageText();
}