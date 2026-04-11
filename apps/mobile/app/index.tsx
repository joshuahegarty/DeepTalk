import { Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>DeepTalk</Text>
      <Text style={{ color: "#666", marginTop: 8 }}>Mobile app coming soon</Text>
    </View>
  );
}
