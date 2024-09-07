import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert, Image,ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import app from "./Home"
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";

const config = initializeApp(firebaseConfig);
const db = getFirestore(config);
const storage = getStorage(config);



export default function Products(props) {
    const initialState = {
        nombre: '',
        precio: '',
        descripcion: '',
        numeroContacto: '',
        direccion: '',
        categoria: '',
        imageURL: ''
    }

    const [state, setState] = useState(initialState);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const handleChangeText = (value, name) => {
        setState({ ...state, [name]: value })

    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    const uploadImage = async () => {
        if (!image) {
            Alert.alert('Please select an image first');
            return null;
        }

        setUploading(true);
        try {
            const fileInfo = await FileSystem.getInfoAsync(image);
            if (!fileInfo.exists) {
                Alert.alert('File does not exist');
                setUploading(false);
                return null;
            }

            const response = await fetch(image);
            const blob = await response.blob();

            const filename = image.substring(image.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    snapshot => {
                        // Optional: track progress here if needed
                    },
                    error => {
                        console.error(error);
                        Alert.alert('Upload failed');
                        setUploading(false);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploading(false);
                        setImage(null);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Upload failed');
            setUploading(false);
            return null;
        }
    };



    const saveProduct = async () => {
        try {
            const imageUrl = await uploadImage();
            if (imageUrl) {
                await addDoc(collection(db, 'productos'), {
                    ...state,
                    imageUrl,
                });

                Alert.alert('Alerta', 'Producto guardado con éxito');
                props.navigation.navigate('Tienda');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.content_products}>
        <View style={styles.container}>
            <Text style={styles.titulo}>Agrega informacion de tu producto</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Nombre_producto"
                onChangeText={(value) => handleChangeText(value, 'nombre')}
                value={state.nombre}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Precio"
                keyboardType="numeric"
                value={state.precio}
                onChangeText={(value) => handleChangeText(value, 'precio')}

            />
            <TextInput
                style={styles.textInput}
                placeholder="Descripcion"
                onChangeText={(value) => handleChangeText(value, 'descripcion')}
                value={state.descripcion} numberOfLines={10} multiline={true}
            />
            <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="Numero de contacto"
                onChangeText={(value) => handleChangeText(value, 'numeroContacto')}
                value={state.numeroContacto}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Direccion"
                onChangeText={(value) => handleChangeText(value, 'direccion')}
                value={state.direccion}
            />
            <Text style={styles.label}>Selecciona una categoria para su producto</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={state.categoria}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleChangeText(itemValue, 'categoria')}
                >
                    <Picker.Item label="Electronica" value="Electronica" />
                    <Picker.Item label="Alquileres" value="Alquileres" />
                    <Picker.Item label="Ropa y calzado de mujer" value="Ropa y calzado de mujer" />
                    <Picker.Item label="Ropa y calzado de hombre" value="Ropa y calzado de hombre" />
                    <Picker.Item label="Muebles" value="Muebles" />
                    <Picker.Item label="Electrodomesticos" value="Electrodomesticos" />
                    <Picker.Item label="Juguetes y juegos" value="Juguetes y juegos" />
                    <Picker.Item label="Vehiculos" value="Vehiculos" />

                </Picker>
            </View>
            
            <Button title="Carge imagen de su producto" color="gray" onPress={pickImage} />
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100 }}
                />
            )}
            <Text></Text>
            <Button title="Guardar producto" color="gray" onPress={saveProduct} />

        </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 20,
        color: '#344340',
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 20,
        color: 'gray',
    },
    textInput: {
        padding: 10,
        paddingStart: 30,
        width: '80%',
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        overflow: 'hidden',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: 200,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    button:{
        padding:5,
        alignItems: 'center',
        justifyContent: 'center',
        
        width:'50%',
        height:50,
        borderRadius:30,
        marginTop:20,
        backgroundColor:'gray',
      },
});
