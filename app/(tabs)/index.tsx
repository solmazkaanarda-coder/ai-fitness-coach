import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [screen, setScreen] = useState("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("Fat Loss");
  const [plan, setPlan] = useState("Free");

  if (screen === "welcome") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.pageBetween}>
          <View>
            <Text style={styles.logoBlue}>AI</Text>
            <Text style={styles.logo}>FITNESS COACH</Text>
            <Text style={styles.title}>Your body transformation starts here.</Text>
            <Text style={styles.subtitle}>
              Personalized fitness plans, smart coaching, water tracking and progress insights.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("account")}>
            <Text style={styles.primaryText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "account") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.page}>
          <Text style={styles.header}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#8A92A6"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("body")}>
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "body") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.header}>Body Profile</Text>

          <TextInput style={styles.input} placeholder="Age" placeholderTextColor="#8A92A6" value={age} onChangeText={setAge} />
          <TextInput style={styles.input} placeholder="Height (cm)" placeholderTextColor="#8A92A6" value={height} onChangeText={setHeight} />
          <TextInput style={styles.input} placeholder="Weight (kg)" placeholderTextColor="#8A92A6" value={weight} onChangeText={setWeight} />

          <Text style={styles.sectionTitle}>Goal</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.choice, goal === "Fat Loss" && styles.choiceActive]}
              onPress={() => setGoal("Fat Loss")}
            >
              <Text style={styles.choiceText}>Fat Loss</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choice, goal === "Muscle Gain" && styles.choiceActive]}
              onPress={() => setGoal("Muscle Gain")}
            >
              <Text style={styles.choiceText}>Muscle Gain</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("plan")}>
            <Text style={styles.primaryText}>Create Plan</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "plan") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.page}>
          <Text style={styles.header}>Choose Your Plan</Text>

          <TouchableOpacity style={[styles.planCard, plan === "Free" && styles.planActive]} onPress={() => setPlan("Free")}>
            <Text style={styles.planTitle}>Free</Text>
            <Text style={styles.planText}>Basic dashboard, daily goals, water tracking.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.planCard, plan === "Premium" && styles.planActive]} onPress={() => setPlan("Premium")}>
            <Text style={styles.planTitle}>Premium</Text>
            <Text style={styles.planText}>AI coach, video analysis, progress insights, advanced plans.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("dashboard")}>
            <Text style={styles.primaryText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.header}>Hello, {name || "Athlete"} 👋</Text>
        <Text style={styles.subtitle}>Today is a strong day. Keep moving.</Text>

        <View style={styles.grid}>
          <StatCard title="Calories" value="1750 / 2200" />
          <StatCard title="Protein" value="120 / 150g" />
          <StatCard title="Water" value="1.6 / 3L" />
          <StatCard title="Steps" value="8432 / 10000" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Goal</Text>
          <Text style={styles.cardText}>{goal}</Text>
          <Text style={styles.cardText}>Plan: {plan}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Coach</Text>
          <Text style={styles.cardText}>
            Great start. Stay consistent, hit your protein goal and drink more water today.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ title, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#05070D",
  },
  page: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  pageBetween: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  logoBlue: {
    color: "#2F9BFF",
    fontSize: 48,
    fontWeight: "900",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 50,
  },
  subtitle: {
    color: "#9EA7B8",
    fontSize: 17,
    lineHeight: 26,
    marginTop: 14,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#121826",
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#232B3B",
  },
  primaryButton: {
    backgroundColor: "#2F9BFF",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  choice: {
    flex: 1,
    backgroundColor: "#121826",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#232B3B",
  },
  choiceActive: {
    borderColor: "#2F9BFF",
    backgroundColor: "#10253D",
  },
  choiceText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  planCard: {
    backgroundColor: "#121826",
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#232B3B",
  },
  planActive: {
    borderColor: "#2F9BFF",
  },
  planTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  planText: {
    color: "#9EA7B8",
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#121826",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#232B3B",
  },
  statTitle: {
    color: "#9EA7B8",
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#121826",
    padding: 20,
    borderRadius: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#232B3B",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  cardText: {
    color: "#9EA7B8",
    fontSize: 16,
    lineHeight: 24,
  },
});
