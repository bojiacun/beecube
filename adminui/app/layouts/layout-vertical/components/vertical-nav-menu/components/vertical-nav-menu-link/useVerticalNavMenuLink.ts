import {isNavLinkActive, navLinkProps} from "~/layouts/utils";

export default function useVerticalNavMenuLink(item:any) {
    let isActive = false

    const linkProps = navLinkProps(item)

    const updateIsActive = () => {
        isActive = isNavLinkActive(item)
    }

    return {
        isActive,
        linkProps,
        updateIsActive,
    }
}
