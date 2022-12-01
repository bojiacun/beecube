import {useLocation} from "react-router";
import {withPageLoading} from "~/utils/components";


const IframePage = (props: any) => {
    const location = useLocation();
    const url = decodeURIComponent(location.search.split('=')[1]);
    return (
        <iframe frameBorder={0} style={{border: 'none', height: 'calc(100vh - 7.75rem)', width: '100%'}} src={url}></iframe>
    );
}

export default withPageLoading(IframePage);