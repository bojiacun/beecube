import MenusModule from "./components/diy/modules/Menus";
import MultipleImagesModule from "./components/diy/modules/MultipleImages";
import SingleImageModule from "./components/diy/modules/SingleImage";
import DividerModule from "./components/diy/modules/Divider";
import PopAdvertise from "./components/diy/controls/PopAdvertise";
import SwiperModule from "./components/diy/modules/Swiper";
import ImageText from "./components/diy/modules/ImageText";


const modules = {
    "IMAGE_TEXT_MODULE": ImageText,
    'SINGLE_IMAGE_MODULE': SingleImageModule,
    'MENUS_MODULE': MenusModule,
    'MULTIPLE_IMAGES_MODULE': MultipleImagesModule,
    'DIVIDER_MODULE': DividerModule,
    'POP_ADVERTISE': PopAdvertise,
    'SWIPER_MODULE': SwiperModule,
};


export default modules;
