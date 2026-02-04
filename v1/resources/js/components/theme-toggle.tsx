import { Moon, Sun, Monitor } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function ThemeToggle() {
    const { updateAppearance, appearance } = useAppearance();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between p-2">
                            <span className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
                                Theme
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 px-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col">
                            <SidebarMenuButton
                                onClick={() => updateAppearance('light')}
                                isActive={appearance === 'light'}
                                tooltip="Light Mode"
                                className="justify-center h-8"
                            >
                                <Sun className="h-4 w-4" />
                                <span className="sr-only">Light</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton
                                onClick={() => updateAppearance('dark')}
                                isActive={appearance === 'dark'}
                                tooltip="Dark Mode"
                                className="justify-center h-8"
                            >
                                <Moon className="h-4 w-4" />
                                <span className="sr-only">Dark</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton
                                onClick={() => updateAppearance('system')}
                                isActive={appearance === 'system'}
                                tooltip="System Mode"
                                className="justify-center h-8"
                            >
                                <Monitor className="h-4 w-4" />
                                <span className="sr-only">System</span>
                            </SidebarMenuButton>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
