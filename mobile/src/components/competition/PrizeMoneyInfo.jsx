import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrizeMoneyInfo({ onVideoPress }) {
  return (
    <View className="mx-4 mt-4">
      {/* Information cards */}
      <View className="flex-row">
        {/* Prize money video */}
        <Pressable
          onPress={onVideoPress}
          className="mr-1.5 min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white px-3 py-4"
        >
          <View className="flex-row items-center">
            {/* Play button */}
            <View className="h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-feedants-teal">
                <Ionicons name="play" size={16} color="#FFFFFF" />
              </View>
            </View>

            {/* Video information */}
            <View className="ml-2 min-w-0 flex-1">
              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                className="text-[13px] font-extrabold leading-5 text-feedants-navy"
              >
                How will you receive prize money?
              </Text>

              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                className="mt-1 text-[10px] leading-4 text-slate-500"
              >
                Watch video to know more
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Payment and refund information */}
        <View className="ml-1.5 min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white px-3 py-4">
          {/* Refund policy */}
          <View className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={23}
              color="#13294B"
            />

            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              className="ml-2 flex-1 text-[11px] font-medium text-feedants-navy"
            >
              Refund policy
            </Text>
          </View>

          <View className="my-3 h-px bg-slate-100" />

          {/* Secure payment */}
          <View className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={23}
              color="#13294B"
            />

            <View className="ml-2 min-w-0 flex-1">
              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                className="text-[10px] text-feedants-navy"
              >
                Secure payments powered by
              </Text>

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                className="mt-1 text-[13px] font-extrabold italic text-blue-600"
              >
                Razorpay
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}