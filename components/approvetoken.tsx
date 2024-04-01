import * as React from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSendTransaction,

} from "wagmi";
import {abi} from "../approveABI/abi.json"
import { useState } from "react";
import {ethers } from 'ethers'; 
import { ButtonLoading } from "./loadingbuttin";
import { ButtonDemo } from "./ui/buttonsh";
import { AlertDemo } from "@/components/arltc"


export function ApproveToken({ tokenAddress, amount }: { tokenAddress: string, amount: number }) {
  //const tokenaddress = '0x${tokenaddress}';
  const tokenaddress = tokenAddress.startsWith("0x") ? tokenAddress.substring(2) : tokenAddress;
  const amounttoapprove = amount;
  const {  data: hash, writeContract, isPending, isSuccess } = useWriteContract();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { sendTransaction,  error } = useSendTransaction();




 //console.log(tokenAddress)

 


  const handleClick = async () => {
    try {

     await writeContract({
        abi,
        address: `0x${tokenaddress}`,//tokenAddress,//"0x9b2cbE8Ad90fAB7362C6eC5A4896C7629CAe3D16", //token address
        functionName: "approve",
        args: [
          "0xbe8a2312082F2cB92571F35c6914565E6830c58e", //spender airdrop contract address
      
          amount ,
          
        ],
      });


    

      // Handle success if needed
      console.log("Approval successful!");
    } catch (error) {
      // Handle error if needed
      console.error("Error during approval:", error);
    }
  };


  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 
    console.log(hash)


  /**<div>
        <button onClick={handleClick} >Approvetoken</button>
        {isPending ? "Approving..." : "Approve Token"}
      </div> */








  //disabled={isPending}

  return (
    <>
      <>
<h1 onClick={handleClick} >
  {isPending? (<ButtonLoading/>) : (<ButtonDemo buttonName={"Approve"} />)}
</h1>

{isSuccess && <div>Transaction successful!</div>}
{hash && <div>Transaction Hash: {hash} <AlertDemo hash ={hash}/></div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
</>
    </>
  );
}


