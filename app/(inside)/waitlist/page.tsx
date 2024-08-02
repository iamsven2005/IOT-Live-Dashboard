import { auth } from '@/auth';
import FeatureRequestForm from './Form';
import FeatureRequestList from './List';
import { Session } from '@/lib/types';
import { redirect } from 'next/navigation';

const Home: React.FC = async() => {
    const session = (await auth()) as Session;
  
    if (!session) {
      return redirect("/");
    }
  return (
    <div className="container">
      <h1>Feature Request</h1>
      <FeatureRequestForm />
      <FeatureRequestList user={session.user.id}/>
    </div>
  );
};

export default Home;
