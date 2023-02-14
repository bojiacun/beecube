import {defaultRouteCatchBoundary, defaultRouteErrorBoundary} from "~/utils/utils";
import {withPageLoading} from "~/utils/components";
import {Row, Col} from "react-bootstrap";

export const ErrorBoundary = defaultRouteErrorBoundary;
export const CatchBoundary = defaultRouteCatchBoundary;



const DiyPage = (props:any) => {
    return (
        <Row>

        </Row>
    );
}

export default withPageLoading(DiyPage);