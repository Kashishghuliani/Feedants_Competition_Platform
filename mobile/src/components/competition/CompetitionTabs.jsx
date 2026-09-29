import React, { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

export default function CompetitionTabs({ competition }) {
  const { width } = useWindowDimensions();
  const isSmallPhone = width < 360;

  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { key: "about", title: "About Competition" },
    { key: "judging", title: "Judging Parameters" },
    { key: "rules", title: "Rules & Eligibility" },
  ];

  const tabFontSize = isSmallPhone ? 9 : 11;

  return (
    <View className="mx-4 mt-4 rounded-2xl border border-slate-100 bg-white p-4">
      {/* Tabs */}
      <View className="flex-row border-b border-slate-200">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className="flex-1 items-center pb-3"
              hitSlop={5}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={{
                  fontSize: tabFontSize,
                  fontWeight: "700",
                  color: active ? "#078895" : "#64748B",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {tab.title}
              </Text>

              {/* Active tab indicator */}
              {active && (
                <View
                  className="absolute bottom-[-1px] h-0.5 rounded-full bg-feedants-teal"
                  style={{ left: 4, right: 4 }}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* About competition */}
      {activeTab === "about" && (
        <View className="pt-4">
          <Text className="text-sm leading-6 text-slate-600">
            {competition?.description || "No description available."}
          </Text>
        </View>
      )}

      {/* Judging parameters */}
      {activeTab === "judging" && (
        <View className="pt-4">
          {Array.isArray(competition?.judgingParameters) &&
          competition.judgingParameters.length > 0 ? (
            competition.judgingParameters.map((parameter, index) => {
              const text =
                typeof parameter === "object"
                  ? parameter.title || parameter.name || "Parameter"
                  : String(parameter);

              return (
                <View key={index} className="mb-3 flex-row">
                  <View className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-feedants-teal" />
                  <Text className="ml-3 flex-1 text-sm leading-5 text-slate-600">
                    {text}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text className="text-sm text-slate-500">
              Judging parameters will be available soon.
            </Text>
          )}
        </View>
      )}

      {/* Rules and eligibility */}
      {activeTab === "rules" && (
        <View className="pt-4">
          {Array.isArray(competition?.rules) &&
          competition.rules.length > 0 ? (
            competition.rules.map((rule, index) => {
              const text =
                typeof rule === "object"
                  ? rule.title || rule.name || "Rule"
                  : String(rule);

              return (
                <View key={index} className="mb-3 flex-row">
                  <Text className="w-6 flex-shrink-0 text-sm font-bold text-feedants-teal">
                    {index + 1}.
                  </Text>
                  <Text className="flex-1 text-sm leading-5 text-slate-600">
                    {text}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text className="text-sm text-slate-500">
              Rules and eligibility details will be available soon.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}