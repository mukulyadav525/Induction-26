interface PageHeroProps {
  title: React.ReactNode;
  subtitles?: string[];
  extraContent?: React.ReactNode;
  modifier?: string;
}

export default function PageHero({
  title,
  subtitles,
  extraContent,
  modifier,
}: PageHeroProps) {
  return (
    <div className={`sched-page-hero${modifier ? ` ${modifier}` : ""}`}>
      <div className="sched-page-hero-inner">
        <h1 className="sched-page-title">{title}</h1>
        {subtitles?.map((sub, i) => (
          <p className="sched-page-sub" key={i}>
            {sub}
          </p>
        ))}
        {extraContent}
      </div>
    </div>
  );
}
