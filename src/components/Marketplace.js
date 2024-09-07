import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet,TouchableOpacity,ScrollView,Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import { getFirestore,collection,getDocs } from 'firebase/firestore';
import app from "./Home"

const db = getFirestore(app);

export default function Marketplace({navigation}) {
  const [userName, setUserName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const emailParts = currentUser.email.split('@');
      const name = emailParts[0];
      setUserName(currentUser.displayName || name);
    }

    // Recuperar productos de Firebase
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudieron recuperar los productos');
      }
    };

    fetchProducts();
  }, [products]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>Bienvenido-{userName}</Text>
        <TouchableOpacity onPress={() => {
            navigation.navigate('Producto');
          }}>
          <Ionicons name='add-circle' size={40} color="black"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            navigation.navigate('Busqueda');
          }}>
          <Ionicons name='search-circle' size={40} color="black"/> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            navigation.navigate('Admin_product');
          }}>
          <Ionicons name='list-circle' size={40} color="black"/> 
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content_products}>
        <Text style={styles.subTitle}>Productos en venta</Text>
        {products.map(product => (
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
    flexDirection:'colum',
    justifyContent: 'center',
  },
  header:{
    flexDirection:'row',
  },
  userName: {
    fontSize:20,
    color:'gray',
    marginRight:120,
  },
  content_products:{
    flex:1,
    backgroundColor:'#f1f1f1',
  },
  subTitle:{
    fontSize:25,
    color:'black',
  },
  sub:{
    fontSize:20,
    color:'black',
    padding:10,
  },
  products:{
    backgroundColor:'gray',
    flexDirection:'column',
    width:300,
    height:400,
    alignItems:'center',
    left:50,
    marginTop:100,
    borderColor:'black',
    borderRadius:10,
  },
  imagen:{
    width :300,
    height:250,
    borderRadius:10,
  },
  container_info:{
    flexDirection:'row',
    marginTop:50,
  }
});
