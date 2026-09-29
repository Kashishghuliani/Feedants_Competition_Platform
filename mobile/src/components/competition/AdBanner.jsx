import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Placeholder banner for future advertisements.
export default function AdBanner() {
  return (
    <View className="mx-4 mt-3">
      {/* Ad container */}
      <View className="h-11 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
        <View className="flex-row items-center">
          <Ionicons
            name="megaphone-outline"
            size={19}
            color="#8A94A6"
          />
          <Text className="ml-2 text-sm font-semibold text-slate-500">
            Ad Here
          </Text>
        </View>
      </View>
    </View>
  );
}