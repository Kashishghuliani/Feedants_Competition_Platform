import React from "react";

import {
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "2-digit",
    }
  );
}


function formatTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
}


function DateItem({
  icon,
  title,
  value,
}) {
  return (
    <View className="min-w-0 flex-1 flex-row items-center p-3">

      {/* ICON */}

      <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">

        <Ionicons
          name={icon}
          size={20}
          color="#078895"
        />

      </View>


      {/* CONTENT */}

      <View className="ml-2 min-w-0 flex-1">

        {/* TITLE */}

        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          className="text-[11px] text-slate-500"
        >
          {title}
        </Text>


        {/* DATE */}

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className="mt-1 text-[13px] font-bold text-feedants-teal"
        >
          {formatDate(value)}
        </Text>


        {/* TIME */}

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className="text-[13px] font-semibold text-feedants-navy"
        >
          {formatTime(value)}
        </Text>

      </View>

    </View>
  );
}


export default function ImportantDates({
  competition,
}) {

  return (

    <View className="mx-4 mt-3 rounded-2xl border border-slate-100 bg-white p-4">

      {/* =========================
          TITLE
      ========================= */}

      <Text
        className="text-base font-extrabold text-feedants-navy"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.9}
      >
        Important Dates
      </Text>


      {/* =========================
          DATE GRID
      ========================= */}

      <View className="mt-3 overflow-hidden rounded-xl border border-slate-100">

        {/* =========================
            FIRST ROW
        ========================= */}

        <View className="flex-row">

          <DateItem
            icon="calendar-outline"
            title="Register Before"
            value={
              competition?.registrationDeadline
            }
          />


          {/* VERTICAL DIVIDER */}

          <View className="w-px bg-slate-100" />


          <DateItem
            icon="paper-plane-outline"
            title="Submission Starts"
            value={
              competition?.submissionStart
            }
          />

        </View>


        {/* =========================
            HORIZONTAL DIVIDER
        ========================= */}

        <View className="h-px bg-slate-100" />


        {/* =========================
            SECOND ROW
        ========================= */}

        <View className="flex-row">

          <DateItem
            icon="cloud-upload-outline"
            title="Submission Ends"
            value={
              competition?.submissionEnd
            }
          />


          {/* VERTICAL DIVIDER */}

          <View className="w-px bg-slate-100" />


          <DateItem
            icon="trophy-outline"
            title="Result Date"
            value={
              competition?.resultDate
            }
          />

        </View>

      </View>

    </View>

  );
}