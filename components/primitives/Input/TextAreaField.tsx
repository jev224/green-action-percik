import React, { ComponentProps } from "react";
import Animated from "react-native-reanimated";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

type TextAreaFieldProps = ComponentProps<typeof TextareaInput>;

export function TextAreaField({
  onContentSizeChange,
  ...props
}: TextAreaFieldProps) {
  return (
    <Animated.View className="min-h-32 max-h-52 flex-none">
      <Textarea className="h-full rounded-md px-1">
        <TextareaInput {...props} multiline />
      </Textarea>
    </Animated.View>
  );
}
