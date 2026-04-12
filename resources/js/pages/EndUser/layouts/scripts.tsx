// resources/js/Components/Footer.tsx
import { useEffect } from "react";

export default function Scripts() {
  useEffect(() => {
    // تحميل JS Libraries بعد انتهاء تحميل الصفحة الكامل (load)
    // وبجعل execution متسلسلاً (script.async = false) لتفادي تنفيذ غير متوقع يغيّر الـ DOM/ستايل فورًا
    // Default legacy scripts to append. Some (like main.js, sticky_sidebar)
    // mutate the DOM/layout after load. We'll skip them on routes where
    // Inertia/React provides the full UI (e.g. bookings) to avoid flashes.
    const defaultScripts = [
      "/assets/EndUser/js/jquery-3.6.0.min.js",
      "/assets/EndUser/js/bootstrap.bundle.min.js",
      "/assets/EndUser/js/slick.min.js",
      "/assets/EndUser/js/isotope.pkgd.min.js",
      "/assets/EndUser/js/simplyCountdown.js",
      "/assets/EndUser/js/jquery.waypoints.min.js",
      "/assets/EndUser/js/jquery.countup.min.js",
      "/assets/EndUser/js/jquery.nice-select.min.js",
      "/assets/EndUser/js/venobox.min.js",
      "/assets/EndUser/js/sticky_sidebar.js",
      "/assets/EndUser/js/wow.min.js",
      "/assets/EndUser/js/jquery.exzoom.js",
      "/assets/EndUser/js/main.js",
      "/assets/EndUser/js/toastr.min.js",
      "/assets/Admin/js/sweetalert2.min.js",
    ];

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    // These React/Inertia pages use modern Tailwind layouts and should not be
    // mutated by the legacy theme scripts after load.
    const excludeLegacyOn = ['/bookings', '/booking', '/join-us', '/contact'];
    const shouldExcludeLegacy = excludeLegacyOn.some(p => pathname.startsWith(p));

    // If on an excluded route, filter out scripts known to mutate layout
    const scripts = shouldExcludeLegacy
      ? defaultScripts.filter(src => !src.includes('main.js') && !src.includes('sticky_sidebar.js') && !src.includes('jquery.nice-select.min.js'))
      : defaultScripts;

    const loadScripts = () => {
      // append scripts in order and disable async so they execute sequentially
      scripts.forEach((src, index) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        // When the last script finishes loading, remove the js-loading safeguard
        if (index === scripts.length - 1) {
          script.onload = () => {
            try {
              document.documentElement.classList.remove('js-loading');
            } catch (e) {}
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
