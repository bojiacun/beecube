import WxappSettingsEditor from "~/pages/app/settings/WxappSettingsEditor";
import {withPageLoading} from "~/utils/components";


const AppSettingsWxapp= () => {
    return (
        <WxappSettingsEditor />
    );
}

export default withPageLoading(AppSettingsWxapp);