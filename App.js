import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/Home.js'; 
import MarketplaceScreen from './src/components/Marketplace.js';  
import Products from './src/components/Productos.js';
import Busqueda from './src/components/Busqueda.js';
import Detail from './src/components/Detalle_producto.js';
import Admin_product from './src/components/admin_product.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Tienda" component={MarketplaceScreen} />
        <Stack.Screen name="Producto" component={Products} />
        <Stack.Screen name="Busqueda" component={Busqueda} />
        <Stack.Screen name="Detalle" component={Detail} />
        <Stack.Screen name="Admin_product" component={Admin_product} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
