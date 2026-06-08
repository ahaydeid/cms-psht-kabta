import type { ComponentType } from 'react';

export type MenuItem = {
    children?: MenuItem[];
    icon?: ComponentType<{ className?: string }>;
    name: string;
    path?: string;
    section?: string;
};
