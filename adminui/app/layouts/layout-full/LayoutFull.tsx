import React from "react";


const LayoutFull: React.FC = (props:any) => {
    const {children} = props;
    return (
        <div>
            {children}
        </div>
    );
}

export default LayoutFull;