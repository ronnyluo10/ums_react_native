import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, BackHandler, Text, TextInput, Appearance, Button, ActivityIndicator, Platform, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import helpers from '../../Library/helpers.js'

const FormPenjualan = ({ navigation, route }) => {
	const [state, setState] = useState({
		tgl: '',
		pelanggan: '',
		barang: [],
		qty: [],
	})

	const [ date, setDate ] = useState({
		date: '',
		month: '',
		year: '',
	})

	const [subtotal, setSubtotal] = useState()
	const [errors, setErrors] = useState({})
	const [disabled, setDisabled] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [uri, setUri] = useState('/penjualan/store')
	const [method, setMethod] = useState('POST')
	const [kodePelanggan, setKodePelanggan] = useState([])
	const [barang, setBarang] = useState([])
	const [item, setItem] = useState({
		barang: '',
		qty: ''
	})
	const [items, setItems] = useState([])

	const dates = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
	const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
	const years = ['2000','2001','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022']

	const { type, id } = route.params

	useEffect(() => {
		if(id) {
			setUri(uri => '/penjualan/update/'+id)
			setMethod('PUT')

			getEditData()
		}

		getDataOfMaster()

		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [])

	const backAction = () => {
		navigation.goBack()
		return true
	}

	const getDataOfMaster = () => {
		helpers.getDataUser().then(response => {
			helpers._api('/item-penjualan/master', 'GET', response.token).then((json) => {
				const { pelanggan, barang } = json.results
				setKodePelanggan(Object.entries(pelanggan))
				setBarang(Object.entries(barang))
			}).catch((error) => {
				showError(error)
			})
		}).catch((error) => {
			showError(error)
		})
	}

	const getEditData = () => {
		setIsLoading(true)

		helpers.getDataUser().then(response  => {
			helpers._api('/penjualan/edit/'+id, 'GET', response.token).then((json) => {
				const { results } = json

				const tanggal = results.tgl.split('-')

				setState({
					...state,
					tgl: results.tgl,
					pelanggan: results.kode_pelanggan,
					subtotal: results.subtotal
				})

				setDate({
					date: tanggal[0].toString(),
					month: tanggal[1].toString(),
					year: tanggal[2].toString()
				})

				setIsLoading(false)
			}).catch((error) => {
				setIsLoading(false)
				showError(error)
			})
		}).catch((error) => {
			setIsLoading(false)
			showError(error)
		})
	}

	const handleChangeValue = (value, name) => {
		setItem({
			...item,
			[name]: value
		})
	}

	const saveData = () => {
		setIsLoading(true)

		state.tgl = date.year+'-'+date.month+'-'+date.date

		setState(state)

		if(Object.keys(errors).length > 0) {
			setErrors({})
		}

		helpers.getDataUser().then(response  => {
			helpers._api(uri, method, response.token, state).then((json) => {
				if(json.errors) setErrors(json.errors)
				else if(!json.success) showError(json)
				else {
					setSuccess(true)

					if(!id) {
						setState({
							tgl: '',
							pelanggan: '',
							barang: [],
							qty: [],
						})

						setDate({
							date: '',
							month: '',
							year: '',
						})
					}
				}

				setIsLoading(false)
			}).catch((error) => {
				setIsLoading(false)
				showError(error)	
			})
		}).catch((error) => {
			setIsLoading(false)
			showError(error)
		})
	}

	const showError = (error) => {
		setErrors({
			systemError: error.message
		})

		setTimeout(() => {
			setErrors({})
		}, 3000)
	}

	const addItem = () => {
		
		if(Object.keys(errors).length > 0) {
			setErrors({})
		}

		if(item.barang && item.qty) {
			const text = item.barang.split("-")	
			const harga = text[1]
			const hargaValue = parseInt(harga.trim())
			const qty = parseInt(item.qty)
			const total = hargaValue * qty

			setItems([
				...items,
				{
					kode: text[2],
					nama: text[0],
					harga: helpers.comma(hargaValue),
					id: text[2],
					qty: qty,
					total: total,
				}
			])

			let calculateSubTotal = subtotal

			if(!calculateSubTotal) {
				calculateSubTotal = total
			} else {
				calculateSubTotal += total
			}

			setSubtotal(subtotal => calculateSubTotal)

			state.barang.push(text[2])
			state.qty.push(qty)

			setState(state)

			setItem({
				...item,
				barang: '',
				qty: ''
			})
		} else {
			showError({ message: 'Barang dan qty harus diisi' })
		}
	}

	const deleteItem = (key) => {
		if(items[key]) {
			state.barang.splice(key, 1)
			state.qty.splice(key, 1)

			const calculateSubTotal = subtotal - items[key].total

			setSubtotal(calculateSubTotal)

			items.splice(key, 1)

			setState(state)
			setItems(items)
		}
	}

	return (
		<SafeAreaView style={{
			flex: 1,
			marginTop: 30,
		}}>
			<ScrollView>
				<View style={{
					paddingTop: 5,
					width: '100%',
					height: 35,
					backgroundColor: '#666',
					paddingLeft: 15,
					paddingRight: 15,
				}}>
					<Text style={{ color: 'white' }}>{ type+' Penjualan' }</Text>
				</View>

				<View style={{ marginTop: 15, padding: 15, backgroundColor: '#999', }}>
					{ success && (
						<View style={{
							backgroundColor: '#dff0d8',
							padding: 15,
						}}>
							<Text style={{ color: '#3c763d' }}>Berhasil simpan data</Text>
						</View>
					) }

					{errors && errors.systemError && (
						<View style={{
							backgroundColor: '#f2dede',
							padding: 15,
						}}>
							<Text style={{ color: '#A94433' }}>{ errors.systemError }</Text>
						</View>
					)}

					<View style={{ marginTop: 10 }}>
						<Text style={{ fontWeight: 'bold', color: 'white' }}>Tanggal *</Text>
						
						<View style={{
							flexDirection: 'row',
						    flexWrap: 'wrap',
						}}>
							<View style={{ width: '33.33%' }}>
								<Picker
									enabled={ true }
									selectedValue={ date.date }
									style={{ 
										height: 50,
										...Platform.select({
											android: {
												color: "white"
											},
											ios: {
												color: "white"
											}
						                })
									}}
									onValueChange={(itemValue, itemIndex) => setDate({
										...date,
										date: itemValue,
									})}
								>
									<Picker.Item label="Tanggal" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									{ dates.map((value, key) => (
										<Picker.Item label={ value } key={ key } value={ value } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									)) }
								</Picker>
							</View>

							<View style={{ width: '33.33%' }}>
								<Picker
									enabled={ true }
									selectedValue={ date.month }
									style={{ 
										height: 50,
										...Platform.select({
											android: {
												color: "white"
											},
											ios: {
												color: "white"
											}
						                })
									}}
									onValueChange={(itemValue, itemIndex) => setDate({
										...date,
										month: itemValue,
									})}
								>
									<Picker.Item label="Bulan" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									{ months.map((value, key) => (
										<Picker.Item label={ value } key={ key } value={ value } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									)) }
								</Picker>
							</View>

							<View style={{ width: '33.33%' }}>
								<Picker
									enabled={ true }
									selectedValue={ date.year }
									style={{ 
										height: 50,
										...Platform.select({
											android: {
												color: "white"
											},
											ios: {
												color: "white"
											}
						                })
									}}
									onValueChange={(itemValue, itemIndex) => setDate({
										...date,
										year: itemValue,
									})}
								>
									<Picker.Item label="Tahun" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									{ years.map((value, key) => (
										<Picker.Item label={ value } key={ key } value={ value } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									)) }
								</Picker>
							</View>
						</View>

						{ errors && errors.tgl  ? 
							errors.tgl.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}
					</View>

					<View>
						<Text style={{ fontWeight: 'bold', color: 'white' }}>Kode Pelanggan *</Text>
						<Picker
							enabled={ true }
							selectedValue={ state.pelanggan }
							style={{ 
								height: 50,
								...Platform.select({
									android: {
										color: "white"
									},
									ios: {
										color: "white"
									}
				                })
							}}
							onValueChange={(itemValue, itemIndex) => setState({
								...state,
								pelanggan: itemValue,
							})}
						>
							<Picker.Item label="Pilih" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
							{ kodePelanggan.map((value, key) => (
								<Picker.Item label={ value[1] } key={ key } value={ value[0] } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
							)) }
						</Picker>

						{ errors && errors.pelanggan  ? 
							errors.pelanggan.map((value, key) => 
								<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
						        	<Text style={{ color: '#a94442' }}>{ value }</Text>
						      	</View>
							)
							: <Text></Text>
						}
					</View>

					{id && (
						<View>
							<Text style={{ fontWeight: 'bold', color: 'white' }}>Subtotal *</Text>
							<TextInput 
								style={{ height: 45, backgroundColor: '#fff', paddingLeft: 10 }}
								value={helpers.comma(state.subtotal)}
								onChangeText={ (value) => setState({ ...state, subtotal: value }) }
							/>
						</View>
					)}

					{ !id && (
						<View style={{ marginTop: 15, borderWidth: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderColor: '#fff', padding: 15 }}>
							<Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>Item</Text>

							<View style={{
								flexDirection: 'row',
							    flexWrap: 'wrap',
							}}>
								<View style={{ width: '30%' }}>
									<Text style={{ color: '#fff' }}>Barang *</Text>
									<Picker
										enabled={ true }
										selectedValue={ item.barang }
										style={{ 
											height: 50,
											...Platform.select({
												android: {
													color: "white"
												},
												ios: {
													color: "white"
												}
							                })
										}}
										onValueChange={(itemValue, itemIndex) => setItem({
											...item,
											barang: itemValue,
										})}
									>
										<Picker.Item label="Pilih" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
										{ barang.map((value, key) => (
											<Picker.Item label={ value[1] } key={ key } value={ value[1]+'-'+value[0] } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
										)) }
									</Picker>

									{ errors && errors.barang  ? 
										errors.barang.map((value, key) => 
											<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
									        	<Text style={{ color: '#a94442' }}>{ value }</Text>
									      	</View>
										)
										: <Text></Text>
									}

									<Text style={{ marginTop: 15, color: '#fff' }}>Qty *</Text>
									<TextInput 
										style={{ backgroundColor: '#fff', height: 35, paddingLeft: 10 }}
										value={ item.qty }
										onChangeText={ (value) => handleChangeValue(value, 'qty') }
									/>

									{ errors && errors.qty  ? 
										errors.qty.map((value, key) => 
											<View style={{ backgroundColor: '#f2dede', padding: 15 }} key={key}>
									        	<Text style={{ color: '#a94442' }}>{ value }</Text>
									      	</View>
										)
										: <Text></Text>
									}

									<View style={{ marginTop: 15 }}>
										<Button 
											title="Tambah"
											onPress={ addItem }
										/>
									</View>
								</View>

								{ items.length > 0 ?
									<View style={{ width: '70%', paddingLeft: 15 }}>
										{ items.map((value, key) => (
											<View key={key} style={{ backgroundColor: '#f3f3f3', paddingLeft: 5, paddingRight: 5, borderRadius: 5, marginBottom: 10 }}>
												<View style={{ position: 'absolute', right: 0, zIndex: 1 }}>
													<TouchableOpacity style={{ marginRight: 10 }} onPress={ () => deleteItem(key) }>
														<Text>Hapus</Text>
													</TouchableOpacity>
												</View>
												<Text style={{ color: '#666' }}>No. { key + 1 }</Text>
												<Text style={{ color: '#666' }}>{ 'Kode: '+value.kode }</Text>
												<Text style={{ color: '#666' }}>{ 'Nama: '+value.nama }</Text>
												<Text style={{ color: '#666' }}>{ 'Harga: '+value.harga }</Text>
												<Text style={{ color: '#666' }}>{ 'Qty: '+value.qty }</Text>
												<Text style={{ color: '#666' }}>{ 'Total: '+helpers.comma(value.total) }</Text>
											</View>
										)) }

										{ subtotal && (
											<View style={{ marginTop: 10 }}>
												<Text style={{ textAlign: 'right', color: '#fff' }}>{ 'Subtotal: '+helpers.comma(subtotal) }</Text>
											</View>
										) }
									</View>
									: <Text></Text>
								}
							</View>
						</View>
					)}

					<View style={{ marginTop: 10 }}>
						<Button 
							color={ disabled ? '#ccc' : '#00d1b2' }
							title="Simpan"
							onPress={ saveData }
						/>
					</View>
				</View>

				{ isLoading && (
					<View style={{
						backgroundColor: '#333333', 
						position: 'absolute', 
						width: '100%', 
						height: '100%', 
						justifyContent: 'center', 
						top: 0, 
						left: 0, 
						right: 0,
						bottom: 0,
						zIndex: 999, 
						opacity: 0.7,
					}}>
						<ActivityIndicator color={"#ffffff"} size="large" />
					</View>
				) }
			</ScrollView>
		</SafeAreaView>
	)
}

export default FormPenjualan