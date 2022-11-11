import {FC} from "react";
import {ChevronLeft, ChevronRight} from "react-feather";
import classNames from "classnames";
import ReactPaginate, {ReactPaginateProps} from "react-paginate";

export interface SinglePaginationProps extends ReactPaginateProps{

}

const SinglePagination: FC<SinglePaginationProps> = (props) => {
    const {pageCount, className, ...rest} = props;

    return (
        //@ts-ignore
        <ReactPaginate
            pageCount={pageCount}
            className={classNames('pagination mb-0 mt-1 mt-sm-0 b-pagination', className)}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item prev-item'}
            previousLinkClassName={'page-link'}
            previousLabel={<ChevronLeft size={18}/>}
            nextClassName={'page-item next-item'}
            nextLinkClassName={'page-link'}
            nextLabel={<ChevronRight size={18}/>}
            activeClassName={'active'}
            {...rest}
        />
    );
}

export default SinglePagination;