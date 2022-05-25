import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView, FlatList, StatusBar, Button, ActivityIndicator, TextInput, TouchableOpacity, Appearance, Alert, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import helpers from '../../Library/helpers.js'
import { TABLE_LIMIT, API_URL } from '@env'

const ViewData = (props) => {
	const [counter, setCounter] = useState(0)
	const [errors, setErrors] = useState({})
	const [results, setResults] = useState([])
	const [params, setParams] = useState({
		search: '',
		tbody: props.tbody,
		loadMore: 0,
		sort: ['created_at', 'DESC']
	})
	const [isLoading, setIsLoading] = useState(false)
	const [isRender, setIsRender] = useState(false)
	const [disableLoadMore, setDisableLoadMore] = useState(false)
	const [total, setTotal] = useState(0)
	const [btnWidth, setBtnWidth] = useState('50%')
	
	useEffect(() => {
		setCounter(counter + 1)

		if(props.detailUri) {
			setBtnWidth('33.33%')
		}

		getData()

		setTimeout(() => {
			setCounter(0)
		}, 1200)

		setTimeout(() => {
			const willFocusSubscription = props.navigation.addListener('focus', () => {
				if(counter < 1) {
					setDisableLoadMore(true)
					
					setIsRender(false)
					
					setTimeout(() => {
						getData()
					}, 1000)	
		    	}
		    })

		    return willFocusSubscription
		}, 1000)
	}, [])

	const getData = () => {
		helpers.getDataUser().then(response  => {
			helpers._api(props.uri, 'POST', response.token, params).then((json) => {
				const { data, totalRow } = json.results
				setIsLoading(false)
				setResults(data)
				setTotal(totalRow)
				setIsRender(true)
				
				if(params.loadMore > totalRow) {
					setDisableLoadMore(true)
				} else {
					setTimeout(() => {
						setDisableLoadMore(false)
					}, 1000)
				}

			}).catch((error) => {
				setIsLoading(false)
				setIsRender(true)
				showError(error)
			})
		}).catch((error) => {
			setIsLoading(false)
			setIsRender(true)
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

	const onEndReached = (event) => {
		if(!disableLoadMore && total > TABLE_LIMIT) {
			setIsLoading(true)

			params.loadMore = parseInt(params.loadMore) + parseInt(TABLE_LIMIT)

			setParams(params)

			setTimeout(() => {
				getData()
			}, 1000)
		}
	}

	const handleChangeValue = (value) => {
		setParams({
			...params,
			search: value,
		})
	}

	const submitSearch = (event) => {
		setIsRender(false)
		setParams({
			...params,
			loadMore: 0,
			sort: ['created_at', 'DESC']
		})
		
		setTimeout(() => {
			getData()
		}, 1000)
	}

	const sortSubmit = (event) => {
		setIsRender(false)
		setTimeout(() => {
			getData()
		}, 1000)
	}

	const clearParam = () => {
		setParams({
			search: '',
			tbody: props.tbody,
			loadMore: 0,
			sort: ['created_at', 'DESC']
		})
	}

	const formCreate = () => {
		clearParam()

		let routeParam = {
			type: 'Tambah',
		}

		if(props.createParam) {
			routeParam['nota_id'] = props.createParam
		}

		props.navigation.navigate(props.createUri, routeParam)
	}

	const formEdit = (item) => {
		clearParam()

		if(props.moreField && props.moreField.length > 0) {
			let editParams = {type: 'Ubah'}
			
			for(let i = 0; i < props.moreField.length; i++) {
				editParams[props.moreField[i]] = item[props.moreField[i]]
			}

			props.navigation.navigate(props.updateUri, editParams)
		} else {
			props.navigation.navigate(props.updateUri, {
				type: 'Ubah',
				id: item.id,
			})
		}
	}

	const deleteConfirm = (item) => {
		Alert.alert(
			"Hapus "+props.title,
			"Apakah Anda yakin untuk menghapus "+item[props.deleteField]+"?",
			[
				{
					text: "Cancel",
					onPress: () => { return false },
					style: "cancel"
				},
				{ text: "OK", onPress: () => deleteItem(item) }
			]
		)
	}

	const deleteItem = (item) => {
		setDisableLoadMore(true)
		setIsRender(false)

		let deleteUri = props.deleteUri

		if(props.moreField && props.moreField.length > 0) {
			for(let i = 0; i < props.moreField.length; i++) {
				deleteUri += "/"+item[props.moreField[i]]
			}
		} else {
			deleteUri += item.id
		}
		console.log(deleteUri)
		helpers.getDataUser().then(response  => {
			helpers._api(deleteUri, 'DELETE', response.token).then((json) => {
				getData()
			}).catch((error) => {
				setDisableLoadMore(false)
				setIsRender(true)
				showError(error)
			})
		}).catch((error) => {
			setDisableLoadMore(false)
			setIsRender(true)
			showError(error)
		})
	}

	const viewDetail = (id) => {
		props.navigation.navigate(props.detailUri, {
			id: id
		})
	}

	return (
		<SafeAreaView style={ styles.container }>		
				{isRender && (
					<View style={{
						height: '100%',
						backgroundColor: '#EEEEEE',
						width: '100%',
			        }}>
			        	<View style={styles.barTotalData}>
							<View style={{
								borderWidth: 1,
								borderColor: '#005a98',
								borderRadius: 12,
								paddingLeft: 15,
								paddingRight: 15,
								paddingTop: 5,
								paddingBottom: 5,
								backgroundColor: '#005a98'
							}}>
								<Text style={{ color: '#fae029', fontWeight: 'bold' }}>{ total+" data ditemukan" }</Text>
							</View>
			            </View>

			            {errors && errors.systemError && (
							<View style={ styles.errorBox }>
								<Text style={ styles.errorText }>{ errors.systemError }</Text>
							</View>
						)}
					
			        	
			        	<View style={ styles.content }>
							<View>
								<Button 
									title="Tambah"
									style={ styles.btnBlack }
									onPress={ formCreate }
								/>
							</View>

							<View style={ styles.searchWrap }>
								<TextInput 
									style={ styles.textInput }
									placeholder='Cari'
									onChangeText={ handleChangeValue }
									value={ params.search }
									onSubmitEditing={ submitSearch }
								/>
							</View>

							<View style={{ 
							    flexDirection: 'row',
							    flexWrap: 'wrap',
							 	marginBottom: 10,
							 }}>
								<View style={ styles.sortWrap }>
									<Picker
										enabled={ true }
										selectedValue={ params.sort[0] }
										style={{ 
											height: 50,
											...Platform.select({
												android: {
													color: "#333333"
												},
												ios: {
													color: "#333333"
												}
							                })
										}}
										onValueChange={(itemValue, itemIndex) => setParams({
											...params,
											sort: [itemValue, params.sort[1]],
										})}
									>
										<Picker.Item label="Pilih" value="" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
										
										{ props.tbody.map((value, key) => (
											<Picker.Item label={ props.thead[key] } key={ key } value={ value } color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
										)) }
									</Picker>
								</View>

								<View style={ styles.sortValueWrap }>
									<Picker
										enabled={ true }
										selectedValue={ params.sort[1] }
										style={{ 
											height: 50,
											...Platform.select({
												android: {
													color: "#333333"
												},
												ios: {
													color: "#333333"
												}
							                })
										}}
										onValueChange={(itemValue, itemIndex) => setParams({
											...params,
											sort: [params.sort[0], itemValue],
										})}
									>
										<Picker.Item label="ASC" value="ASC" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
										<Picker.Item label="DESC" value="DESC" color={ Appearance.getColorScheme() == 'dark' ? 'white' : 'black' } />
									</Picker>
								</View>

								<View style={ styles.sortBtn }>
									<Button 
										title="Urutkan"
										onPress={ sortSubmit }
									/>
								</View>
							</View>

							<FlatList
								data={results}
								renderItem={({ item }) => {
									return (
										<View style={{ width: '100%', marginBottom: 15, paddingLeft: 15, paddingRight: 15, backgroundColor: "#FFFFFF", paddingTop: 5, paddingBottom: 15 }}>
											{ props.tbody.map((body, bodyKey) => (
												<View key={ bodyKey } style={ styles.resultWrap }>
													<Text style={ styles.resultLabel }>{ props.thead[bodyKey] }</Text>
													<Text>{ ': '+item[body] }</Text>
												</View>
											)) }
											<View style={{
												flexDirection: 'row',
							    				flexWrap: 'wrap',
											}}>
												<View style={{ width: btnWidth, paddingRight: 15 }}>
													<Button 
														title="Ubah"
														color="green"
														onPress={() => formEdit(item)}
													/>
												</View>
												
												<View style={{ width: btnWidth, paddingLeft: 15 }}>
													<Button 
														title="Hapus"
														color="red"
														onPress={() => deleteConfirm(item)}
													/>
												</View>

												{ props.detailUri && (
													<View style={{ width: btnWidth, paddingLeft: 15 }}>
														<Button 
															title="Item"
															color="blue"
															onPress={() => viewDetail(item.id)}
														/>
													</View>
												)}
											</View>
										</View>
									)
								}}
								keyExtractor={(item, index) => index.toString()}
					            initialNumToRender={ parseInt(TABLE_LIMIT) }
					            onEndReached={(event) => onEndReached(event)}
					            onEndReachedThreshold={0.1}
							/>
						</View>
			        </View>
				)}

				{ isLoading && (
					<View style={{
						alignItems: 'center',
						position: 'absolute',
						bottom: 0,
						marginBottom: 40,
						width: '100%',
						zIndex: 999,
					}}>
						<ActivityIndicator color={"#00589c"} size="large" />
					</View>
				)}				

				{ !isRender && (
					<View style={ styles.loadingBackground }>
						<ActivityIndicator color={"#ffffff"} size="large" />
					</View>
				) }
		</SafeAreaView>
	)
}

export default ViewData

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
		paddingTop: StatusBar.currentHeight,
	},

	errorBox: {
		backgroundColor: '#f2dede',
		padding: 15,
	},

	errorText: {
		color: '#A94433'
	},

	resultWrap: {
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		flexDirection: 'row'
	},

	resultLabel: {
		fontWeight: 'bold',
		width: 120,
	},

	btnBlack: {
		width: 120
	},

	content: {
		flex: 1,
		width: '100%',
		marginTop: 15,
		paddingBottom: 0,
		paddingLeft: 15,
		paddingRight: 15,
	},

	loadingBackground: {
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
	},

	barTotalData: {
		backgroundColor: "#FFFFFF",
        padding: 10,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
	},

	searchWrap: {
		width: '100%',
	},

	sortWrap: {
		width: '33.33%',
		paddingRight: 5,
	},

	sortValueWrap: {
		width: '33.33%',
		paddingLeft: 5,
	},

	sortBtn: {
		width: '33.33%',
		paddingLeft: 5,
		paddingTop: 10,
	},

	textInput: {
		backgroundColor: '#fff',
		marginTop: 10,
		height: 38,
		paddingLeft: 10,
	},
})