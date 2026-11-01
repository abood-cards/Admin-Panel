import {loadEnv,build} from 'vite';
const env=loadEnv('production',process.cwd(),'');
const url=(process.env.VITE_API_URL||env.VITE_API_URL||'').trim().replace(/\/$/,'');
if(url !== '/api/v1') {
 let u;try{u=new URL(url);}catch{}
 if(!u || u.protocol !== 'https:' || /YOUR-|CHANGE-ME|REPLACE/i.test(url) || !u.pathname.endsWith('/api/v1')) {
  console.error('VITE_API_URL must be /api/v1 for the combined Render service, or a real https://HOST/api/v1 for separate hosting.');process.exit(1);
 }
}
process.env.VITE_API_URL=url;
await build();
