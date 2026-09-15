import { View } from "react-native";
import FastImage from "react-native-fast-image";

import { EaseView } from "react-native-ease";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";

import {
  ActionTile,
  Button,
  ListSection,
  ProgressBar,
  Screen,
  Spacer,
} from "@/components/primitives";

import { Check, Sprout } from "lucide-react-native";

import { animated } from "@/constants/Assets";

import { useShowToast } from "@/hooks/useShowToast";
import { useNavigation } from "@/hooks/useNavigation";
import { useResultStore } from "@/stores/result";

import { calculatePercentage, randomBetween } from "@/utils";
import { useEffect } from "react";
import { cnBase } from "tailwind-variants";

export default function SuccessScreen() {
  const showToast = useShowToast();
  const { navigateToHome } = useNavigation();

  const { type, title, subtitle, icon, stats } = useResultStore().result ?? {};

  useEffect(() => {
    if (type !== "success") {
      if (title) showToast({ title });
      navigateToHome();
    }
  }, [type]);

  if (type !== "success") return null;

  return (
    <Screen
      space="4xl"
      contentComponent={
        <>
          <Center className="w-full flex-row">
            <View className="w-[50%] max-w-38 aspect-square mt-18">
              <View className="absolute size-full aspect-square">
                <View className="size-full scale-300">
                  <FastImage
                    source={animated.fireworks}
                    style={{ position: "absolute", inset: 0 }}
                  />
                </View>
                <FastImage
                  source={animated.fireworks}
                  className="size-full scale-300"
                />

                {Array.from({ length: 2 }).map((_, index) => (
                  <EaseView
                    key={index}
                    initialAnimate={{
                      scale: 0,
                      opacity: 0.6,
                    }}
                    animate={{
                      scale: 4,
                      opacity: 0,
                    }}
                    transition={{
                      transform: {
                        type: "spring",
                        damping: 20,
                        stiffness: 60,
                        mass: 1.2,
                        delay: index * 400,
                      },
                      opacity: {
                        type: "timing",
                        duration: 1400,
                        easing: "easeOut",
                        delay: index * 400,
                      },
                    }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <View className="size-full rounded-full bg-success/20" />
                  </EaseView>
                ))}
              </View>

              <EaseView
                initialAnimate={{
                  scale: 0.2,
                  opacity: 0,
                  rotate: randomBetween(-100, 100),
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                }}
                transition={{
                  transform: { type: "spring" },
                }}
                style={{ position: "absolute", inset: 0 }}
              >
                <Center className="size-full rounded-full bg-success ring-8 ring-success/50">
                  <Icon
                    as={icon || Check}
                    className="size-[70%] text-success-foreground"
                  />
                </Center>
              </EaseView>
            </View>
          </Center>

          <VStack space="sm" className={cnBase("mt-8", stats && "mt-4")}>
            <EaseView
              initialAnimate={{
                translateY: 50,
                opacity: 0,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                transform: {
                  type: "spring",
                  stiffness: 100,
                },
              }}
            >
              <Heading size="3xl" className="text-center tracking-tight" bold>
                {title}
              </Heading>
            </EaseView>

            <EaseView
              initialAnimate={{
                translateY: 50,
                opacity: 0,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                transform: {
                  type: "spring",
                  stiffness: 100,
                  mass: 1.2,
                },
              }}
            >
              <Text size="lg" className="text-center font-mediumopacity-70">
                {subtitle}
              </Text>
            </EaseView>
          </VStack>

          {stats && (
            <EaseView
              initialAnimate={{
                translateY: 50,
                opacity: 0,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                transform: {
                  type: "spring",
                  stiffness: 120,
                  mass: 1.5,
                },
              }}
            >
              <ListSection
                size="md"
                space="sm"
                title="Statistik"
                className="mt-6"
              >
                <ActionTile
                  title="Perawatan Taman"
                  icon={Sprout}
                  variant="outline"
                  className="shadow-none"
                  headerRightComponent={<Heading size="md">20x</Heading>}
                  bottomComponent={
                    <ProgressBar
                      text={`10 dari 20 kegiatan`}
                      value={calculatePercentage(10, 20)}
                    />
                  }
                />
              </ListSection>
            </EaseView>
          )}

          <Spacer fill />

          <Button
            label="Kembail ke halaman utama"
            size="cta"
            onPress={() => navigateToHome()}
          />
        </>
      }
    />
  );
}
