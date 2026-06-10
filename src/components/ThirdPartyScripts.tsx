"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ThirdPartyScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const triggerLoading = () => {
      setShouldLoad(true);
      cleanup();
    };

    const timer = setTimeout(triggerLoading, 3000);
    window.addEventListener("scroll", triggerLoading, { passive: true });
    window.addEventListener("click", triggerLoading, { passive: true });
    window.addEventListener("touchstart", triggerLoading, { passive: true });
    window.addEventListener("mousemove", triggerLoading, { passive: true });
    window.addEventListener("keydown", triggerLoading, { passive: true });

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", triggerLoading);
      window.removeEventListener("click", triggerLoading);
      window.removeEventListener("touchstart", triggerLoading);
      window.removeEventListener("mousemove", triggerLoading);
      window.removeEventListener("keydown", triggerLoading);
    }

    return cleanup;
  }, []);

  if (!shouldLoad) return null;

  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5186167131908065"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      {/* Google Tag (gtag.js) */}
      {googleTagId && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleTagId}');
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity */}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
