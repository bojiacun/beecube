import {NavDropdown, Image} from "react-bootstrap";
import {useState} from "react";
const locales = [
    {
        locale: 'cn',
        img: require('assets/images/flags/cn.png'),
        name: '简体中文',
    },
    {
        locale: 'en',
        img: require('assets/images/flags/en.png'),
        name: 'English',
    },
];

const Locale = () => {
    const [currentLocale, setCurrentLocale] = useState(
        {
            locale: 'cn',
            img: require('assets/images/flags/cn.png'),
            name: '简体中文',
        },
    );
    const dropdownTitle = (
        <>
            <Image src={currentLocale.img} width={22} height={14} alt={currentLocale.locale} />
            <span className={'ml-50 text-body'}>{currentLocale.name}</span>
        </>
    );
    return (
        //@ts-ignore
        <NavDropdown as={'li'} id={'dropdown-grouped'} title={dropdownTitle} className={'dropdown-language'} variant={'link'}>
            {locales.map((item)=>{
                return (
                    <NavDropdown.Item>
                        <div style={{display: 'inline-flex', alignItems: 'center'}}>
                            <Image src={item.img} width={22} height={14} alt={item.locale} />
                            <span className={'ml-50 text-body'}>{item.name}</span>
                        </div>
                    </NavDropdown.Item>
                );
            })}

        </NavDropdown>
    );
}

export default Locale