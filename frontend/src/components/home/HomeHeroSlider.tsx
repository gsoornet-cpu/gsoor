"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatArabicDate } from "@/lib/format";

export interface HomeHeroSlide {
  id: string;
  title: string;
  excerpt?: string | null;
  href: string;
  imageUrl?: string | null;
  videoUrl?: string;
  publishedAtUtc?: string | null;
}

export function HomeHeroSlider({ slides }: { slides: HomeHeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = slides[active];

  useEffect(() => {
    if (slides.length < 2 || playing) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 8000);
    return () => window.clearInterval(timer);
  }, [slides.length, playing]);

  useEffect(() => setPlaying(false), [active]);

  if (!current) return null;
  const select = (index: number) => setActive((index + slides.length) % slides.length);
  const sideSlides = [...slides.slice(active + 1), ...slides.slice(0, active)];

  const thumb = (slide: HomeHeroSlide, index: number) => (
    <button className={`hero-thumb${slide.id === current.id ? " active" : ""}`} key={slide.id} type="button" onClick={() => select(index)} aria-label={`عرض: ${slide.title}`}>
      {slide.imageUrl ? <Image src={slide.imageUrl} alt="" width={480} height={270} unoptimized /> : <span className="home-thumb-fallback">جسور</span>}
      {slide.videoUrl && <span className="play" aria-hidden="true">▶</span>}
    </button>
  );

  return (
    <section className="section tight" id="heroSliderSection" aria-label="أبرز التغطيات المرئية">
      <div className="wrap">
        <div className="hero-slider">
          <div className="hero-side">{sideSlides.slice(0, 3).map((slide) => thumb(slide, slides.indexOf(slide)))}</div>
          <div className="hero-main">
            {playing && current.videoUrl ? (
              <video src={current.videoUrl} poster={current.imageUrl ?? undefined} controls autoPlay playsInline onEnded={() => setPlaying(false)} aria-label={current.title} />
            ) : (
              <>
                {current.imageUrl ? <Image src={current.imageUrl} alt={current.title} fill sizes="(max-width: 800px) 100vw, 60vw" unoptimized priority /> : <div className="home-hero-fallback" aria-hidden="true"><span>جسور</span></div>}
                {current.videoUrl ? <button className="playbtn" type="button" aria-label="تشغيل الفيديو" onClick={() => setPlaying(true)}>▶</button> : <Link className="hero-main-link" href={current.href} aria-label={`اقرأ: ${current.title}`} />}
              </>
            )}
          </div>
          <div className="hero-side">{sideSlides.slice(3, 6).map((slide) => thumb(slide, slides.indexOf(slide) >= 0 ? slides.indexOf(slide) : active))}</div>
        </div>
        <Link className="hero-below" href={current.href}>
          <span className="hero-below__content">
            <span className="hero-below__play" aria-hidden="true">▶</span>
            <span className="hero-below__copy">
              <span className="hero-below__eyebrow">{current.videoUrl ? "تغطية مرئية" : "أبرز الأخبار"}</span>
              <h2>{current.title}</h2>
              {current.publishedAtUtc && <span className="foot">{formatArabicDate(current.publishedAtUtc)}</span>}
            </span>
          </span>
        </Link>
        <div className="hero-nav">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => select(active - 1)}>← السابق</button>
          <div className="hero-dots" aria-label="اختيار التغطية">
            {slides.map((slide, index) => <button key={slide.id} type="button" className={index === active ? "active" : ""} aria-label={`التغطية ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => select(index)}>{index + 1}</button>)}
          </div>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => select(active + 1)}>التالي →</button>
        </div>
      </div>
    </section>
  );
}
