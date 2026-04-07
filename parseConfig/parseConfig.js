import Parse from 'parse';

const appID = process.env.NEXT_PUBLIC_APP_ID || '';
const jsKey = process.env.NEXT_PUBLIC_JS_KEY || '';// used for client side
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

// Initialize Parse with values exposed to the client via NEXT_PUBLIC_*
// Guard assignments so we never pass `undefined` into Parse internals.
if (appID || jsKey) {
	Parse.initialize(appID, jsKey);
}

if (serverUrl && typeof serverUrl === 'string') {
	Parse.serverURL = serverUrl;
}

export default Parse;