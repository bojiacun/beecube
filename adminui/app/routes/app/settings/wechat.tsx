import WechatSettingsEditor from "~/pages/app/settings/WechatSettingsEditor";
import {withPageLoading} from "~/utils/components";



const AppSettingsWechat = () => {
    return (
        <WechatSettingsEditor />
    );
}

export default withPageLoading(AppSettingsWechat);