import { ColorValue, View } from "react-native";
import { EaseView } from "react-native-ease";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

type GlowOrbProps = {
  color?: ColorValue;
  size?: number;

  isBreathingEnabled?: boolean;
  breathDurationMs?: number;
  breathDelayMs?: number;
  minOpacity?: number;
  maxOpacity?: number;
  minScale?: number;
  maxScale?: number;
};

export function GlowOrb({
  color,
  size = 300,

  isBreathingEnabled = true,
  breathDurationMs = 2400,
  breathDelayMs = 0,
  minOpacity = 0.5,
  maxOpacity = 1,
  minScale = 0.92,
  maxScale = 1,
}: GlowOrbProps) {
  // Disabled: sustained ~90-107% CPU / device heat even after react-native-ease swap.
  // Revisit before re-enabling — see notes.
  return null;

  return (
    <View
      className="absolute -inset-8 -z-10"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <EaseView
        initialAnimate={{ scale: maxScale, opacity: maxOpacity }}
        animate={{ scale: minScale, opacity: minOpacity }}
        transition={{
          transform: {
            type: "timing",
            loop: isBreathingEnabled ? "repeat" : undefined,
            duration: breathDurationMs,
            delay: breathDelayMs,
            easing: "easeInOut",
          },
        }}
        pointerEvents="none"
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <Stop offset="60%" stopColor={color} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={color} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill="url(#glow)" />
        </Svg>
      </EaseView>
    </View>
  );
}
