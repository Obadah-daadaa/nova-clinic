export const SPLASH_ID = 'app-splash';

/**
 * Fade out and remove the splash overlay injected by the Blade root view.
 *
 * The overlay is only ever shown when the server didn't deliver rendered markup
 * (see app.blade.php) — with SSR the page is already painted, so covering it
 * would hide real content.
 */
export function hideSplashScreen(): void {
    if (typeof document === 'undefined') {
        return;
    }

    const splash = document.getElementById(SPLASH_ID);

    if (!splash) {
        return;
    }

    splash.dataset.state = 'hidden';

    const remove = () => splash.remove();

    // Fall back to a timer in case the transition never fires (reduced motion,
    // background tab), so the overlay can't get stuck over the app.
    splash.addEventListener('transitionend', remove, { once: true });
    window.setTimeout(remove, 600);
}
