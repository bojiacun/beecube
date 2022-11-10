import {Pagination} from "react-bootstrap";

export interface SinglePaginationProps {
    className?: string;
    current: number;
    pages: number;
    total: number;
    size: number;
}

const SinglePagination = (props:any) => {
    const {...rest} = props;

    return (
        <Pagination {...rest}>

        </Pagination>
    );
}

export default SinglePagination;