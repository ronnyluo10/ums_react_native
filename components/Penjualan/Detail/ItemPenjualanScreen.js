import React, { useEffect } from 'react'
import { View, Text, BackHandler } from 'react-native'
import ViewData from '../../Templates/ViewData'

const ItemPenjualanScreen = ({ navigation, route }) => {
	const tbody = ['nota', 'kode_barang', 'qty']

	const thead = ['Nota', 'Kode Barang', 'Qty']

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
				uri={ '/penjualan/detail/'+route.params.id }
				tbody={ tbody }
				thead={ thead }
				deleteField="kode_barang"
				deleteUri="/item-penjualan/delete"
				createUri="FormItemPenjualan"
				createParam={ route.params.id }
				updateUri="FormItemPenjualan"
				title="Item Penjualan"
				navigation={ navigation }
				moreField={ ['nota', 'kode_barang'] }
			/>
		</View>
	)
}

export default ItemPenjualanScreen