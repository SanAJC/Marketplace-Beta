import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProductDetail({ route }) {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{uri: `${product.imageUrl}`}} style={styles.imagen}/>
      <Text style={styles.title}>{product.nombre}</Text>
      <Text style={styles.text}>Precio: {product.precio}</Text>
      <Text style={styles.text}>Descripción: {product.descripcion}</Text>
      <Text style={styles.text}>Contacto: {product.numeroContacto}</Text>
      <Text style={styles.text}>Dirección: {product.direccion}</Text>
      <Text style={styles.text}>Categoría: {product.categoria}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  imagen:{
    width:200,
    height: 200
  }
});