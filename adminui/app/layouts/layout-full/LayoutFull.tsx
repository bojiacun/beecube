import React, {ReactPortal} from "react";


const LayoutFull: React.FC<ReactPortal> = (props) => {
    const {children} = props;
    return (
        <div>
            {children}
        </div>
    );
}

export default LayoutFull;