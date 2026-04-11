import { memo } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

const AppLogo = memo(function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>

        </>
    );
});

export default AppLogo;
