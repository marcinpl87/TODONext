import jwa from 'jwa';

const PRIVATE_KEY = process.env.BANK_PRIVATE_KEY || '';
const APPLICATION_ID = process.env.BANK_APPLICATION_ID || '';
const API_ISS = process.env.BANK_API_ISS || '';
const API_AUD = process.env.BANK_API_AUD || '';

const encodeData = (data: Record<string, string | number>): string =>
	Buffer.from(JSON.stringify(data)).toString('base64').replace('=', '');

const getJWTHeader = (): string =>
	encodeData({
		typ: 'JWT',
		alg: 'RS256',
		kid: APPLICATION_ID,
	});

const getJWTBody = (exp: number): string => {
	const timestamp = Math.floor(new Date().getTime() / 1000);
	return encodeData({
		iss: API_ISS,
		aud: API_AUD,
		iat: timestamp,
		exp: timestamp + exp,
	});
};

const signWithKey = (data: string): string =>
	jwa('RS256').sign(data, PRIVATE_KEY);

const getJWT = (exp: number = 3600): string => {
	const jwtHeaders = getJWTHeader();
	const jwtBody = getJWTBody(exp);
	const jwtSignature = signWithKey(`${jwtHeaders}.${jwtBody}`);
	return `${jwtHeaders}.${jwtBody}.${jwtSignature}`;
};

export const getHeaders = (): Record<string, string> => ({
	Authorization: `Bearer ${getJWT()}`,
	'Content-Type': 'application/json',
	'psu-ip-address': '10.10.10.10',
	'psu-user-agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
});
