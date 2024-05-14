"use client"
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/lib/hooks/use-new-account";

export default function Home(){
  const {onOpen} = useNewAccount()

 
  return ( 
    <div>
      <Button onClick={onOpen}>
        Add A Brand
      </Button>
      
    </div>
   );
}