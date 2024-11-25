import {
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Text,
  Pressable,
} from "react-native";

import React, { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [destinations, setdestinations] = useState([]);
  const router = useRouter();


  // PARA VER EL DESTINO AGREGADO, HAY QUE HACER UN RELOAD

  // NO HAY FAVORITOS

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { backgroundColor: 'green' };
      case 'medium':
        return { backgroundColor: 'yellow' };
      case 'hard':
        return { backgroundColor: 'purple' };
    }
  };

  const sortDestinations = (destinations) => {
    return destinations.sort((a, b) => a.name.localeCompare(b.name));
  };
  


  const handleFetchFeed = async () => {
    try {
      const destinationsFetch = await fetch("http://172.20.10.6:8000/destinations");
      const destinations = await destinationsFetch.json();
      return destinations;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  };

  useEffect(() => {
    handleFetchFeed().then((destinations) => {
      setdestinations(sortDestinations(destinations));
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://172.20.10.6:8000/destinations/${id}`, {
        method: 'DELETE',
      });
      const updatedDestinations = destinations.filter(dest => dest.id !== id);
      setdestinations(updatedDestinations);
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };



  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            <Text style={styles.title}>🌍Destinos Disponibles🌍</Text>
          </ThemedView>

          {destinations.map((destination) => (
            <ThemedView key={destination.id} style={styles.card}>
              <ThemedView style={styles.destinationContainer}>
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "./../editar",
                      params: { destinationId: destination.id },
                    });
                  }}
                  style={styles.button}
                >
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <ThemedView style={[styles.difficultyTag, getDifficultyColor(destination.difficulty)]}>
                    <Text style={styles.difficultyText}>{destination.difficulty}</Text>
                  </ThemedView>
                </Pressable>
                <ThemedView style={styles.actionButtons}>
                  <Pressable
                    style={styles.isFavoriteButton}
                  >
                   <MaterialIcons name="favorite" size={24} color="black" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(destination.id)}
                    style={styles.deleteButton}
                  >
                    <Feather name="trash-2" size={24} color="black" />
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </ThemedView>


          ))}


        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  isFavoriteButton: {
    padding: 10,
    marginRight: 5,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },

  deleteText: {
    fontSize: width * 0.05,
    color: '#FF0000',
    fontWeight: 'bold',
  },

  destinationName: {
    fontSize: width * 0.05,
    color: "#1D3D47",
    textAlign: "center",
  },

  button: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },

  image: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: "cover",
    borderRadius: width * 0.03,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    padding: width * 0.05,
    gap: width * 0.05,
    width: width,
    minHeight: height,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#1D3D47",
    textAlign: "center",
  },

  card: {
    padding: width * 0.05,
    borderRadius: width * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    elevation: 8,
    marginBottom: height * 0.02,
    width: width * 0.92,
    alignSelf: "center",
  },
});
