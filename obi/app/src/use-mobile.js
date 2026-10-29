import { useEffect, useState } from 'react';
export const MOBILE_QUERY='(max-width:1024px)';
export function useMobile(){
 const [mobile,setMobile]=useState(()=>matchMedia(MOBILE_QUERY).matches);
 useEffect(()=>{const media=matchMedia(MOBILE_QUERY);const update=()=>setMobile(media.matches);media.addEventListener('change',update);update();return()=>media.removeEventListener('change',update);},[]);
 return mobile;
}
