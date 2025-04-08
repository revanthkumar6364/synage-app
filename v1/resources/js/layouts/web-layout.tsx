import WebLayoutTemplate from '@/layouts/web/web-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <WebLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </WebLayoutTemplate>
);
