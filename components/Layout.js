import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import PelangganScreen from './Pelanggan/PelangganScreen'
import BarangScreen from './Barang/BarangScreen'
import PenjualanScreen from './Penjualan/PenjualanScreen'
import AkunScreen from './Akun/AkunScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()

const Layout = () => {
	return (
		<Tab.Navigator>
			<Tab.Screen 
				name="Pelanggan" 
				component={PelangganScreen} 
				options={{
					tabBarLabel: 'Pelanggan',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="account-group" color={color} size={size} />
					)
				}}
			/>
			<Tab.Screen 
				name="Barang" 
				component={BarangScreen}
				options={{
					tabBarLabel: 'Barang',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="bag-checked" color={color} size={size} />
					)
				}}
			/>
			<Tab.Screen 
				name="Penjualan" 
				component={PenjualanScreen} 
				options={{
					tabBarLabel: 'Penjualan',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="salesforce" color={color} size={size} />
					)
				}}
			/>
			<Tab.Screen 
				name="Akun" 
				component={AkunScreen} 
				options={{
					tabBarLabel: 'Akun',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="account" color={color} size={size} />
					)
				}}
			/>
		</Tab.Navigator>
	)
}

export default Layout