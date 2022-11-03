import {NavDropdown, Image, Nav} from "react-bootstrap";
import {useState} from "react";
import {useTranslation} from "react-i18next";
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
    const {i18n} = useTranslation();
    const dropdownTitle = (
        <>
            <Image src={currentLocale.img} width={22} height={14} alt={currentLocale.locale} />
            <span className={'ml-50 text-body'}>{currentLocale.name}</span>
        </>
    );

    const handleOnChange = (e:any) => {
        setCurrentLocale(e);
        i18n.changeLanguage(e.locale).then();
    }
    return (
        //@ts-ignore
        <NavDropdown as={'li'} id={'dropdown-grouped'} title={dropdownTitle} className={'dropdown-language'} variant={'link'}>
            {locales.map((item)=>{
                return (
                    <NavDropdown.Item id={item.locale} key={item.locale} onSelect={()=>handleOnChange(item)}>
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