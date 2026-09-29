import React, { useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RegistrationCountdown({ targetDate }) {
  const { width } = useWindowDimensions();

  // Calculate remaining registration time
  const calculateTimeLeft = () => {
    const difference =
      new Date(targetDate).getTime() - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (number) => String(number).padStart(2, "0");

  // Responsive sizes
  const isSmallPhone = width < 360;
  const isLargePhone = width >= 430;

  const titleSize = isSmallPhone ? 9 : isLargePhone ? 12 : 11;
  const countdownSize = isSmallPhone ? 11 : isLargePhone ? 15 : 13;
  const hurrySize = isSmallPhone ? 9 : isLargePhone ? 12 : 10;
  const iconSize = isSmallPhone ? 17 : isLargePhone ? 21 : 19;

  return (
    <View className="mx-4 mt-3 rounded-xl bg-[#EAF7F7] px-3 py-3">
      <View className="flex-row items-center">
        {/* Registration status */}
        <View className="flex-1 flex-row items-center">
          <Ionicons
            name="hourglass-outline"
            size={iconSize}
            color="#078895"
          />

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={{
              marginLeft: 6,
              fontSize: titleSize,
              fontWeight: "800",
              color: "#13294B",
              flexShrink: 1,
            }}
          >
            Registration closes in
          </Text>
        </View>

        {/* Countdown */}
        <View className="mx-1 items-center justify-center">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={{
              fontSize: countdownSize,
              fontWeight: "800",
              color: "#078895",
            }}
          >
            {formatNumber(timeLeft.days)}
            {"d : "}
            {formatNumber(timeLeft.hours)}
            {"h : "}
            {formatNumber(timeLeft.minutes)}
            {"m : "}
            {formatNumber(timeLeft.seconds)}
            {"s"}
          </Text>
        </View>

        {/* Hurry-up message */}
        <View className="flex-1 flex-row items-center justify-end">
          <Ionicons
            name="timer-outline"
            size={iconSize}
            color="#078895"
          />

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={{
              marginLeft: 4,
              fontSize: hurrySize,
              fontWeight: "800",
              color: "#13294B",
              flexShrink: 1,
            }}
          >
            Hurry up!
          </Text>
        </View>
      </View>
    </View>
  );
}