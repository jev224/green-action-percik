import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView } from "react-native";
import { Redirect, Stack } from "expo-router";

export default function Index() {
  return <Redirect href={"/(admin)/(tabs)/home"} />;
  return <Redirect href={"/(dev)/component-catalog"} />;
}
