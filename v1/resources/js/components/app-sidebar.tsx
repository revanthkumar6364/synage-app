import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, Folder, Image, LayoutGrid, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import AppLogo from './app-logo';


export function AppSidebar() {
    const { auth } = usePage<{ auth: any }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(auth.can.users.viewAny ? [{
            title: 'Users',
            href: '/users',
            icon: Users,
        }] : []),
        ...(auth.can.categories.viewAny ? [{
            title: 'Categories',
            href: '/categories',
            icon: Folder,
        }] : []),
        ...(auth.can.accounts.viewAny ? [{
            title: 'Accounts',
            href: '/accounts',
            icon: Users,
        }] : []),
        ...(auth.can.products.viewAny ? [{
            title: 'Products',
            href: '/products',
            icon: ShoppingCart,
        }] : []),
        ...(auth.can.quotationMedia.viewAny ? [{
            title: 'Quotation Media',
            href: '/quotation-media',
            icon: Image,
        }] : []),
        {
            title: 'Quotations',
            href: '/quotations',
            icon: FileText,
        },
        {
            title: 'Reports and Analytics',
            href: '/reports',
            icon: BarChart3,
        }
    ];
    const footerNavItems: NavItem[] = [
        {
            title: 'Settings',
            href: '/settings',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
