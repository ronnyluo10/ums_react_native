import React, { useEffect } from 'react'
import { View, Text, BackHandler } from 'react-native'
import ViewData from '../Templates/ViewData'

const PenjualanScreen = ({ navigation }) => {
	const tbody = ['id_nota', 'tgl', 'kode_pelanggan', 'subtotal']

	const thead = ['ID Nota', 'Tgl', 'Kode Pelanggan', 'Subtotal']

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
				uri="/penjualan"
				tbody={ tbody }
				thead={ thead }
				deleteField="id_nota"
				deleteUri="/penjualan/delete/"
				createUri="FormPenjualan"
				updateUri="FormPenjualan"
				title="Penjualan"
				navigation={ navigation }
				detailUri="ItemPenjualan"
			/>
		</View>
	)
}

export default PenjualanScreen