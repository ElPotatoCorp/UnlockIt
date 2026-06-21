import { type FC, useState, useEffect, useRef } from "react";
import { MediaType, type Media } from "@unlockit/shared";
import styles from "./mediaCarousel.module.css";

interface MediaCarouselProps {
    media: Media[];
}

export const MediaCarousel: FC<MediaCarouselProps> = ({ media }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const playersRef = useRef<{ [key: number]: any }>({});

    // Charger l’API YouTube une seule fois
    useEffect(() => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        (window as any).onYouTubeIframeAPIReady = () => {
            media.forEach((item, i) => {
                if (item.type === MediaType.VIDEO) {
                    const videoId = extractYoutubeId(item.url);
                    if (!videoId) return;

                    playersRef.current[i] = new (window as any).YT.Player(`player-${i}`, {
                        events: {
                            onStateChange: (event: any) => {
                                const YT = (window as any).YT;
                                if (event.data === YT.PlayerState.PLAYING && i === selectedIndex) {
                                    setIsVideoPlaying(true);
                                } else if (
                                    event.data === YT.PlayerState.ENDED ||
                                    event.data === YT.PlayerState.PAUSED
                                ) {
                                    setIsVideoPlaying(false);
                                }
                            },
                        },
                    });
                }
            });
        };
    }, [media, selectedIndex]);

    // Stopper les vidéos quand on change de slide
    useEffect(() => {
        Object.entries(playersRef.current).forEach(([index, player]) => {
            if (parseInt(index) !== selectedIndex) {
                player.stopVideo?.();
            }
        });
    }, [selectedIndex]);

    // Scroll automatique uniquement si aucune vidéo n'est en cours
    useEffect(() => {
        if (isVideoPlaying) return;

        const interval = setInterval(() => {
            setSelectedIndex((prevIndex) =>
                prevIndex === media.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [media, selectedIndex, isVideoPlaying]);

    // Scroll vers l’élément actif
    useEffect(() => {
        const carouselEl = document.querySelector(`.${styles.carousel}`);
        const activeSlide = slideRefs.current[selectedIndex];

        if (carouselEl && activeSlide) {
            carouselEl.scrollTo({
                left: activeSlide.offsetLeft - carouselEl.clientWidth / 2 + activeSlide.clientWidth / 2,
                behavior: "smooth",
            });
        }
    }, [selectedIndex]);

    return (
        <div className={styles.carouselWrapper}>
            <div className={styles.selectedImageWrapper}>
                {media.map((item, i) => {
                    if (item.type === MediaType.IMAGE) {
                        return (
                            <img
                                key={i}
                                src={item.url}
                                alt={`screenshot-${i}`}
                                className={`${styles.selectedImage} ${i === selectedIndex ? styles.visible : styles.hidden}`}
                            />
                        );
                    }

                    if (item.type === MediaType.VIDEO) {
                        const videoId = extractYoutubeId(item.url);
                        return (
                            <iframe
                                id={`player-${i}`}
                                key={i}
                                src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1`}
                                title={`video-${i}`}
                                className={`${styles.selectedImage} ${i === selectedIndex ? styles.visible : styles.hidden}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        );
                    }

                    return null;
                })}
            </div>

            <div className={styles.carousel}>
                {media.map((item, i) => (
                    <div
                        key={i}
                        ref={(el: HTMLDivElement | null) => {
                            slideRefs.current[i] = el;
                        }}
                        className={`${styles.slide} ${i === selectedIndex ? styles.activeSlide : ""}`}
                        onClick={() => setSelectedIndex(i)}
                    >
                        {item.type === MediaType.IMAGE ? (
                            <img src={item.url} alt={`screenshot-${i}`} className={styles.image} />
                        ) : (
                            <img
                                src={`https://img.youtube.com/vi/${extractYoutubeId(item.url)}/0.jpg`}
                                alt={`video-thumb-${i}`}
                                className={styles.image}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

function extractYoutubeId(url: string): string | null {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
}