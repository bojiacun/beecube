import {Button} from "react-bootstrap";
import {useState} from "react";

export default function Index() {
    const [count, setCount] = useState<number>(0);

    const handleOnClick = () => {
        setCount(v => v+1);
    }
    return (
        <div>
            <h1>Welcome to Remix {count}</h1>
            <Button variant={'danger'} onClick={handleOnClick}>测试按钮</Button>
        </div>
    );
}
