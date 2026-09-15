import {
	Easing,
	type EntryAnimationsValues,
	type ExitAnimationsValues,
	FadeInDown,
	FadeOutUp,
	LinearTransition,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";

export const AnimationConfig = {
	// ─────────────────────────────────────────────
	// Spring
	// ─────────────────────────────────────────────

	spring: {
		bouncy: {
			damping: 9,
			stiffness: 500,
			mass: 0.45,
		},

		soft: {
			damping: 16,
			stiffness: 220,
			mass: 0.7,
		},

		subtle: {
			damping: 20,
			stiffness: 180,
			mass: 0.8,
		},

		snappy: {
			damping: 12,
			stiffness: 200,
			mass: 0.5,
		},

		heavy: {
			damping: 22,
			stiffness: 140,
			mass: 1,
		},
	},

	// ─────────────────────────────────────────────
	// Timing
	// ─────────────────────────────────────────────

	timing: {
		fastEnter: {
			duration: 160,
			easing: Easing.out(Easing.cubic),
		},

		fastExit: {
			duration: 120,
			easing: Easing.in(Easing.cubic),
		},

		smoothEnter: {
			duration: 420,
			easing: Easing.out(Easing.cubic),
		},

		smoothExit: {
			duration: 180,
			easing: Easing.ease,
		},

		slowEnter: {
			duration: 320,
			easing: Easing.out(Easing.cubic),
		},

		slowExit: {
			duration: 260,
			easing: Easing.in(Easing.cubic),
		},

		emphasizedEnter: {
			duration: 320,
			easing: Easing.out(Easing.back(1.1)),
		},

		emphasizedExit: {
			duration: 240,
			easing: Easing.in(Easing.cubic),
		},

		linear: {
			duration: 200,
			easing: Easing.linear,
		},
	},
} as const;

export const EaseTranstionConfig = {
	spring: Object.fromEntries(
		Object.entries(AnimationConfig.spring).map(([name, config]) => [
			name,
			{
				damping: config.damping * 0.75,
				stiffness: config.stiffness * 1.5,
				mass: config.mass * 0.75,
			},
		]),
	),

	timing: AnimationConfig.timing,
} as typeof AnimationConfig;

export const ProfileMenuGlideIn = (values: EntryAnimationsValues) => {
	"worklet";

	return {
		initialValues: {
			opacity: 0,
			originX: 20,
			originY: -80,
			transform: [{ scale: 0.5 }],
		},

		animations: {
			opacity: withTiming(1, {
				duration: 100,
			}),

			originX: withSpring(values.targetOriginX, {
				damping: 18,
				stiffness: 260,
				mass: 0.7,
			}),

			originY: withSpring(values.targetOriginY, {
				damping: 16,
				stiffness: 280,
				mass: 0.7,
			}),

			transform: [
				{
					scale: withSpring(1, {
						damping: 14,
						stiffness: 300,
						mass: 0.7,
					}),
				},
			],
		},
	};
};

const _layoutEasing = Easing.bezier(0.39, 0.06, 0.07, 0.99);

export const contentLayoutTransition = LinearTransition.springify()
	.damping(25)
	.stiffness(280)
	.mass(0.8);

export const contentEnterTransition = FadeInDown.easing(Easing.out(Easing.ease))
	.duration(260)
	.delay(100);

export const contentExitTransition = FadeOutUp.easing(
	Easing.in(Easing.ease),
).duration(220);

export const ProfileMenuGlideOut = (values: ExitAnimationsValues) => {
	"worklet";

	return {
		initialValues: {
			opacity: 1,
			originX: values.currentOriginX,
			originY: values.currentOriginY,
			transform: [{ scale: 1 }],
		},

		animations: {
			opacity: withTiming(0, {
				duration: 120,
			}),

			originX: withTiming(20, {
				duration: 140,
			}),
			originY: withTiming(-40, {
				duration: 140,
			}),
			transform: [
				{
					scale: withSequence(
						withTiming(0.92, {
							duration: 70,
						}),
						withTiming(1, {
							duration: 70,
						}),
					),
				},
			],
		},
	};
};

type DrawerDirection = "top" | "bottom" | "left" | "right";

const getOffset = (direction: DrawerDirection) => {
	"worklet";

	switch (direction) {
		case "top":
			return { x: 0, y: -80 };

		case "bottom":
			return { x: 0, y: 80 };

		case "left":
			return { x: -80, y: 0 };

		case "right":
			return { x: 80, y: 0 };
	}
};

const drawerSpringConfig = {
	damping: 15,
	stiffness: 220,
	mass: 0.7,
};

export const DrawerIn = {
	direction: (direction: DrawerDirection) => {
		"worklet";

		return (values: EntryAnimationsValues) => {
			"worklet";

			const offset = getOffset(direction);

			return {
				initialValues: {
					opacity: 0,
					originX: values.targetOriginX + offset.x,
					originY: values.targetOriginY + offset.y,
					transform: [{ scale: 0.92 }],
				},

				animations: {
					opacity: withTiming(1, {
						duration: 100,
					}),

					originX: withSpring(values.targetOriginX, drawerSpringConfig),

					originY: withSpring(values.targetOriginY, drawerSpringConfig),

					transform: [
						{
							scale: withSpring(1, {
								damping: 16,
								stiffness: 300,
								mass: 0.7,
							}),
						},
					],
				},
			};
		};
	},
};

export const DrawerOut = {
	direction: (direction: DrawerDirection) => {
		"worklet";

		return (values: ExitAnimationsValues) => {
			"worklet";

			const offset = getOffset(direction);

			return {
				initialValues: {
					opacity: 1,
					originX: values.currentOriginX,
					originY: values.currentOriginY,
					transform: [{ scale: 1 }],
				},

				animations: {
					opacity: withTiming(0, {
						duration: 100,
					}),

					originX: withSpring(
						values.currentOriginX + offset.x,
						drawerSpringConfig,
					),

					originY: withSpring(
						values.currentOriginY + offset.y,
						drawerSpringConfig,
					),

					transform: [
						{
							scale: withSpring(0.92, {
								damping: 18,
								stiffness: 300,
								mass: 0.7,
							}),
						},
					],
				},
			};
		};
	},
};

export const DialogPopIn = (_values: EntryAnimationsValues) => {
	"worklet";

	return {
		initialValues: {
			opacity: 0,
			transform: [{ scale: 0.88 }],
		},

		animations: {
			opacity: withTiming(1, {
				duration: 180,
				easing: Easing.out(Easing.cubic),
			}),

			transform: [
				{
					scale: withSpring(1, AnimationConfig.spring.bouncy),
				},
			],
		},
	};
};

export const DialogPopOut = (_values: ExitAnimationsValues) => {
	"worklet";

	return {
		initialValues: {
			opacity: 1,
			transform: [{ scale: 1 }],
		},

		animations: {
			opacity: withTiming(0, {
				duration: 140,
				easing: Easing.in(Easing.cubic),
			}),

			transform: [
				{
					scale: withTiming(0.92, {
						duration: 140,
						easing: Easing.in(Easing.cubic),
					}),
				},
			],
		},
	};
};
