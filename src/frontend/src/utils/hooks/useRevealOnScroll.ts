import { useEffect } from "react";

export default function useRevealOnScroll(dep?: unknown) {
    useEffect(() => {
        const hasdep = arguments.length > 0;
        if (hasdep && dep == null) return;

        const elements = document.querySelectorAll(".reveal-on-scroll");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();

    }, [dep]);
}