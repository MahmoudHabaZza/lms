// resources/js/Components/Footer.tsx
import { useEffect } from 'react';

const gtmId = import.meta.env.VITE_GTM_ID || 'GTM-MGZPCH98';

export default function Scripts() {
  useEffect(() => {
    if (!document.getElementById('gtm-script')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script';
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(gtmScript);
    }

    if (!document.getElementById('gtm-noscript')) {
      const noscript = document.createElement('noscript');
      noscript.id = 'gtm-noscript';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.appendChild(noscript);
    }

    // تحميل JS Libraries بعد انتهاء تحميل الصفحة الكامل (load)
    // وبجعل execution متسلسلاً (script.async = false) لتفادي تنفيذ غير متوقع يغيّر الـ DOM/ستايل فورًا
    // Default legacy scripts to append. Some (like main.js, sticky_sidebar)
    // mutate the DOM/layout after load. We'll skip them on routes where
    // Inertia/React provides the full UI (e.g. bookings) to avoid flashes.
    const defaultScripts = [
      '/assets/EndUser/js/jquery-3.6.0.min.js',
      '/assets/EndUser/js/bootstrap.bundle.min.js',
      '/assets/EndUser/js/slick.min.js',
      '/assets/EndUser/js/isotope.pkgd.min.js',
      '/assets/EndUser/js/simplyCountdown.js',
      '/assets/EndUser/js/jquery.waypoints.min.js',
      '/assets/EndUser/js/jquery.countup.min.js',
      '/assets/EndUser/js/jquery.nice-select.min.js',
      '/assets/EndUser/js/venobox.min.js',
      '/assets/EndUser/js/sticky_sidebar.js',
      '/assets/EndUser/js/wow.min.js',
      '/assets/EndUser/js/jquery.exzoom.js',
      '/assets/EndUser/js/main.js',
      '/assets/EndUser/js/toastr.min.js',
      '/assets/Admin/js/sweetalert2.min.js',
    ];

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    // These React/Inertia pages use modern Tailwind layouts and should not be
    // mutated by the legacy theme scripts after load. `main.js` in particular
    // initializes Isotope on every `.grid`, which breaks Tailwind grid layouts
    // on pages like course details after the initial render.
    const excludeLegacyOn = ['/bookings', '/booking', '/join-us', '/contact', '/courses'];
    const shouldExcludeLegacy = excludeLegacyOn.some((p) => pathname.startsWith(p));

    // If on an excluded route, filter out scripts known to mutate layout
    const scripts = shouldExcludeLegacy
      ? defaultScripts.filter(
          (src) => !src.includes('main.js') && !src.includes('sticky_sidebar.js') && !src.includes('jquery.nice-select.min.js'),
        )
      : defaultScripts;

    const loadScripts = () => {
      // append scripts in order and disable async so they execute sequentially
      scripts.forEach((src, index) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        // When the last script finishes loading, remove the js-loading safeguard
        if (index === scripts.length - 1) {
          script.onload = () => {
            try {
              document.documentElement.classList.remove('js-loading');
            } catch (e) {
              // ignore
            }
          };
        }
        document.body.appendChild(script);
      });
    };

    if (document.readyState === 'complete') {
      loadScripts();
    } else {
      window.addEventListener('load', loadScripts);
      return () => window.removeEventListener('load', loadScripts);
    }
  }, []);

  return null;
}
