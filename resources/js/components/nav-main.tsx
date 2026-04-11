import { Link } from '@inertiajs/react';
import { useRef } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useSidebarActiveScroll } from '@/hooks/use-sidebar-active-scroll';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { currentUrl, isCurrentUrl } = useCurrentUrl();
    const menuRef = useRef<HTMLDivElement | null>(null);

    useSidebarActiveScroll({
        containerRef: menuRef,
        dependencyKey: currentUrl,
    });

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <div ref={menuRef}>
                <SidebarMenu>
                    {items.map((item) => {
                        const active = isCurrentUrl(item.href);

                        return (
                            <SidebarMenuItem key={item.title} data-sidebar-active={active || undefined}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={active}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </div>
        </SidebarGroup>
    );
}