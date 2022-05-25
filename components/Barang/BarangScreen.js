import React, { useEffect } from 'react'
import { View, Text, BackHandler } from 'react-native'
import ViewData from '../Templates/ViewData'

const BarangScreen = ({ navigation }) => {
	const tbody = ['kode', 'nama', 'kategori', 'harga']

	const thead = ['Kode', 'Nama', 'Kategori', 'Harga']

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [])

	const backAction = () => {
		navigation.goBack()
		return true
	}

	return (
		<View>
			<ViewData 
				uri="/barang"
				tbody={ tbody }
				thead={ thead }
				deleteField="nama"
				deleteUri="/barang/delete/"
				createUri="FormBarang"
				updateUri="FormBarang"
				title="Barang"
				navigation={ navigation }
			/>
		</View>
	)
}

export default BarangScreen