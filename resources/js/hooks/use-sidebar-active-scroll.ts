import { useEffect, type RefObject } from 'react';

type UseSidebarActiveScrollOptions = {
    containerRef: RefObject<HTMLElement | null>;
    activeSelector?: string;
    dependencyKey: string;
    behavior?: ScrollBehavior;
    offset?: number;
};

export function useSidebarActiveScroll({
    containerRef,
    activeSelector = '[data-sidebar-active="true"]',
    dependencyKey,
    behavior = 'smooth',
    offset = 12,
}: UseSidebarActiveScrollOptions): void {
    useEffect(() => {
        const rootElement = containerRef.current;
        if (!rootElement) {
            return;
        }

        const activeItem = rootElement.querySelector<HTMLElement>(activeSelector);
        if (!activeItem) {
            return;
        }

        const container = findScrollableContainer(rootElement);

        const containerRect = container.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const isAbove = itemRect.top < containerRect.top + offset;
        const isBelow = itemRect.bottom > containerRect.bottom - offset;

        if (!isAbove && !isBelow) {
            return;
        }

        const relativeTop = itemRect.top - containerRect.top + container.scrollTop;
        const targetTop = relativeTop - container.clientHeight / 2 + activeItem.clientHeight / 2;

        container.scrollTo({
            top: Math.max(0, targetTop),
            behavior,
        });
    }, [activeSelector, behavior, containerRef, dependencyKey, offset]);
}

function findScrollableContainer(element: HTMLElement): HTMLElement
{
    let current: HTMLElement | null = element;

    while (current) {
        const style = window.getComputedStyle(current);
        const canScroll = /(auto|scroll)/.test(style.overflowY);

        if (canScroll && current.scrollHeight > current.clientHeight) {
            return current;
        }

        current = current.parentElement;
    }

    return element;
}
