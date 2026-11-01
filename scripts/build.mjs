import {loadEnv,build} from 'vite';
const env=loadEnv('production',process.cwd(),'');
const url=(process.env.VITE_API_URL||env.VITE_API_URL||'https://backend-428l.onrender.com/api/v1').trim().replace(/\/$/,'');
let parsed;try{parsed=new URL(url);}catch{}
if(!parsed || parsed.protocol !== 'https:' || /YOUR-|CHANGE-ME|REPLACE/i.test(url) || parsed.pathname !== '/api/v1' || parsed.search || parsed.hash){
 console.error('Standalone Admin requires an absolute HTTPS VITE_API_URL ending in /api/v1. Relative /api/v1 is not allowed.');process.exit(1);
}
process.env.VITE_API_URL=url;await build();
