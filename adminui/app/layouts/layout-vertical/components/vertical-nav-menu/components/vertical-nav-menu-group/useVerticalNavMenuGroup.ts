

export default function useVerticalNavMenuGroup(item:any, isVerticalMenuCollapsed = false) {
    let isOpen = false;
    let isActive = false;
    let isMouseHovered = false;
    return {
        isOpen,
        isActive,
        isMouseHovered,
    }
}