const GA_ID = import.meta.env.VITE_GA_ID;

export const trackPageView = (url: string) => {
  if (!window.gtag) return;

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};