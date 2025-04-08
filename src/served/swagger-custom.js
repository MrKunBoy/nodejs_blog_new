async function postData(url, data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: { 'Content-Type': 'application/json' },
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data),
	});

	if (response.status >= 400) {
		throw new Error('invalid credentials');
	}
	return response.json();
}

const AUTH_CREDENTIALS = {
	// email: 'michaelsmith@example.com',
	email: 'trinhnguyen@example.com',
	password: '1232@asdS',
};

postData('/api/v1/auth/sign-in', AUTH_CREDENTIALS)
	.then((data) => {
		console.log('Full Auth Response:', data.data); // In toàn bộ response
		console.log('Access Token:', data.data.access_token); // Kiểm tra access_token có tồn tại không
		setTimeout(() => {
			window.ui.preauthorizeApiKey('token', data.data.access_token);
			console.log('preauth success');
		}, 1000);
	})
	.catch((e) => {
		console.error(`preauth failed: ${e}`);
	});
