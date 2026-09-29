import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Calculate remaining time until the target date
function getRemainingTime(targetDate) {
  const difference =
    new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

// Individual countdown unit
function TimeBox({ value, label }) {
  return (
    <View style={styles.timeBox}>
      <Text style={styles.timeValue}>
        {String(value).padStart(2, "0")}
      </Text>

      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );
}

export default function Countdown({
  targetDate,
  title = "Competition starts in",
}) {
  const [time, setTime] = useState(() =>
    getRemainingTime(targetDate)
  );

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getRemainingTime(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {time.expired ? "Competition is live" : title}
      </Text>

      {!time.expired && (
        <View style={styles.row}>
          <TimeBox value={time.days} label="Days" />
          <Text style={styles.separator}>:</Text>

          <TimeBox value={time.hours} label="Hours" />
          <Text style={styles.separator}>:</Text>

          <TimeBox value={time.minutes} label="Minutes" />
          <Text style={styles.separator}>:</Text>

          <TimeBox value={time.seconds} label="Seconds" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#111111",
  },

  title: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  timeBox: {
    width: 58,
    alignItems: "center",
  },

  timeValue: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },

  timeLabel: {
    marginTop: 3,
    color: "#AAAAAA",
    fontSize: 9,
  },

  separator: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginHorizontal: 2,
    marginBottom: 12,
  },
});