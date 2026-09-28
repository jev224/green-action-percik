import { Image } from "expo-image";
import {
  Apple,
  BrushCleaning,
  Bubbles,
  Recycle,
  ShieldAlert,
  Sprout,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import {
  GlowDecoration,
  GlowOrb,
  LeafDecoration,
} from "@/components/decoration";
import { Greeting, PhotoCard, QuoteCard } from "@/components/domain";
import {
  ActionTile,
  Button,
  HomeCarousel,
  ListSection,
  Modal,
  Screen,
  StatCard,
} from "@/components/primitives";
import { HStack } from "@/components/ui/hstack";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { images } from "@/constants/Assets";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserProfile } from "@/hooks/useUser";
import { fetchMotiovations } from "@/services/fetcher/others/motivations";
import { fetchOrganizationPhotoURLs } from "@/services/fetcher/others/organizationPhotos";
import { fetchStudentStatistics } from "@/services/fetcher/student/studentDashboard";
import { parseProfileInfo } from "@/utils";

export default function HomeScreen() {
  const [passwordDialogShown, setPasswordDialogShown] = useState(false);

  const { navigateTo } = useNavigation();

  const userProfile = useUserProfile("student");

  const { data, isLoading, isError, errorMessage, refresh, isRefreshing } =
    useAsyncData(
      async (profile) =>
        profile && {
          motivations: await fetchMotiovations(),
          organizationPhotos: await fetchOrganizationPhotoURLs(),
          profile,
          stats: await fetchStudentStatistics(profile.user_id),
        },
      userProfile,
    );

  useEffect(() => {
    if (userProfile.profile?.is_default_password) {
      setPasswordDialogShown(true);
    }
  }, [userProfile.profile?.is_default_password]);

  const { colors, scheme } = useThemeColors();
  const isDark = scheme === "dark";

  return (
    <Screen
      scrollable
      data={data}
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      onTryAgain={refresh}
      requiredInternet
      tabBarPadding
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      }
      contentComponent={({
        organizationPhotos,
        motivations,
        stats: { wasteWeightTotal, gardenActivityCount, compostActivityCount },
        profile: { name, class: classData, photoUrl },
      }) => (
        <>
          <Greeting
            name={name}
            info={parseProfileInfo({ role: "student", ...classData })}
            imageSource={{ uri: photoUrl }}
          />

          <HomeCarousel
            height={270}
            outerDecoration={
              !isDark && (
                <GlowOrb color={colors.success} minScale={1.5} maxScale={2} />
              )
            }
          >
            <QuoteCard
              quotesData={motivations}
              outerDecoration={
                <LeafDecoration variant="accent" pattern="2" shadow="lg" />
              }
              innerDecoration={
                <Image
                  source={images.bannerDecorationLight}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  contentPosition="bottom"
                />
              }
            />

            {organizationPhotos.length > 0 && (
              <PhotoCard photos={organizationPhotos} />
            )}
          </HomeCarousel>

          <ListSection
            title="Statistik saat ini"
            decoration={<LeafDecoration pattern="3" variant="accent" />}
          >
            <HStack space="md">
              <StatCard
                title="Sampah"
                stats={`${wasteWeightTotal} kg`}
                icon={Bubbles}
                variant="outline"
                fill
                animation="fun"
                color="organic"
                innerDecoration={
                  <>
                    <GlowDecoration
                      color={colors.organic}
                      colorForeground={colors.organicForeground}
                    />

                    <LeafDecoration
                      variant="cluster"
                      pattern="1"
                      color={colors.organic}
                    />
                  </>
                }
                outerDecoration={
                  <LeafDecoration variant="accent" pattern="6" shadow="md" />
                }
              />

              <StatCard
                title="Perawatan"
                stats={`${gardenActivityCount} Kali`}
                icon={BrushCleaning}
                variant="outline"
                fill
                animation="fun"
                innerDecoration={
                  <>
                    <GlowDecoration
                      color={colors.primary}
                      colorForeground={colors.primaryForeground}
                    />
                    <LeafDecoration
                      variant="cluster"
                      pattern="2"
                      color={colors.primary}
                    />
                  </>
                }
                outerDecoration={
                  <LeafDecoration variant="accent" pattern="5" shadow="md" />
                }
              />

              <StatCard
                title="Kompos"
                stats={`${compostActivityCount} Kali`}
                icon={Apple}
                variant="outline"
                fill
                animation="fun"
                color="inorganic"
                innerDecoration={
                  <>
                    <GlowDecoration
                      color={colors.inorganic}
                      colorForeground={colors.inorganicForeground}
                    />
                    <LeafDecoration
                      variant="cluster"
                      pattern="3"
                      color={colors.inorganic}
                    />
                  </>
                }
                outerDecoration={
                  <LeafDecoration variant="accent" pattern="4" shadow="md" />
                }
              />
            </HStack>
          </ListSection>

          <ListSection
            title="Aksi Cepat"
            decoration={<LeafDecoration pattern="3" variant="accent" />}
          >
            <VStack space="md">
              <ActionTile
                title="Pengumpulan Sampah"
                description="Kumpulkan dan catat sampah organik atau anorganik"
                icon={Trash2}
                variant="solid"
                onPress={() => navigateTo("/(student)/submit/waste-bank")}
                innerDecoration={
                  <GlowDecoration
                    variant="edges"
                    edgeColors={[colors.primary, colors.accent]}
                  />
                }
                outerDecoration={
                  <LeafDecoration variant="accent" pattern="1" />
                }
              />

              <ActionTile
                title="Perawatan Taman"
                description="Catat kegiatan merawat tanaman dan taman sekolah"
                icon={Sprout}
                variant="solid"
                onPress={() => navigateTo("/(student)/submit/garden-activity")}
                innerDecoration={
                  <GlowDecoration
                    variant="edges"
                    edgeColors={[colors.primary, colors.accent]}
                  />
                }
                outerDecoration={
                  <LeafDecoration variant="accent" pattern="1" />
                }
              />

              <ActionTile
                title="Kegiatan Kompos"
                description="Catat partisipasi kegiatan kompos bulanan kelas"
                icon={Recycle}
                variant="solid"
                onPress={() => navigateTo("/(student)/submit/compost-activity")}
                innerDecoration={
                  <GlowDecoration
                    variant="edges"
                    edgeColors={[colors.primary, colors.accent]}
                  />
                }
                outerDecoration={
                  <LeafDecoration variant="accent" pattern="1" />
                }
              />
            </VStack>
          </ListSection>
        </>
      )}
      loadingComponent={
        <>
          <HStack className="w-full justify-between items-center">
            <VStack space="sm">
              <SkeletonText className="w-48 h-5" />
              <SkeletonText className="w-32 h-5" />
            </VStack>

            <Skeleton className="aspect-square w-16 h-16 rounded-full" />
          </HStack>

          <Skeleton className="h-64" />

          <HStack space="md" className="h-32">
            <Skeleton className="flex-1" />
            <Skeleton className="flex-1" />
            <Skeleton className="flex-1" />
          </HStack>

          <VStack space="md">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </VStack>
        </>
      }
      overlayComponent={
        <Modal
          vertical
          icon={ShieldAlert}
          title="Perbarui Kata Sandi"
          description="Kata sandi Anda masih menggunakan NIS. Demi keamanan akun, silakan perbarui kata sandi Anda dengan kata sandi baru. Jika Anda lupa kata sandi, Anda dapat menghubungi admin kapan saja untuk mendapatkan bantuan."
          isOpen={passwordDialogShown}
          onClose={() => setPasswordDialogShown(false)}
          contentComponent={
            <>
              <Button
                label="Perbarui sekarang"
                variant="default"
                fill
                onPress={() => {
                  setPasswordDialogShown(false);
                  navigateTo("/profile/change-password");
                }}
              />
              <Button
                label="Nanti Saja"
                variant="secondary"
                fill
                onPress={() => setPasswordDialogShown(false)}
              />
            </>
          }
        />
      }
    />
  );
}
