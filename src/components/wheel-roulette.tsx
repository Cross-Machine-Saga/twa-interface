import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type InnerCircleRadius = "auto";
type RouletteWheelProps = {
    items: string[];
    size?: number;
    spinDuration?: number;
    minSize?: number;
    maxSize?: number;
    textColor?: string;
    spineStrokeWidth?: number;
    spineStrokeColor?: string;
    colorPalette?: string[];
    innerCircle?: {
        backgroundColor?: string,
        borderColor?: string,
        borderWidth?: string,
        width?: number | InnerCircleRadius,
    },
    className?: string;
    onStart?: () => void;
    onUpdate?: (value: string, index: number) => void;
    onFinish?: (value: string, index: number) => void;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const describeSlice = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M",
        x,
        y,
        "L",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "Z",
    ].join(" ");
};

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
    items,
    size = 320,               // логический размер SVG (viewBox)
    minSize = 240,            // минимум в пикселях
    maxSize = 600,            // максимум в пикселях
    spinDuration = 4500,
    textColor = "black",
    spineStrokeColor = "white",
    spineStrokeWidth = 2,
    colorPalette = [
        "#FFE8EC",
        "#FFEFD5",
        "#E6F4FF",
        "#EAF7EE",
        "#F2E9FF",
        "#FFF5E8",
    ],
    innerCircle = {
        width: 'auto',
        backgroundColor: '#FFFFFF',
        borderColor: '#F0E4FF',
        borderWidth: 3
    },
    className,
    onStart,
    onUpdate,
    onFinish,
}) => {
    const [rotation, setRotation] = useState(0); // в градусах
    const [isSpinning, setIsSpinning] = useState(false);

    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const startRotationRef = useRef(0);
    const targetRotationRef = useRef(0);
    const lastIndexRef = useRef<number | null>(null);

    const radius = size / 2;
    const segmentCount = Math.max(items.length, 2); // подстраховка
    const segmentAngle = 360 / segmentCount;

    const cancelAnimation = () => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    const getCurrentIndexFromRotation = (angle: number) => {
        const normalized = ((angle % 360) + 360) % 360; // 0–359
        // угол под стрелкой (стрелка наверху, колесо крутится)
        const pointerAngle = (360 - normalized) % 360;
        // делим на размер сегмента без смещения на половину
        const idx = Math.floor(pointerAngle / segmentAngle) % segmentCount;
        return idx;
    };

    const step = useCallback(
        (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }
            const elapsed = timestamp - startTimeRef.current;
            const t = Math.min(elapsed / spinDuration, 1);
            const easedT = easeOutCubic(t);

            const currentAngle =
                startRotationRef.current +
                (targetRotationRef.current - startRotationRef.current) * easedT;

            setRotation(currentAngle);

            const currentIndex = getCurrentIndexFromRotation(currentAngle);
            if (currentIndex !== lastIndexRef.current) {
                lastIndexRef.current = currentIndex;
                const value = items[currentIndex];
                if (value && onUpdate) {
                    onUpdate(value, currentIndex);
                }
            }

            if (t < 1) {
                animationFrameRef.current = requestAnimationFrame(step);
            } else {
                setIsSpinning(false);
                const finalIndex = getCurrentIndexFromRotation(currentAngle);
                const finalValue = items[finalIndex];
                if (finalValue && onFinish) {
                    onFinish(finalValue, finalIndex);
                }
                startTimeRef.current = null;
            }
        },
        [items, onUpdate, onFinish, segmentAngle, spinDuration]
    );

    const spin = () => {
        if (isSpinning || items.length === 0) return;

        setIsSpinning(true);
        lastIndexRef.current = null;
        cancelAnimation();

        if (onStart) onStart();

        startRotationRef.current = rotation;

        const extraRotations = 4 + Math.random() * 3;
        const winningIndex = Math.floor(Math.random() * segmentCount);

        const targetAngle =
            startRotationRef.current +
            extraRotations * 360 +
            winningIndex * segmentAngle;

        targetRotationRef.current = targetAngle;

        startTimeRef.current = null;
        animationFrameRef.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        return () => {
            cancelAnimation();
        };
    }, []);

    return (
        <div className={cn("flex flex-col gap-4 mt-10", className)}>
            {/* Респонсив-контейнер: ширина от родителя, но в пределах min/max, всегда квадрат */}
            <div
                className="relative w-full aspect-square"
                style={{
                    minWidth: minSize,
                    maxWidth: maxSize,
                    marginInline: "auto",
                }}
            >
                {/* Колесо */}
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="rounded-full bg-white shadow-2xl w-full h-full"
                >
                    <g
                        transform={`rotate(${rotation} ${radius} ${radius})`}
                        style={{ transition: isSpinning ? "none" : "transform 0.2s" }}
                    >
                        {items.map((label, index) => {
                            const startAngle = index * segmentAngle;
                            const endAngle = (index + 1) * segmentAngle;

                            const path = describeSlice(
                                radius,
                                radius,
                                radius - 4,
                                startAngle,
                                endAngle
                            );

                            // середина сегмента по углу
                            const midAngle = startAngle + segmentAngle / 2;

                            // радиус, на котором лежит текст
                            const textRadius = radius * 0.62;

                            // позиция текста по центру сегмента
                            const textPos = polarToCartesian(
                                radius,
                                radius,
                                textRadius,
                                midAngle
                            );

                            const fill = colorPalette[index % colorPalette.length] || "#FFE8EC";

                            // угол поворота текста относительно центра сегмента
                            // вариант 1 — текст "смотрит к центру сегмента" (радиально)
                            let textRotation = midAngle - 90;

                            // если хочешь, чтобы в нижней части круга текст не был вверх ногами — раскомментируй:
                            //    if (textRotation < -90 || textRotation > 90) {
                            //        textRotation += 180;
                            //    }

                            return (
                                <g key={index}>
                                    <path
                                        d={path}
                                        fill={fill}
                                        stroke={spineStrokeColor}
                                        strokeWidth={spineStrokeWidth}
                                    />

                                    {/* Текст, привязанный к центру сегмента */}
                                    <g transform={`rotate(${textRotation} ${textPos.x} ${textPos.y})`}>
                                        <text
                                            x={textPos.x}
                                            y={textPos.y}
                                            fontSize={Math.max(size * 0.004, 10)}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill={textColor}
                                            style={{ fontWeight: 600 }}
                                        >
                                            {label}
                                        </text>
                                    </g>
                                </g>
                            );
                        })}


                        {/* Центральный круг */}
                        <circle
                            cx={radius}
                            cy={radius}
                            r={innerCircle.width === 'auto' ? size * 0.12 : innerCircle.width}
                            fill={innerCircle.backgroundColor}
                            stroke={innerCircle.borderColor}
                            strokeWidth={innerCircle.borderWidth}
                        />
                    </g>
                </svg>

                {/* Стрелка */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-l-12 border-r-12 border-b-18 border-l-transparent border-r-transparent rotate-180 border-b-red-500 drop-shadow-2xl" />
            </div>

            <Button
                disabled={isSpinning || items.length === 0}
                onClick={spin}
                onMouseDown={(e) => {
                    if (isSpinning || items.length === 0) return;
                    (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 4px 10px rgba(255, 140, 163, 0.25)";
                }}
                onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 8px 20px rgba(255, 140, 163, 0.45)";
                }}
            >
                {isSpinning ? "Крутится..." : "Крутить"}
            </Button>
        </div>
    );
};
