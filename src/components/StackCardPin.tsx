import Image from "next/image";
import { memo } from "react";

interface StackCardPinProps {
  isActive: boolean;
  cardIndex: number;
  cardBox?: { top: number; left: number; width: number };
}

type CardDecorationCorner = "top-left" | "top-right";

interface CardDecoration {
  kind: "tape" | "pin";
  corner: CardDecorationCorner;
}

const cardDecorationByIndex: Record<number, CardDecoration> = {
  0: { kind: "tape", corner: "top-left" },
  2: { kind: "pin", corner: "top-left" },
  4: { kind: "tape", corner: "top-right" },
};

function StackCardPinBase({ isActive, cardIndex, cardBox }: StackCardPinProps) {
  const decoration = cardDecorationByIndex[cardIndex];
  if (!decoration) return null;

  const wrapClassName = `stack-card-pin-wrap stack-card-pin-wrap--${decoration.corner}${isActive ? " is-active" : ""}`;
  const wrapStyle = cardBox
    ? {
        top: cardBox.top,
        left: cardBox.left,
        right: "auto" as const,
        width: cardBox.width,
        maxWidth: "none" as const,
        margin: 0,
      }
    : undefined;

  if (decoration.kind === "tape") {
    return (
      <div className={wrapClassName} style={wrapStyle}>
        <Image
          src="/assets/stack-deco/washi-tape.svg"
          alt=""
          width={140}
          height={48}
          className="stack-card-tape"
          priority
        />
      </div>
    );
  }

  return (
    <div className={wrapClassName} style={wrapStyle}>
      <Image
        src="/assets/stack-deco/pin.svg"
        alt=""
        width={28}
        height={28}
        className="stack-card-pin"
      />
    </div>
  );
}

const StackCardPin = memo(StackCardPinBase);
export default StackCardPin;
