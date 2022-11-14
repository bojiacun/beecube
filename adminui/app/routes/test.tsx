import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);


const TestPage = () => {
    return (
        <>
            <FontAwesomeIcon className={'fa-regualr'} icon={'user'} />
        </>
    );
}

export default TestPage;