import * as React from "react";
import { useDropzone } from "react-dropzone";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "../abi/abi.json";
import { airdropABI } from "../abi/airdropABI.json";
import { ApproveToken } from "./approvetoken";


import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function MintNFT() {
  const { writeContract, isPending } = useWriteContract();
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [spenderAddress, setSpenderAddress] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [totalAmount, settotalAmount]  = React.useState(0);
  const [expirationTime, setExpirationTime] = React.useState(0);
  const [recipientsText, setRecipientsText] = React.useState("");
  const [recipients, setRecipients] = React.useState<string[]>([]);


  //drag and drop function
  const onDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
  
    reader.onload = (event) => {
      // Check if event.target is not null
      if (event.target) {
        // Split the recipientsText into an array of addresses and remove surrounding double quotes
        const addresses = (event.target.result as string)
          .split("\n")
          .map((address) => address.trim().replace(/"/g, ""))
          .filter((address) => address !== "");
  
        setRecipients(addresses);
      }
    };
  
    reader.readAsText(acceptedFiles[0]);
  };
 const { getRootProps, getInputProps } = useDropzone({ onDrop });

//adding users address
  const addRecipient = (newRecipient: string) => {
    setRecipients([...recipients, newRecipient]);
    setRecipientsText(""); // Clear the input after adding a recipient
  };
//removing address
  const removeRecipient = (index: number) => {
    const updatedRecipients = [...recipients];
    updatedRecipients.splice(index, 1);
    setRecipients(updatedRecipients);
  };
  //display address down when press enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      addRecipient(recipientsText.trim());
    }
  };
  const totalamount =  amount * recipients.length;

  //airdrop button
  const handleClick = async () => {
    const recipientsArray = recipientsText
    .split("\n")
    .map((address) => address.trim())
    .filter((address) => address !== "");

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);
  
    try {
      const ethValue = 0.0003; // Amount in ETH
        const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0x1b4010669843da8aeafc1d1beE4f9D3709F270f2",//"0xbe8a2312082F2cB92571F35c6914565E6830c58e",
        functionName: "airdrop",
        args: [tokenAddress, recipients,  BigInt(amount)],
        value:  BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(tokenAddress, recipients,  BigInt(amount))

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log("Approval successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };


  return (
    <>

<div >
        <label >
          Token Address:
          <input style={{ color: 'black' }}
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </label>
      </div>


    
        <div className="space-y-2">
          <Label htmlFor="token-address">Token address</Label>
          <Input id="token-address" placeholder="Enter the token address" type="text" value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}/>
        </div>





      <div>
        <label>
          Amount to airdrop each no:
          <input style={{ color: 'black' }}
            type="number"
            value={amount}
            inputMode="numeric"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
      </div>





      <div>
        <label>
         enter  Recipients address :
          <textarea
            style={{ color: "black" }}
            value={recipientsText}
            onChange={(e) => setRecipientsText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>
        <ul>
          {recipients.map((address, index) => (
            <li key={index}>{address}
            <button onClick={() => removeRecipient(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>




      <div className="space-y-2">
          <Label htmlFor="receiver-address">Receivers address</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="receiver-address"
              //onKeyPress="if(event.key==='Enter'){event.preventDefault()}"
              placeholder="Enter the receiver&apos;s address"
              type="text"
            />
            <Button size="sm">Approve</Button>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <p className="text-sm font-medium">0x4b3a9d...</p>
            <Button size="sm" variant="outline">
              <div className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>


      


      <div>
        <label>
          Recipients address (drag and drop a file of Recipients address):
          <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            <p>Drag and drop a file here, or click to select a file</p>
          </div>
        </label>
        <ul>
          {recipients.map((address, index) => (
            <li key={index}>{address}</li>
          ))}
        </ul>
      </div>

      <ApproveToken tokenAddress={tokenAddress} amount={totalamount}/>


      
      <button onClick={handleClick}>Airdrop</button>
    
    </>
  );
}

const dropzoneStyle: React.CSSProperties = {
  border: "2px dashed #0087F7",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};


export default MintNFT;
