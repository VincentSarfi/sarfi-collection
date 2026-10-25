import { strichFuer, zeichen, type ZeichenName } from "./zeichen-daten";

type ZeichenProps = { name: ZeichenName; size?: number; className?: string; title?: string };

/**
 * Eigenes Strichzeichen statt Emoji. Linien folgen der Textfarbe, der Akzent ist
 * Gold 600 – auf dunklem Grund z. B. className="text-cream-50 [--zeichen-akzent:theme(colors.gold.400)]".
 */
export default function Zeichen({ name, size = 28, className, title }: ZeichenProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strichFuer(size)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? `zeichen ${className}` : "zeichen"}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      // Statische, selbst gezeichnete Pfade aus zeichen-daten.ts
      dangerouslySetInnerHTML={{ __html: zeichen[name] }}
    />
  );
}
