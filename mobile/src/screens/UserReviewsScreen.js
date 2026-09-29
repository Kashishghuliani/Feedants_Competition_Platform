import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const reviews = [
  {
    id: "1",
    name: "Aarav Sharma",
    role: "Competition Participant",
    rating: 5,
    review:
      "Feedants made participating in competitions really simple. The whole process from registration to submission was smooth.",
  },
  {
    id: "2",
    name: "Priya Verma",
    role: "Creative Participant",
    rating: 5,
    review:
      "I really liked how easy it was to discover competitions and submit my work. The experience was simple and user friendly.",
  },
  {
    id: "3",
    name: "Rahul Mehta",
    role: "Competition Participant",
    rating: 4,
    review:
      "The competition details are clear and the submission process is convenient. Looking forward to joining more competitions.",
  },
  {
    id: "4",
    name: "Sneha Kapoor",
    role: "Participant",
    rating: 5,
    review:
      "A great platform for people who want to showcase their talent and participate in different competitions.",
  },
];

export default function UserReviewsScreen({ navigation }) {
  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={["top", "left", "right"]}
    >
      {/* HEADER */}
      <View className="flex-row items-center px-5 pb-4 pt-3">
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={22} color="#17345F" />
        </Pressable>

        <View className="ml-3 flex-1">
          <Text className="text-xl font-extrabold text-feedants-navy">
            Hear From Our Users
          </Text>
          <Text className="mt-0.5 text-xs text-slate-500">
            What participants say about Feedants
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 35 }}
      >
        {/* INTRO */}
        <View className="mb-4 rounded-2xl bg-feedants-teal p-5">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="chatbubbles-outline" size={24} color="#FFFFFF" />
          </View>

          <Text className="mt-4 text-xl font-extrabold text-white">
            What our users say
          </Text>

          <Text className="mt-2 text-sm leading-5 text-white/90">
            Discover experiences shared by participants who have joined
            competitions on Feedants.
          </Text>
        </View>

        {/* REVIEWS */}
        {reviews.map((review) => (
          <View
            key={review.id}
            className="mb-3 rounded-2xl border border-slate-100 bg-white p-5"
          >
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                <Text className="text-lg font-extrabold text-feedants-teal">
                  {review.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-base font-extrabold text-feedants-navy">
                  {review.name}
                </Text>
                <Text className="mt-0.5 text-xs text-slate-400">
                  {review.role}
                </Text>
              </View>
            </View>

            {/* RATING */}
            <View className="mt-4 flex-row">
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < review.rating ? "star" : "star-outline"}
                  size={17}
                  color="#F59E0B"
                  style={{ marginRight: 3 }}
                />
              ))}
            </View>

            {/* REVIEW */}
            <Text className="mt-3 text-sm leading-5 text-slate-600">
              "{review.review}"
            </Text>
          </View>
        ))}

        {/* BOTTOM MESSAGE */}
        <View className="mt-2 items-center rounded-2xl border border-slate-100 bg-white p-5">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-teal-50">
            <Ionicons name="heart-outline" size={23} color="#078895" />
          </View>

          <Text className="mt-3 text-base font-extrabold text-feedants-navy">
            Thank you for being part of Feedants
          </Text>

          <Text className="mt-1 text-center text-xs leading-5 text-slate-400">
            Your participation and feedback help us make the platform better.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}