import Taro from "@tarojs/taro";

const indexOf = (arr, value) => {
  let exists = false;
  arr.forEach(v => {
    if(value.match(v)) {
      exists = true;
    }
  })
  return exists;
}

export default {
  resolveUrl : (url:string)=>{
    return url;
  },
  convertWebStyle : (style) => {
    style = {...style};
    if(style.paddingLeft) {
      style.paddingLeft = Taro.pxTransform(style.paddingLeft);
    }
    if(style.paddingRight) {
      style.paddingRight = Taro.pxTransform(style.paddingRight);
    }
    if(style.paddingBottom) {
      style.paddingBottom = Taro.pxTransform(style.paddingBottom);
    }
    if(style.paddingTop) {
      style.paddingTop = Taro.pxTransform(style.paddingTop);
    }


    if(style.marginLeft) {
      style.marginLeft = Taro.pxTransform(style.marginLeft);
    }
    if(style.marginRight) {
      style.marginRight = Taro.pxTransform(style.marginRight);
    }
    if(style.marginBottom) {
      style.marginBottom = Taro.pxTransform(style.marginBottom);
    }
    if(style.marginTop) {
      style.marginTop = Taro.pxTransform(style.marginTop);
    }

    if(style.fontSize) {
      style.fontSize = Taro.pxTransform(style.fontSize);
    }
    if(style.borderRadius && !'%'.match(style.borderRadius)) {
      style.borderRadius = Taro.pxTransform(style.borderRadius);
    }

    if(style.width && !'%'.match(style.width)) {
      style.width = Taro.pxTransform(style.width);
    }
    if(style.height && !'%'.match(style.height)) {
      style.height = Taro.pxTransform(style.height);
    }

    return style;
  },
  gotoLink : (link) => {
    if(!indexOf([], link)) {
      Taro.navigateTo({url: link}).then();
    }
    else {
      Taro.switchTab({url: link}).then();
    }
  },
  indexOf
}
