import Parse from 'parse';
//NEXT_PUBLIC because they are exposed to the browser
const appID = process.env.NEXT_PUBLIC_APP_ID || '';
const jsKey = process.env.NEXT_PUBLIC_JS_KEY || '';
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

// check if the credentials exsit first
if (appID || jsKey) {
	Parse.initialize(appID, jsKey);
}

if (serverUrl && typeof serverUrl === 'string') {
	Parse.serverURL = serverUrl;
}

export default Parse;