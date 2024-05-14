import { redirect } from "next/navigation";
import AddForm from "../AddForm";
import { getCar } from "../GetId";
interface Props{
params:{
    Id: string
}
}
const Car = async({params}: Props) => {
    const car = await getCar(params.Id)

    return ( 
        <AddForm car={car}/>
     );
}
 
export default Car;