import classNames from "classnames";


const VerticalNavMenuLink = (props:any) => {
    return (
        <li className={classNames('nav-item', props.item.disabled ? 'disabled':'',)}>

        </li>
    );
}

export default VerticalNavMenuLink;