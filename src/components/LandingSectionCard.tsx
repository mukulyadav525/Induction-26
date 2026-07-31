import React from "react";

interface LandingSectionCardProps {
  sectionId: string;
  sectionClassName: string;
  containerClassName?: string;
  tagText: string;
  tagClassName?: string;
  title: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  headerAction?: React.ReactNode;
  topElement?: React.ReactNode;
  children?: React.ReactNode;
}

export default function LandingSectionCard({
  sectionId,
  sectionClassName,
  containerClassName = "container",
  tagText,
  tagClassName = "sec-tag",
  title,
  titleClassName = "sec-heading",
  subtitle,
  subtitleClassName = "about-copy",
  headerAction,
  topElement,
  children,
}: LandingSectionCardProps) {
  return (
    <section className={sectionClassName} id={sectionId}>
      <div className={`${containerClassName} landing-card-container`}>
        {topElement}
        <div className="landing-card-header reveal">
          <div className="landing-card-header-left">
            <span className={tagClassName}>{tagText}</span>
            <h2 className={titleClassName}>{title}</h2>
            {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
          </div>
          {headerAction ? (
            <div className="landing-card-header-right">{headerAction}</div>
          ) : null}
        </div>
        <div className="landing-card-body">{children}</div>
      </div>
    </section>
  );
}
