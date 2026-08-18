import { View } from "react-native";

interface SpacerProps {
  fill?: boolean;
  height?: number;
  width?: number;
}

export const Spacer = ({ fill, width, height }: SpacerProps) => {
  return <View style={{ width, height, flex: fill ? 1 : undefined }} />;
};
