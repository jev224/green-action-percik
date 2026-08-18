// app/example/component-catalog.tsx
//
// A living demo of every component in the new structure, plus an
// explanation of the primitives/ vs domain/ split baked right into the
// page. Point new devs here first — it's faster than reading files.
//
// This page itself is a good example of the boundary it explains: it's
// NOT added to primitives/ or domain/, because it isn't a reusable piece
// of UI — it's a one-off screen that happens to render other components.
// That's the same test you'd apply to any new file: "would this make
// sense outside this one screen?" If no, it's a screen, not a component.

import { useState } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Camera,
  Star,
} from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

import {
  Screen,
  ScreenHeader,
  Button,
  IconButton,
  UserAvatar,
  SurfaceCard,
  StatCard,
  ActionTile,
  QuoteCard,
  TextField,
  SearchField,
  SelectField,
  TextAreaField,
  SegmentedControl,
  FilterChips,
  PhotoPicker,
  ProgressBar,
  EmptyState,
  List,
  ListSection,
} from "@/components/primitives";
import { SortSelect } from "@/components/primitives/Input/SortSelect";
import { Greeting, ProfileHeader, StudentList } from "@/components/domain";

// ---------------------------------------------------------------------------
// Local-only helper for THIS page. Lives in this file, not primitives/,
// because its only job is labeling sections of a demo screen — it has no
// purpose anywhere else in the app. This is the "would this make sense in
// a different screen?" test in action: the answer here is no.
// ---------------------------------------------------------------------------
function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <VStack space="md" className="border-b border-border pb-8">
      <VStack space="xs">
        <Heading size="lg">{title}</Heading>
        {description && (
          <Text className="text-muted-foreground">{description}</Text>
        )}
      </VStack>
      {children}
    </VStack>
  );
}

export default function ComponentCatalogScreen() {
  const [segment, setSegment] = useState<"student" | "teacher">("student");
  const [search, setSearch] = useState("");
  const [selectValue, setSelectValue] = useState<string>();
  const [filter, setFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<{
    field: "name" | "point";
    direction: "asc" | "desc";
  } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  return (
    <Screen
      scrollable
      headerComponent={<ScreenHeader title="Component Catalog" />}
      contentComponent={
        <VStack space="3xl" className="pb-16">
          {/* ------------------------------------------------------------- */}
          {/* THE EXPLANATION — read this first                            */}
          {/* ------------------------------------------------------------- */}
          <VStack space="md" className="border-b border-border pb-8">
            <Heading size="xl">primitives/ vs domain/</Heading>

            <Text>
              <Text className="font-semibold">primitives/</Text> is dumb and
              reusable. It only ever receives props and design tokens — it never
              imports a store hook or calls useNavigation(). You could lift any
              file out of primitives/ and drop it into a totally different app,
              and it would still work, because it doesn't know anything about
              THIS app.
            </Text>

            <Text>
              <Text className="font-semibold">domain/</Text> is where this app's
              actual concerns live: student data shapes, routes, store updates.
              Everything in domain/ is built BY composing primitives/ — it adds
              behavior on top, it doesn't duplicate styling.
            </Text>

            <VStack space="xs" className="bg-muted rounded-lg p-4 mt-2">
              <Text className="font-semibold">
                Where does a new component go?
              </Text>
              <Text>
                1. Does it call useNavigation(), a Zustand store, or reference
                an app-specific type (StudentData, a role, a route)? → domain/
              </Text>
              <Text>
                2. Otherwise, does it only take props/callbacks and render UI? →
                primitives/
              </Text>
              <Text>
                3. Not reusable at all — it's a one-off screen, like this page?
                → it's not a component, it's a screen. Put it in app/, not
                components/.
              </Text>
            </VStack>

            <Text className="text-muted-foreground text-sm">
              Quick test: if you can't describe what the component does without
              naming this app's routes or data (e.g. "shows a student's points
              and navigates to /manages/student"), it's domain/. If you can
              describe it in totally generic terms (e.g. "a card with a color
              and a title"), it's primitives/.
            </Text>
          </VStack>

          {/* ------------------------------------------------------------- */}
          {/* BUTTONS                                                       */}
          {/* ------------------------------------------------------------- */}
          <DemoSection
            title="Button / IconButton"
            description="primitives/Button — one button for the whole app. Takes onPress, never a route."
          >
            <HStack space="md" className="items-center flex-wrap">
              <Button label="Save" onPress={() => {}} />
              <Button label="Cancel" variant="outline" onPress={() => {}} />
              <Button icon={Star} label="With Icon" onPress={() => {}} />
              <IconButton icon={Settings} onPress={() => {}} />
            </HStack>
          </DemoSection>

          {/* ------------------------------------------------------------- */}
          {/* AVATAR                                                        */}
          {/* ------------------------------------------------------------- */}
          <DemoSection
            title="UserAvatar"
            description="primitives/Avatar — shared by Greeting, ProfileHeader, and StudentListItem so all 3 stop duplicating the same markup."
          >
            <HStack space="md" className="items-end">
              <UserAvatar name="Haruto Sato" size="sm" />
              <UserAvatar name="Yui Tanaka" size="md" />
              <UserAvatar name="Sora Kimura" size="lg" />
            </HStack>
          </DemoSection>

          {/* ------------------------------------------------------------- */}
          {/* CARDS                                                         */}
          {/* ------------------------------------------------------------- */}
          <DemoSection
            title="StatCard / ActionTile / QuoteCard"
            description="All three read color+variant from the same shared lookup table (styles/cardColorStyles.ts) via SurfaceCard."
          >
            <VStack space="md">
              <HStack space="md">
                <StatCard
                  title="Active Students"
                  stats="28"
                  icon={GraduationCap}
                  fill
                />
                <StatCard
                  title="Average Points"
                  stats="86"
                  color="success"
                  variant="outline"
                  fill
                />
              </HStack>

              <ActionTile
                title="Manage Students"
                description="View and adjust each student's points"
                icon={Users}
                color="primary"
                variant="outline"
                onPress={() => {}}
              />

              <ActionTile
                title="Waste Sorting Basics"
                description="A learning module on organic, inorganic, and compost"
                icon={BookOpen}
                color="organic"
                variant="solid"
                onPress={() => {}}
              />

              <QuoteCard
                quote="Education is the most powerful weapon which you can use to change the world."
                author="Nelson Mandela"
              />

              {/* SurfaceCard itself, shown raw — this is what StatCard and
                  ActionTile are both built out of. You'd reach for this
                  directly if you need a colored card that isn't either
                  of those two shapes. */}
              <SurfaceCard color="warning" variant="outline">
                {(styles) => (
                  <Text className={styles.text}>
                    Raw SurfaceCard — build a new card shape on this instead of
                    inventing a new color system.
                  </Text>
                )}
              </SurfaceCard>
            </VStack>
          </DemoSection>

          {/* ------------------------------------------------------------- */}
          {/* INPUTS                                                        */}
          {/* ------------------------------------------------------------- */}
          <DemoSection
            title="TextField / SearchField / SelectField / TextAreaField"
            description="primitives/Input — every field follows the same *Field naming, no exceptions."
          >
            <VStack space="md">
              <TextField placeholder="Student name" />
              <SearchField
                value={search}
                onChangeText={setSearch}
                placeholder="Search..."
              />
              <SelectField
                options={[
                  { label: "Class 10A", value: "10a" },
                  { label: "Class 10B", value: "10b" },
                ]}
                value={selectValue}
                onValueChange={setSelectValue}
                placeholder="Select a class"
              />
              <TextAreaField placeholder="Additional notes..." />
            </VStack>
          </DemoSection>

          <DemoSection
            title="SegmentedControl"
            description="Simplified from a 327-line compound component to { options, value, onChange }."
          >
            <SegmentedControl
              value={segment}
              onChange={setSegment}
              options={[
                { value: "student", label: "Student", icon: GraduationCap },
                { value: "teacher", label: "Teacher", icon: Users },
              ]}
            />
          </DemoSection>

          <DemoSection title="FilterChips + SortSelect">
            <VStack space="md">
              <FilterChips
                options={["10A", "10B", "10C"]}
                selected={filter}
                onSelect={setFilter}
              />
              <SortSelect
                options={[
                  {
                    field: "name",
                    label: "Name",
                    ascLabel: "A-Z",
                    descLabel: "Z-A",
                  },
                  {
                    field: "point",
                    label: "Points",
                    ascLabel: "Lowest",
                    descLabel: "Highest",
                  },
                ]}
                value={sort}
                onChange={setSort}
              />
            </VStack>
          </DemoSection>

          <DemoSection title="PhotoPicker">
            <PhotoPicker value={photo} onChange={setPhoto} />
          </DemoSection>

          {/* ------------------------------------------------------------- */}
          {/* FEEDBACK                                                      */}
          {/* ------------------------------------------------------------- */}
          <DemoSection title="ProgressBar / EmptyState">
            <VStack space="md">
              <ProgressBar text="Module completed" value={65} />
              <Box className="border border-dashed border-border rounded-lg">
                <EmptyState message="No data to display." />
              </Box>
            </VStack>
          </DemoSection>

          {/* ------------------------------------------------------------- */}
          {/* LIST                                                          */}
          {/* ------------------------------------------------------------- */}
          <DemoSection
            title="List"
            description="Data-driven replacement for the old 230-line compound MenuList."
          >
            <List
              items={[
                {
                  key: "settings",
                  label: "Settings",
                  icon: Settings,
                  onPress: () => {},
                },
                {
                  key: "camera",
                  label: "Change Photo",
                  icon: Camera,
                  onPress: () => {},
                },
                {
                  key: "logout",
                  label: "Log Out",
                  icon: LogOut,
                  variant: "destructive",
                  onPress: () => {},
                },
              ]}
            />
          </DemoSection>

          {/* ------------------------------------------------------------- */}
          {/* DOMAIN LAYER — everything below this line knows about        */}
          {/* THIS app specifically (routes, roles, student data)          */}
          {/* ------------------------------------------------------------- */}
          <VStack space="xs">
            <Heading size="xl">domain/</Heading>
            <Text className="text-muted-foreground">
              Everything below composes the primitives above and adds
              app-specific behavior on top.
            </Text>
          </VStack>

          <DemoSection
            title="Greeting / ProfileHeader"
            description="Both built on the same UserAvatar primitive instead of duplicating Avatar markup."
          >
            <VStack space="lg">
              <Greeting
                name="Ms. Yamamoto"
                info="Homeroom Teacher, Class 10A"
              />
              <ProfileHeader
                name="Haruto Sato"
                role={{ type: "student", grade: "10A", nis: "2024001" }}
              />
            </VStack>
          </DemoSection>

          <DemoSection
            title="StudentList"
            description="Presentational only — onPress is supplied by the screen, not baked in. This demo just logs; a real screen would navigate or update a store here."
          >
            <ListSection title="Class 10A">
              <StudentList
                data={[
                  { id: "1", name: "Haruto Sato", grade: "10A", point: 85 },
                  { id: "2", name: "Yui Tanaka", grade: "10A", point: 92 },
                ]}
                onPressStudent={(student) =>
                  console.log("pressed", student.name)
                }
              />
            </ListSection>
          </DemoSection>
        </VStack>
      }
    />
  );
}
