type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  invert?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p
        className={
          invert
            ? "text-sm font-semibold text-slate-300"
            : "text-sm font-semibold text-brand"
        }
      >
        {eyebrow}
      </p>
      <h2
        className={
          invert
            ? "mt-3 font-display text-3xl font-semibold text-white sm:text-4xl"
            : "mt-3 font-display text-3xl font-semibold text-slate-950 sm:text-4xl"
        }
      >
        {title}
      </h2>
      <p
        className={
          invert
            ? "mt-4 text-base leading-7 text-slate-300 sm:text-lg"
            : "mt-4 text-base leading-7 text-slate-600 sm:text-lg"
        }
      >
        {description}
      </p>
    </div>
  );
}
