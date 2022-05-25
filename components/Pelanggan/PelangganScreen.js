import React, { useEffect } from 'react'
import { View, Text, BackHandler } from 'react-native'
import ViewData from '../Templates/ViewData'

const PelangganScreen = ({ navigation }) => {
	const tbody = ['id_pelanggan', 'nama', 'domisili', 'jenis_kelamin']

	const thead = ['ID Pelanggan', 'Nama', 'Domisili', 'Jenis Kelamin']

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
				uri="/pelanggan"
				tbody={ tbody }
				thead={ thead }
				deleteField="nama"
				deleteUri="/pelanggan/delete/"
				createUri="FormPelanggan"
				updateUri="FormPelanggan"
				title="Pelanggan"
				navigation={ navigation }
			/>
		</View>
	)
}

export default PelangganScreen