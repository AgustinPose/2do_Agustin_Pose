import { StyleSheet, Dimensions, Button, TextInput, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, router } from "expo-router";
import CheckBox from "expo-checkbox";
const { width, height } = Dimensions.get("window");

export default function destinationDetails() {
    const { destinationId } = useLocalSearchParams();
    const [destinationDetails, setdestinationDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDestination, seteditedDestination] = useState({
        name: "",
        description: "",
        difficulty: "",
    });

    const fetchdestinationDetails = async () => {
        try {
            const response = await fetch(`http://172.20.10.6:8000/destinations/${destinationId}`);
            const data = await response.json();
            setdestinationDetails(data);
            seteditedDestination(data);
        } catch (error) {
            console.error("Error fetching destination details:", error);
        }
    };

    const handleUpdatePlanet = async () => {
        try {
            const response = await fetch(`http://172.20.10.6:8000/destinations/${destinationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedDestination),
            });
            const updatedDestination = await response.json();
            setdestinationDetails(updatedDestination);
            setIsEditing(false);
            router.replace("/");
        } catch (error) {
            console.error("Error updating destination:", error);
        }
    };


    useEffect(() => {
        fetchdestinationDetails();
    }, [destinationId]);

    return (
        <ThemedView style={styles.container}>
            {destinationDetails && (
                <>
                    {isEditing ? (
                        <>
                            <TextInput
                                style={styles.input}
                                value={editedDestination.name}
                                onChangeText={(text) => seteditedDestination(prev => ({ ...prev, name: text }))}
                                placeholder="Nombre del destino"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedDestination.description}
                                onChangeText={(text) => seteditedDestination(prev => ({ ...prev, description: text }))}
                                placeholder="Descripción"
                                multiline
                            />


                            <CheckBox
                                value={editedDestination.difficulty == 'easy'}
                                onValueChange={() => seteditedDestination(prev => ({ ...prev, difficulty: 'easy' }))}
                                style={styles.checkbox}
                            />
                            <Text> Easy </Text>
                            <CheckBox
                                value={editedDestination.difficulty == 'medium'}
                                onValueChange={() => seteditedDestination(prev => ({ ...prev, difficulty: 'medium' }))}
                                style={styles.checkbox}
                            />
                            <Text> Medium </Text>
                            <CheckBox
                                value={editedDestination.difficulty == 'hard'}
                                onValueChange={() => seteditedDestination(prev => ({ ...prev, difficulty: 'hard' }))}
                                style={styles.checkbox}
                            />
                            <Text> Hard </Text>


                            <Button title="Guardar Cambios" onPress={handleUpdatePlanet} />
                            <Button title="Cancelar" onPress={() => setIsEditing(false)} />
                        </>
                    ) : (
                        <>

                            <ThemedText type="title" style={styles.name}>
                                {destinationDetails.name}
                            </ThemedText>

                            <ThemedText type="default" style={styles.description}>
                                {destinationDetails.description}
                            </ThemedText>

                            <ThemedText>
                                Dificultad: {destinationDetails.difficulty}
                            </ThemedText>
                            <Button title="Editar Destino" onPress={() => setIsEditing(true)} />

                        </>
                    )}
                </>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: width * 0.05,
        gap: width * 0.05,
        width: width,
        minHeight: height,
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
    },


    name: {
        fontSize: width * 0.08,
        marginBottom: height * 0.02,
        textAlign: "center",
    },
    description: {
        marginBottom: height * 0.03,
    },
    difficultysTitle: {
        marginBottom: height * 0.01,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: 'white'
    }
});
