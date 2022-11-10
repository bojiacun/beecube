import {Pagination} from "react-bootstrap";
import {FC} from "react";
import {ChevronLeft, ChevronRight} from "react-feather";
import classNames from "classnames";

export interface SinglePaginationProps {
    className?: string;
    current: number;
    pages: number;
    total: number;
    size: number;
}

const SinglePagination: FC<SinglePaginationProps> = (props) => {
    const {current, pages, ...rest} = props;
    const pageNumbers = [];
    for(let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
    }

    return (
        //@ts-ignore
        <Pagination {...rest}>
            <Pagination.Item className={classNames('prev-item', current === 1 ? 'disabled':'')} as={'span'}><ChevronLeft
                size={18}/></Pagination.Item>
            {pageNumbers.map((pn:number)=>{
                return (
                    <Pagination.Item className={pn === current ? 'active':''} as={'button'} type={'button'}>
                        {pn}
                    </Pagination.Item>
                );
            })}
            <Pagination.Item className={classNames('next-item', current === pages ? 'disabled': '')} as={'span'}><ChevronRight
                size={18}/></Pagination.Item>
        </Pagination>
    );
}

export default SinglePagination;