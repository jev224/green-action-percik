import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { type LayoutChangeEvent, Platform, Pressable } from "react-native";
import { EaseView } from "react-native-ease";

/**
 * How many cards are visible in the stack.
 */
const VISIBLE_CARDS = 2;

/**
 * How much of each card peeks out from behind the card in front.
 */
const CARD_PEEK = 16;

/**
 * Scale reduction for each card behind the front card.
 *
 * rank 0 → 1.0
 * rank 1 → 0.9
 * rank 2 → 0.8
 */
const SCALE_STEP = 0.1;

/**
 * Opacity reduction for each card behind the front card.
 */
const OPACITY_STEP = 0.1;

/**
 * Card width / height.
 */
const CARD_ASPECT_RATIO = 3 / 4;

/**
 * Prevent the card from becoming too wide relative to its container.
 */
const MAX_CARD_WIDTH_RATIO = 0.85;

/**
 * Duration of the card flying away.
 */
const FLY_DURATION = 500;

/**
 * Additional time to let the stack settle before allowing
 * another shuffle.
 */
const SETTLE_DURATION = 450;

const CARD_BORDER_RADIUS = 20;
const CARD_BACKGROUND = "#d4d4d4";

const STACK_SPRING = {
	type: "spring" as const,
	damping: 18,
	stiffness: 160,
	mass: 1,
};

type PhotoCardProps = {
	photos?: string[];

	/**
	 * Automatically shuffle the cards at this interval.
	 * Set to 0 to disable auto-shuffling.
	 */
	intervalMs?: number;
};

type CardArea = {
	width: number;
	height: number;
};

type CardPose = {
	scale: number;
	translateY: number;
	opacity: number;
};

export function PhotoCard({ photos = [], intervalMs = 8000 }: PhotoCardProps) {
	const [cardOrder, setCardOrder] = useState(() =>
		photos.map((_, index) => index),
	);

	const [isFlying, setIsFlying] = useState(false);

	const [cardArea, setCardArea] = useState<CardArea>({
		width: 0,
		height: 0,
	});

	/**
	 * Prevent multiple shuffle animations from running at once.
	 */
	const isBusy = useRef(false);

	/**
	 * Keep track of delayed shuffle callbacks so they can
	 * be cancelled when the component unmounts.
	 */
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	/**
	 * Update the available space for the card stack.
	 */
	const handleLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;

		setCardArea({ width, height });
	};

	/**
	 * Move the front card to the back of the stack.
	 *
	 * Animation flow:
	 *
	 * 1. Front card flies away.
	 * 2. Front card moves to the back of the order.
	 * 3. Stack settles into its new positions.
	 */
	const shuffle = useCallback(() => {
		if (isBusy.current || photos.length < 2) {
			return;
		}

		isBusy.current = true;
		setIsFlying(true);

		const moveCardToBack = setTimeout(() => {
			setCardOrder((currentOrder) => [
				...currentOrder.slice(1),
				currentOrder[0],
			]);

			setIsFlying(false);
		}, FLY_DURATION);

		const unlockShuffle = setTimeout(() => {
			isBusy.current = false;
		}, FLY_DURATION + SETTLE_DURATION);

		timers.current.push(moveCardToBack, unlockShuffle);
	}, [photos.length]);

	/**
	 * Start automatic shuffling.
	 */
	useEffect(() => {
		if (!intervalMs) {
			return;
		}

		const interval = setInterval(shuffle, intervalMs);

		return () => {
			clearInterval(interval);
		};
	}, [shuffle, intervalMs]);

	/**
	 * Clean up delayed shuffle callbacks.
	 */
	useEffect(() => {
		return () => {
			timers.current.forEach(clearTimeout);
		};
	}, []);

	/**
	 * The cards behind the front card need vertical space to peek out.
	 *
	 * Example with VISIBLE_CARDS = 2:
	 *
	 * ┌──────────────┐
	 * │   back card  │ ← 16px visible
	 * ├──────────────┤
	 * │              │
	 * │  front card  │
	 * │              │
	 * └──────────────┘
	 */
	const totalPeekSpace = (VISIBLE_CARDS - 1) * CARD_PEEK;

	/**
	 * Calculate the largest card height that fits inside the available area.
	 *
	 * The card is constrained by both:
	 *
	 * - available height after accounting for peeking cards
	 * - maximum allowed width
	 */
	const cardHeight = Math.min(
		cardArea.height - totalPeekSpace,
		(cardArea.width * MAX_CARD_WIDTH_RATIO) / CARD_ASPECT_RATIO,
	);

	const isReady = cardArea.width > 0 && cardHeight > 0;

	/**
	 * Offset the entire stack so the front card + peeking area
	 * stay visually centered.
	 */
	const stackOffsetY = totalPeekSpace / 2;

	/**
	 * Calculate the visual position of a card based on its
	 * position in the stack.
	 *
	 * rank 0 = front card
	 * rank 1 = card directly behind it
	 * rank 2 = next card
	 */
	const getCardPose = (rank: number): CardPose => {
		const visibleRank = Math.min(rank, VISIBLE_CARDS - 1);

		const scale = 1 - visibleRank * SCALE_STEP;

		/**
		 * Scaling happens around the card's center.
		 *
		 * Because of that, simply moving the card by CARD_PEEK
		 * would not produce an exact 16px peek. This compensates
		 * for the height lost from scaling.
		 */
		const scaleCompensation = (cardHeight * (1 - scale)) / 2;

		const translateY = -(
			stackOffsetY -
			visibleRank * CARD_PEEK -
			scaleCompensation
		);

		const opacity = rank < VISIBLE_CARDS ? 1 - visibleRank * OPACITY_STEP : 0;

		return {
			scale,
			translateY,
			opacity,
		};
	};

	/**
	 * The front card uses a special pose while leaving the stack.
	 */
	const getAnimatedPose = (rank: number, isFrontCard: boolean): CardPose => {
		if (isFrontCard && isFlying) {
			return {
				...getCardPose(0),
				opacity: 0,
				translateY: 20,
			};
		}

		return getCardPose(rank);
	};

	return (
		<Pressable
			pointerEvents={Platform.OS === "web" ? "none" : "auto"}
			className="flex-1 w-full justify-center items-center"
			onPress={shuffle}
			onLayout={handleLayout}
		>
			{isReady &&
				photos.map((uri, photoIndex) => {
					const rank = cardOrder.indexOf(photoIndex);
					const isFrontCard = rank === 0;

					const pose = getAnimatedPose(rank, isFrontCard);

					return (
						<EaseView
							key={uri}
							animate={pose}
							transition={STACK_SPRING}
							style={{
								position: "absolute",
								inset: 0,
								borderRadius: CARD_BORDER_RADIUS,
								overflow: "hidden",
								backgroundColor: CARD_BACKGROUND,

								/**
								 * Higher rank = further back.
								 *
								 * The front card therefore always renders above
								 * the cards behind it.
								 */
								zIndex: photos.length - rank,
							}}
						>
							<Image
								source={{ uri }}
								style={{
									width: "100%",
									height: "100%",
								}}
								contentFit="cover"
							/>
						</EaseView>
					);
				})}
		</Pressable>
	);
}
