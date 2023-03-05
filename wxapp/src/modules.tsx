import MenusModule from "./components/diy/modules/Menus";
import MultipleImagesModule from "./components/diy/modules/MultipleImages";
import SingleImageModule from "./components/diy/modules/SingleImage";
import DividerModule from "./components/diy/modules/Divider";
import PopAdvertise from "./components/diy/controls/PopAdvertise";
import SwiperModule from "./components/diy/modules/Swiper";
import ImageText from "./components/diy/modules/ImageText";
import GoodsListModule from "./components/diy/modules/GoodsList";
import BuyoutGoodsListModule from "./components/diy/modules/BuyoutGoodsList";
import PerformanceListModule from "./components/diy/modules/PerformanceList";
import SyncPerformanceListModule  from "./components/diy/modules/SyncPerformanceList";
import AuctionListModule from "./components/diy/modules/AuctionList";
import Title1Module from "./components/diy/modules/Title1";


const modules = {
    "IMAGE_TEXT_MODULE": ImageText,
    'SINGLE_IMAGE_MODULE': SingleImageModule,
    'MENUS_MODULE': MenusModule,
    'MULTIPLE_IMAGES_MODULE': MultipleImagesModule,
    'DIVIDER_MODULE': DividerModule,
    'POP_ADVERTISE': PopAdvertise,
    'SWIPER_MODULE': SwiperModule,
    'GOODS_LIST_MODULE': GoodsListModule,
    'BUYOUT_GOODS_LIST_MODULE': BuyoutGoodsListModule,
    'PERFORMANCE_LIST_MODULE': PerformanceListModule,
    'SYNC_PERFORMANCE_LIST_MODULE': SyncPerformanceListModule,
    'AUCTION_LIST_MODULE': AuctionListModule,
    'TITLE1_MODULE': Title1Module,
};


export default modules;
