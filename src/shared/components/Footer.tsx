export const Footer = () => {
    return (
        <footer className="w-full py-8 mt-16 text-center text-sm text-text-muted bg-card-bg/80 backdrop-blur-sm transition-colors">
            <p>© {new Date().getFullYear()} 樱落繁星. All rights reserved.</p>
            <p className="mt-2">
                Powered by <a href="https://nextjs.org" className="hover:text-primary transition-colors">Next.js</a> & Bayunche
            </p>
        </footer>
    );
};
