import { StyleSheet, TextInput, Button, Dimensions, Text } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import CheckBox from "expo-checkbox";


const { width, height } = Dimensions.get("window");

export default function AddPlanetScreen() {
  const [newDestination, setnewDestination] = useState({
    name: "",
    description: "",
    difficulty: "",
  });

  const handleAddDestination = async () => {
    try {
      const response = await fetch("http://172.20.10.6:8000/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...newDestination,
        }),
      });

      if (response.ok) {
        setnewDestination({
          name: "",
          description: "",
          difficulty: "",
        });
        alert("Destination added successfully!");
        router.replace("/");
      }
    } catch (error) {
      console.error("Full error details:", error);
      alert("Error adding destination");
    }
  };


  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.mainTitle}>
        ¡Descubriste un nuevo destino!
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        ¡Maravilloso! Describelo
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newDestination.name}
        onChangeText={(text) => setnewDestination({ ...newDestination, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        value={newDestination.description}
        onChangeText={(text) =>
          setnewDestination({ ...newDestination, description: text })
        }
      />

      <CheckBox
        value={newDestination.difficulty == 'easy'}
        onValueChange={() => setnewDestination(prev => ({ ...prev, difficulty: 'easy' }))}
        style={styles.checkbox}
      />
      <Text> Easy </Text>
      <CheckBox
        value={newDestination.difficulty == 'medium'}
        onValueChange={() => setnewDestination(prev => ({ ...prev, difficulty: 'medium' }))}
        style={styles.checkbox}
      />
      <Text> Medium </Text>
      <CheckBox
        value={newDestination.difficulty == 'hard'}
        onValueChange={() => setnewDestination(prev => ({ ...prev, difficulty: 'hard' }))}
        style={styles.checkbox}
      />
      <Text> Hard </Text>

      <Button title="Add Destination" onPress={handleAddDestination} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    gap: width * 0.05,
    width: width,
    minHeight: height,
    marginTop: 50,
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
});
