import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from "./Home";

const db = getFirestore(app);

export default function Busqueda({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Recuperar productos de Firebase
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
        setFilteredProducts(productsList); // Inicialmente, mostrar todos los productos
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudieron recuperar los productos');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <View style={styles.container}>
      <View style={styles.contenedorBusqueda}>
        <Searchbar
          placeholder="Que producto te interesa"
          style={styles.barradeBusqueda}
          value={searchQuery}
          onChangeText={query => setSearchQuery(query)}
        />
      </View>
      <ScrollView style={styles.contenedorResultado}>
        {filteredProducts.map(product => (
          <View key={product.id} style={styles.products}>
            <Image source={{ uri: `${product.imageUrl}` }} style={styles.imagen} />
            <View style={styles.container_info}>
              <Text style={styles.sub}>{product.nombre}</Text>
              <Text style={styles.sub}>{product.precio}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Detalle', { product })}>
                <Ionicons name='information-circle' size={40} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  contenedorBusqueda: {
    marginBottom: 20,
    alignItems: 'center',
  },
  barradeBusqueda: {
    width: 300,
  },
  contenedorResultado: {
    flex: 1,
  },
  products: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imagen: {
    width: 100,
    height: 100,
  },
  container_info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  sub: {
    fontSize: 16,
    marginBottom: 5,
  },
});
