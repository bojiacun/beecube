import registerMiniAppHeader from "./controls/MiniAppHeader";
import registerPopAdvertise from './controls/PopAdvertise';
import registerModuleDivider from './modules/common/Divider';
import registerModuleImageText from './modules/common/ImageText';
import registerModuleMenus from './modules/common/Menus';
import registerModuleMultipleImages from './modules/common/MultipleImages';
import registerModuleSingleImage from './modules/common/SingleImage';
import registerModuleSwiper from './modules/common/Swiper';
import registerSearchBarModuleSwiper from './modules/common/SearchAndScaner';
import registerModuleGoodsList from './modules/paimai/GoodsList';
import registerModuleBuyoutGoodsList from './modules/paimai/BuyoutGoodsList';
import registerModulePerformanceList from './modules/paimai/PerformanceList';
import registerModulePublicPerformanceList from './modules/paimai/PublicPerformanceList';
import registerModuleLiveRoomList from './modules/paimai/LiveRoomList';
import registerModuleSyncPerformanceList from './modules/paimai/SyncPerformanceList';
import registerModuleAuctionList from './modules/paimai/AuctionList';
import registerModuleTitle1 from './modules/paimai/Title1';
import registerModuleViewMore from './modules/paimai/ViewMore';



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
    registerModuleBuyoutGoodsList(module);
    registerModulePerformanceList(module);
    registerModuleAuctionList(module);
    registerModuleSyncPerformanceList(module);
    registerModulePublicPerformanceList(module);
    registerModuleTitle1(module);
    registerModuleViewMore(module);
    //@ts-ignore
    registerSearchBarModuleSwiper(module);
    registerModuleLiveRoomList(module);
}