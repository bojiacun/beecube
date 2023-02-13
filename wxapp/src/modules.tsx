import MenusModule from "./components/DiyPage/modules/Menus";
import MultipleImagesModule from "./components/DiyPage/modules/MultipleImages";
import SearchAndScanner from "./components/DiyPage/modules/SearchAndScanner";
import SingleImageModule from "./components/DiyPage/modules/SingleImage";
import CurrentSiteModule from "./components/DiyPage/modules/CurrentSite";
import SiteNoticeModule from "./components/DiyPage/modules/Notice";
import SubscribeGoodsListModule from "./components/DiyPage/modules/SubscribeGoodsList";
import DividerModule from "./components/DiyPage/modules/Divider";
import ShopGoodsListModule from "./components/DiyPage/modules/ShopGoodsList";
import UserProfileModule from "./components/DiyPage/modules/UserProfile";
import UserHeader from "./components/DiyPage/controls/UserHeader";
import ShopSecKillActivityModule from "./components/DiyPage/modules/ShopSkillActivity";
import LiveListModule from "./components/DiyPage/modules/LiveList";
import PopAdvertise from "./components/DiyPage/controls/PopAdvertise";
import ActivityListModule from "./components/DiyPage/modules/Activity";
import ActivityRecordListModule from "./components/DiyPage/modules/ActivityRecordList";
import SwiperModule from "./components/DiyPage/modules/Swiper";
import ImageText from "./components/DiyPage/modules/ImageText";
import LiveHistoryListModule from "./components/DiyPage/modules/LiveHistoryList";
import LiveSearch from "./components/DiyPage/modules/LiveSearch";
import UserReadStatisticsModule from "./components/DiyPage/modules/UserReadStatistics";
const modules = {
    "IMAGE_TEXT_MODULE": ImageText,
    "SEARCH_AND_SCANNER_MODULE": SearchAndScanner,
    'SINGLE_IMAGE_MODULE': SingleImageModule,
    'MENUS_MODULE': MenusModule,
    'MULTIPLE_IMAGES_MODULE': MultipleImagesModule,
    'CURRENT_SITE_MODULE': CurrentSiteModule,
    'SITE_NOTICE_MODULE': SiteNoticeModule,
    'SUBSCRIBE_GOODS_LIST_MODULE': SubscribeGoodsListModule,
    'DIVIDER_MODULE': DividerModule,
    'SHOP_GOODS_LIST_MODULE': ShopGoodsListModule,
    'USER_PROFILE_MODULE': UserProfileModule,
    'USER_HEADER': UserHeader,
    'SHOP_SECKILL_ACTIVITY_MODULE': ShopSecKillActivityModule,
    'LIVE_LIST_MODULE': LiveListModule,
    'LIVE_SEARCH_MODULE': LiveSearch,
    'POP_ADVERTISE': PopAdvertise,
    'ACTIVITY_LIST_MODULE': ActivityListModule,
    'ACTIVITY_RECORD_LIST_MODULE': ActivityRecordListModule,
    'SWIPER_MODULE': SwiperModule,
    'LIVE_HISTORY_LIST_MODULE' : LiveHistoryListModule,
    'USER_READ_STATISTICS_MODULE': UserReadStatisticsModule,
};


export default modules;
