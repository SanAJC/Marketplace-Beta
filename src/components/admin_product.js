import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import app from "./Home";

const db = getFirestore(app);

export default function AdminProduct({ navigation }) {
  const [userProducts, setUserProducts] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const fetchUserProducts = async () => {
        try {
          // Crear una consulta para obtener solo los productos del usuario actual
          const q = query(collection(db, 'productos'), where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          const productsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })); 
          setUserProducts(productsList);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'No se pudieron recuperar los productos');
        }
      };

      fetchUserProducts();
    }
  }, [currentUser]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'productos', productId));
      setUserProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      Alert.alert('Éxito', 'Producto eliminado correctamente');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content_products}>
        <Text style={styles.subTitle}>Mis Productos</Text>
        {userProducts.length > 0 ? (
          userProducts.map(product => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.imagenUrl || 'https://via.placeholder.com/250' }} style={styles.imagen} />
              <View style={styles.container_info}>
                <Text style={styles.productName}>{product.nombre}</Text>
                <Text style={styles.productPrice}>{`$${product.precio}`}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { product })}>
                    <Ionicons name='create' size={30} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(product.id)}>
                    <Ionicons name='trash' size={30} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noProductsText}>No tienes productos en venta.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
  },
  content_products: {
    flex: 1,
  },
  subTitle: {
    fontSize: 25,
    color: 'black',
    marginVertical: 20,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  imagen: {
    width: '100%',
    height: 200,
  },
  container_info: {
    padding: 15,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  productPrice: {
    fontSize: 18,
    color: 'gray',
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noProductsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 50,
  },
});
