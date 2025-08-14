import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to a sample listing page to show public reviews
  redirect('/listing/listing-L-1001');
}
