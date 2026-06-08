import React, { useEffect, useState } from 'react';

// Custom navigation trigger
export const navigateTo = (url: string) => {
    window.history.pushState({}, '', url);
    const navEvent = new CustomEvent('app-navigation', { detail: { url } });
    window.dispatchEvent(navEvent);
};

export const Link = ({ href, children, className, ...props }: any) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.altKey ||
            e.ctrlKey ||
            e.shiftKey
        ) {
            return;
        }
        e.preventDefault();
        navigateTo(href);
    };

    return (
        <a href={href} className={className} onClick={handleClick} {...props}>
            {children}
        </a>
    );
};

export const Head = ({ title, children }: { title?: string; children?: React.ReactNode }) => {
    useEffect(() => {
        if (title) {
            document.title = title + " - PSHT Cabang Kabupaten Tangerang";
        }
    }, [title]);
    return <>{children}</>;
};

export const usePage = () => {
    const [url, setUrl] = useState(window.location.pathname);

    useEffect(() => {
        const handleNav = () => {
            setUrl(window.location.pathname);
        };
        window.addEventListener('popstate', handleNav);
        window.addEventListener('app-navigation', handleNav);
        return () => {
            window.removeEventListener('popstate', handleNav);
            window.removeEventListener('app-navigation', handleNav);
        };
    }, []);

    return {
        url,
        props: {
            auth: { user: null },
            flash: {}
        }
    };
};
