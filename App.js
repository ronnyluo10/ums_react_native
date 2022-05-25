import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './components/WelcomeScreen';
import Layout from './components/Layout';
import FormPelanggan from './components/Pelanggan/FormPelanggan';
import FormBarang from './components/Barang/FormBarang';
import FormPenjualan from './components/Penjualan/FormPenjualan';
import ItemPenjualanScreen from './components/Penjualan/Detail/ItemPenjualanScreen';
import FormItemPenjualan from './components/Penjualan/Detail/FormItemPenjualan'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
      >
        <Stack.Screen 
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen 
          name="Layout" 
          component={Layout} 
        />

        <Stack.Screen 
          name="FormPelanggan"
          component={FormPelanggan}
        />

        <Stack.Screen 
          name="FormBarang"
          component={FormBarang}
        />

        <Stack.Screen 
          name="FormPenjualan"
          component={FormPenjualan}
        />

        <Stack.Screen 
          name="ItemPenjualan"
          component={ItemPenjualanScreen}
        />

        <Stack.Screen 
          name="FormItemPenjualan"
          component={FormItemPenjualan}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
