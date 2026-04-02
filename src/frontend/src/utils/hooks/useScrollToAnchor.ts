import { useEffect } from "react";

export default function useScrollToAnchor(headerSelector = "header") {
    useEffect(() => {
        function scrollToHash() {
            const hash = window.location.hash.replace("#", "");
            if (!hash) return;

            function tryScroll(attempt = 0) {
                const el = document.getElementById(hash);
                const header = document.querySelector(headerSelector);

                const offset = 200 + (header ? header.getBoundingClientRect().height : 0);

                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: y,
                        behavior: "smooth"
                    });

                    el.classList.add("highlight-anchor");
                    setTimeout(() => el.classList.remove("highlight-anchor"), 1500);

                } else if (attempt < 10) {
                    setTimeout(() => tryScroll(attempt + 1), 100);
                }
            }

            tryScroll();
        }

        scrollToHash();
        window.addEventListener("hashchange", scrollToHash);

        return () => window.removeEventListener("hashchange", scrollToHash);
    }, [headerSelector]);
}
