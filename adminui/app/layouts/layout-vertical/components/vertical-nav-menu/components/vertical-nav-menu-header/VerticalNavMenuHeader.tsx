import {canViewVerticalNavMenuHeader} from "~/libs/acl/utils";
import {MoreHorizontal} from "react-feather";
import {useTranslation} from "react-i18next";


const VerticalNavMenuHeader = (props:any) => {
    const {item} = props;
    const {t} = useTranslation();

    if(canViewVerticalNavMenuHeader(item)) {
        return (
            <li className={'navigation-header text-truncate'}>
                <span>{t(item.header)}</span>
                <MoreHorizontal size={18} />
            </li>
        );
    }
    return (
        <>
            <span>{t(item.header)}</span>
            <MoreHorizontal size={18} />
        </>
    );
}

export default VerticalNavMenuHeader;
