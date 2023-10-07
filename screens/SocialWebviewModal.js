import {WebView} from 'react-native-webview';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';

import {useNavigation} from '@react-navigation/native';
const REST_API_KEY = '8f9849291f535bb2078554c4085202fc';
const REDIRECT_URI = 'http://localhost:8081/auth/kakao/callback';

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

function SocialWebviewModal({setModalOpen}) {
	const navigation = useNavigation();
	function LogInProgress(data) {
		// access code는 url에 붙어 장황하게 날아온다.

		// substringd으로 url에서 code=뒤를 substring하면 된다.

		const exp = 'code=';

		var condition = data.indexOf(exp);

		if (condition != -1) {
			var request_code = data.substring(condition + exp.length);

			// console.log("access code :: " + request_code);

			// 토큰값 받기

			requestToken(request_code);
		}
	}

	const requestToken = async request_code => {
		var returnValue = 'none';

		var request_token_url = 'https://kauth.kakao.com/oauth/token';

		axios({
			method: 'post',

			url: request_token_url,

			params: {
				grant_type: 'authorization_code',

				client_id: REST_API_KEY,

				redirect_uri: REDIRECT_URI,

				code: request_code,
			},
		})
			.then(function (response) {
				returnValue = response.data.access_token;
				console.log(returnValue);
				setModalOpen(false);
				navigation.navigate('Home', {screen: 'Home'});
			})
			.catch(function (error) {
				console.log('error', error);
			});
	};

	return (
		<View style={{flex: 1}}>
			<WebView
				originWhitelist={['*']}
				scalesPageToFit={false}
				style={{marginTop: 30}}
				source={{
					uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
				}}
				injectedJavaScript={runFirst}
				javaScriptEnabled={true}
				onMessage={event => {
					LogInProgress(event.nativeEvent['url']);
				}}

				// onMessage ... :: webview에서 온 데이터를 event handler로 잡아서 logInProgress로 전달
			/>
		</View>
	);
}
export default SocialWebviewModal;