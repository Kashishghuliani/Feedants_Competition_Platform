import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../context/AuthContext";
import { submitCompetition } from "../services/api";

export default function UploadSubmissionScreen({ route, navigation }) {
  const { competitionId } = route.params || {};
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleSelectFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "text/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      if (result.assets?.length > 0) {
        setSelectedFile(result.assets[0]);
        setSubmissionUrl("");
      }
    } catch (error) {
      console.log("FILE PICKER ERROR:", error);
      Alert.alert(
        "File selection failed",
        "Unable to select the file. Please try again."
      );
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null);
  }

  async function handleSubmit() {
    if (!user) {
      Alert.alert(
        "Login required",
        "Please login to submit your entry."
      );
      return;
    }

    if (!competitionId) {
      Alert.alert(
        "Competition unavailable",
        "Competition information is missing."
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Missing title",
        "Please enter a title for your submission."
      );
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        "Missing description",
        "Please describe your submission."
      );
      return;
    }

    if (!selectedFile && !submissionUrl.trim()) {
      Alert.alert(
        "Submission required",
        "Please upload a file or provide a submission link."
      );
      return;
    }

    try {
      setSubmitting(true);

      console.log("SUBMISSION STARTED");
      console.log("Competition ID:", competitionId);
      console.log("Selected file:", selectedFile);

      const response = await submitCompetition(competitionId, {
        title: title.trim(),
        description: description.trim(),
        submissionUrl: submissionUrl.trim(),
        file: selectedFile,
      });

      console.log("SUBMISSION RESPONSE:", response);

      Alert.alert(
        "Submission successful",
        "Your submission has been submitted successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.log("SUBMISSION ERROR:", error);
      console.log("ERROR MESSAGE:", error?.message);
      console.log("ERROR STATUS:", error?.status);
      console.log("ERROR CODE:", error?.code);

      Alert.alert(
        "Submission failed",
        error?.message || "Something went wrong while submitting."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={23} color="#17345F" />
        </Pressable>

        <Text style={styles.headerTitle}>Upload Submission</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.introCard}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="cloud-upload-outline"
              size={28}
              color="#078895"
            />
          </View>

          <Text style={styles.introTitle}>Submit your entry</Text>

          <Text style={styles.introText}>
            Upload your competition entry before the submission deadline.
          </Text>
        </View>

        <Text style={styles.label}>Submission title</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter submission title"
          placeholderTextColor="#9AA5B5"
          style={styles.input}
          maxLength={100}
        />

        <Text style={styles.label}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your submission..."
          placeholderTextColor="#9AA5B5"
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.descriptionInput]}
          maxLength={1000}
        />

        <Text style={styles.label}>Submission file</Text>

        <Pressable
          onPress={handleSelectFile}
          style={({ pressed }) => [
            styles.uploadBox,
            pressed && styles.uploadBoxPressed,
            selectedFile && styles.uploadBoxSelected,
          ]}
        >
          <View style={styles.uploadIcon}>
            <Ionicons
              name={
                selectedFile
                  ? "document-attach-outline"
                  : "cloud-upload-outline"
              }
              size={25}
              color="#078895"
            />
          </View>

          <Text style={styles.uploadTitle} numberOfLines={1}>
            {selectedFile ? selectedFile.name : "Choose a file"}
          </Text>

          <Text style={styles.uploadSubtitle}>
            {selectedFile
              ? "Tap to choose another file"
              : "PDF, image or document"}
          </Text>
        </Pressable>

        {selectedFile && (
          <View style={styles.selectedFileCard}>
            <View style={styles.selectedFileLeft}>
              <Ionicons
                name="document-outline"
                size={20}
                color="#078895"
              />

              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>

                {selectedFile.size ? (
                  <Text style={styles.fileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                ) : null}
              </View>
            </View>

            <Pressable
              onPress={handleRemoveFile}
              hitSlop={10}
              style={styles.removeButton}
            >
              <Ionicons
                name="close-circle"
                size={23}
                color="#D9534F"
              />
            </Pressable>
          </View>
        )}

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.label}>Submission link</Text>

        <TextInput
          value={submissionUrl}
          onChangeText={(text) => {
            setSubmissionUrl(text);
            if (text.trim()) setSelectedFile(null);
          }}
          placeholder="https://..."
          placeholderTextColor="#9AA5B5"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.input}
        />

        <View style={styles.note}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color="#078895"
          />

          <Text style={styles.noteText}>
            You can provide either a file or a submission link.
          </Text>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            submitting && styles.submitDisabled,
          ]}
        >
          {submitting ? (
            <View style={styles.buttonRow}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={[styles.submitText, { marginLeft: 9 }]}>
                Submitting...
              </Text>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <Ionicons
                name="send-outline"
                size={19}
                color="#FFFFFF"
              />
              <Text style={[styles.submitText, { marginLeft: 8 }]}>
                Submit Entry
              </Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.bottomText}>
          Make sure your submission is final before submitting.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F8",
  },

  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECEF",
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#17345F",
  },

  headerSpacer: {
    width: 38,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },

  introCard: {
    backgroundColor: "#EAF7F7",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 24,
  },

  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#17345F",
  },

  introText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: "#6B7890",
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#17345F",
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8EC",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#17345F",
    marginBottom: 18,
  },

  descriptionInput: {
    height: 125,
    paddingTop: 14,
  },

  uploadBox: {
    minHeight: 125,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#B9DCDD",
    borderStyle: "dashed",
    backgroundColor: "#F9FFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
  },

  uploadBoxPressed: {
    opacity: 0.7,
  },

  uploadBoxSelected: {
    backgroundColor: "#F1FAFA",
    borderColor: "#078895",
  },

  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EAF7F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  uploadTitle: {
    maxWidth: "85%",
    fontSize: 14,
    fontWeight: "800",
    color: "#17345F",
  },

  uploadSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#8A96A8",
  },

  selectedFileCard: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8E9",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginBottom: 20,
  },

  selectedFileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  fileInfo: {
    flex: 1,
    marginLeft: 9,
  },

  fileName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#17345F",
  },

  fileSize: {
    marginTop: 2,
    fontSize: 11,
    color: "#8A96A8",
  },

  removeButton: {
    marginLeft: 10,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8EC",
  },

  orText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "800",
    color: "#9AA5B5",
  },

  note: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7890",
  },

  submitButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#078895",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  bottomText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 11,
    color: "#8A96A8",
  },
});