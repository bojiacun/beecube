import MenusModule from "./components/diy/modules/Menus";
import MultipleImagesModule from "./components/diy/modules/MultipleImages";
import SearchAndScanner from "./components/diy/modules/SearchAndScanner";
import SingleImageModule from "./components/diy/modules/SingleImage";
import CurrentSiteModule from "./components/diy/modules/CurrentSite";
import SiteNoticeModule from "./components/diy/modules/Notice";
import SubscribeGoodsListModule from "./components/diy/modules/SubscribeGoodsList";
import DividerModule from "./components/diy/modules/Divider";
import ShopGoodsListModule from "./components/diy/modules/ShopGoodsList";
import UserProfileModule from "./components/diy/modules/UserProfile";
import UserHeader from "./components/diy/controls/UserHeader";
import ShopSecKillActivityModule from "./components/diy/modules/ShopSkillActivity";
import LiveListModule from "./components/diy/modules/LiveList";
import PopAdvertise from "./components/diy/controls/PopAdvertise";
import ActivityListModule from "./components/diy/modules/Activity";
import ActivityRecordListModule from "./components/diy/modules/ActivityRecordList";
import SwiperModule from "./components/diy/modules/Swiper";
import ImageText from "./components/diy/modules/ImageText";
import LiveHistoryListModule from "./components/diy/modules/LiveHistoryList";
import LiveSearch from "./components/diy/modules/LiveSearch";
import UserReadStatisticsModule from "./components/diy/modules/UserReadStatistics";


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
