import { auth } from '@/auth';
import FeatureRequestForm from './Form';
import FeatureRequestList from './List';
import EmailForm from './EmailForm';
import { Session } from '@/lib/types';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const Home: React.FC = async () => {
  const session = (await auth()) as Session;

  if (!session) {
    return redirect('/');
  }
  const user = await db.user.findFirst({
    where:{
      email: session.user.email
    }
  })
  const isAdmin = user?.role === 'admin'; 
  return (
    <div className="container">
      <h1>Feature Request</h1>
      <FeatureRequestForm />
      <FeatureRequestList user={session.user.id} isAdmin={isAdmin} />
      {isAdmin && <EmailForm />}
    </div>
  );
};

export default Home;
