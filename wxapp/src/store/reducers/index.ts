import { combineReducers } from 'redux';
import context, { Context } from '../../context';
import {
  SET_CONTEXT, SET_GEO,
  SET_PAGELOADING, SET_POSITION,
  SET_REFERER,
  SET_SETTINGS,
  SET_SIETINFO, SET_SITE,
  SET_SYSTEMINFO, SET_TABS,
  SET_USERINFO
} from '../constants';

export default combineReducers({
    context : (state: Context = context, action: any) => {
        let result;
        switch(action.type) {
            case SET_USERINFO:
                result = {...state, userInfo: action.payload};
                Object.assign(context, result);
                return result;
            case SET_REFERER:
                result = {...state, referer: action.payload};
                Object.assign(context, result);
                return result;
            case SET_SIETINFO:
                result = {...state, siteInfo: action.payload};
                Object.assign(context, result);
                return result;
            case SET_SETTINGS:
                result = {...state, settings: action.payload};
                Object.assign(context, result);
                return result;
            case SET_SYSTEMINFO:
                result = {...state, systemInfo: action.payload};
                Object.assign(context, result);
                return result;
            case SET_CONTEXT:
                result = {...state, ...action.payload};
                Object.assign(context, result);
                return result;
            case SET_POSITION:
                result = {...state, position: action.payload};
                Object.assign(context, result);
                return result;
            case SET_SITE:
                result = {...state, site: action.payload};
                Object.assign(context, result);
                return result;
            case SET_GEO:
                result = {...state, ...action.payload};
                Object.assign(context, result);
                return result;
          case SET_TABS:
                result = {...state, tabs: action.payload};
                Object.assign(context, result);
                return result;
            default:
                return state;
        }
    },

    pageLoading: (state: boolean = true, action: any) => {
        switch (action.type) {
            case SET_PAGELOADING:
                return action.payload;
            default:
                return state;
        }
    }
});
