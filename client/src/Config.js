
export const chatEndPoint = () => {

   return 'http://'+window.location.hostname+':5000';

}
export const mod = () => {
   return 'dev';
}
export const configHeader = () => {
 const config = {
     headers: {
         'Content-Type': 'application/json'
     }
 };
 return config;
}