import Header from "./header";


type Props = {
    children: React.ReactNode
}
const Dashboardlayout = ({children}: Props) => {
    return ( <div>
        <Header/>
        {children}
    </div> );
}
 
export default Dashboardlayout;