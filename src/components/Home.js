import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config';
import { useNavigation } from '@react-navigation/native';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



export default function HomeScreen() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigation = useNavigation();

  const handleSignIn = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, correo, contraseña);
      console.log('Usuario autenticado');
      navigation.navigate('Tienda');  
    } catch (error) {
      console.error('Error al iniciar sesión:', error); 
    }

  };

  const handleCreateAccount=async()=>{
    try {
      await createUserWithEmailAndPassword(auth,correo,contraseña);
      console.log('Cuenta Creada!');
    } catch (error) {
      console.error('Error al crear cuenta!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo_registro}>Inicio de sesión</Text>
      <Text style={styles.subTitle}>Ingresa tus credenciales</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      
      <TextInput
        style={styles.textInput}
        secureTextEntry={true}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
      />

      <Button title="Iniciar Sesión" color="gray" onPress={handleSignIn}/>

      <View style={styles.container_2}>
        <Text style={styles.subTitle_sub}>Si no cuentas con una cuenta  </Text>
        <Button title="Registro" color="gray" onPress={handleCreateAccount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  container_2: {
      flexDirection:'row',
      backgroundColor: '#fff',
      marginTop:100,
    },
  titulo:{
      fontSize:80,
      color:'#344340',
      fontWeight:'bold',
  },
  titulo_registro:{
    fontSize:30,
    color:'#344340',
    fontWeight:'bold',
  },
  subTitle:{
      fontSize:20,
      color:'gray',
  },
  subTitle_sub:{
      fontSize:15,
      color:'gray',
  },
  textInput:{
    padding:10,
    paddingStart:30,
    width:'80%',
    height:50,
    marginTop:20,
    marginBottom:20,
    borderRadius:30,
    backgroundColor:'#f1f1f1',
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
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
