import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/page/login'); 
  
  return null;
}