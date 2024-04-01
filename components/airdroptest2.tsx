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
import Image from 'next/image';
import { useState, useEffect } from "react";
import { ButtonLoading } from "./loadingbuttin";
import { ButtonDemo } from "./ui/buttonsh";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalance } from 'wagmi';
import { useReadContracts } from 'wagmi' 
import { erc20Abi } from 'viem'
import { type ReadContractsErrorType } from '@wagmi/core'



export function Airdroptest2() {

  interface TokenInfo {
    name: string;
    decimals: number;
    // Add other properties as needed
  }

  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [spenderAddress, setSpenderAddress] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [totalAmount, settotalAmount] = React.useState(0);
  const [expirationTime, setExpirationTime] = React.useState(0);
  const [recipientsText, setRecipientsText] = React.useState("");
  const [recipients, setRecipients] = React.useState<string[]>([]);
  const [connectedNetwork, setConnectedNetwork] = React.useState<string | null>(null);//React.useState(null);
  const [networkName, setNetworkName] = React.useState("");

  const [decimal, setdecimals] = React.useState<number | null>(null);

  const { address, isConnected } = useAccount();

  console.log(address)

  React.useEffect(() => {
    // Check the value of connectedNetwork and set networkName accordingly
    switch (connectedNetwork) {
      case "0x1":
        setNetworkName("ethereum");
        break;
      case "0x89":
        setNetworkName("polygon");
        break;
      case "0x2105":
        setNetworkName("base");
        break;
      case "0xa4b1":
        setNetworkName("arbitrum");
        break;
      case "0x144":
        setNetworkName("zksync");
        break;
      case "0x38":
        setNetworkName("binance");
        break;
      case "0x45c":
        setNetworkName("ethereum");
        break;
      // Add cases for other chains
      // ...
      default:
        // Handle other cases if needed
        setNetworkName(""); // Default value if connectedNetwork is not matched
    }
  }, [connectedNetwork]); // Run this effect whenever connectedNetwork changes


  //to find chain id user conneted with



  console.log(connectedNetwork)

  React.useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (window.ethereum) {
          // Wait for the Ethereum provider to be connected
          await window.ethereum.enable();

          // Access the chainId property for the chain ID
          const chainId = window.ethereum.chainId;
          setConnectedNetwork(chainId);
        }
      } catch (error) {
        console.error('Error checking network:', error);
      }
    };

    // Initial check on component mount
    checkNetwork();

    // Set up interval to refresh every 1 second
    const intervalId = setInterval(checkNetwork, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means it only runs on mount and unmount













  const decimals = decimal ?? 0; //tokenInfo?.decimals ?? 0;



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
  const handleKeyDown1 = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      addRecipient(recipientsText.trim());
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      addRecipient(recipientsText.trim());
    }
  };

  const amoutdec = amount * 10 ** decimals;
  //console.log(amoutdec)
  const totalamount = amount * 10 ** decimals * recipients.length;
  //console.log(totalamount,"total")

  //airdrop button
  const handleClick = async () => {
    /*const recipientsArray = recipientsText
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address !== ""); */

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);

    try {
      const ethValue = 0.0003; // Amount in ETH
      const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0x1b4010669843da8aeafc1d1beE4f9D3709F270f2",//"0xbe8a2312082F2cB92571F35c6914565E6830c58e",
        functionName: "airdrop",
        args: [tokenAddress, recipients, BigInt(amount * 10 ** decimals)],
        value: BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(tokenAddress, recipients, BigInt(amount))

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log("Approval successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };




  //fecth about token
  useEffect(() => {
    // Make sure the tokenAddress is not an empty string
    if (tokenAddress.trim() === '') {
      setTokenInfo(null); // Reset tokenInfo if the tokenAddress is empty
      return;
    }

    const apiUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${tokenAddress}/info.json`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Extract the 'name' property from the API response
        const { name } = data;
        const { decimals } = data;

        // Set only the 'name' in the state
        setTokenInfo({ name, decimals });
      })
      .catch((error) => {
        console.error('Error fetching token info:', error);
        setTokenInfo(null); // Reset tokenInfo in case of an error
      });
  }, [tokenAddress, networkName]);


  const tokenaddreswith0x = tokenAddress.startsWith("0x") ? tokenAddress.substring(2) : tokenAddress;
  const useraddresswith0x = address?.startsWith("0x") ? address?.substring(2) : address;

  type UseReadContractsReturnType = {
    data: [bigint, number, string]; // Adjust the actual data type based on your contract's return type
    error: ReadContractsErrorType;
    // Add other necessary properties based on the actual type
  };
  

  const result = useReadContracts({ 
    allowFailure: false, 
    contracts: [ 

      { 
        address: `0x${tokenaddreswith0x}`, 
        abi: erc20Abi, 
        functionName: 'balanceOf', 
        args: [`0x${useraddresswith0x}`], 
      }, 

      { 
        address: `0x${tokenaddreswith0x}`, 
        abi: erc20Abi, 
        functionName: 'decimals', 
      }, 
      { 
        address: `0x${tokenaddreswith0x}`, 
        abi: erc20Abi, 
        functionName: 'name', 
      }, 
      { 
        address:`0x${tokenaddreswith0x}`, 
        abi: erc20Abi, 
        functionName: 'symbol', 
      }, 
    ] 
  }) 


// Use optional chaining to safely access 'data' property
const [balanceContract, Tokendecimals, TokenName, Tokensymbol] = result?.data || [];

// Access individual properties
console.log('Balance:', balanceContract);
console.log('Name:',TokenName);
console.log('Decimals:', Tokendecimals);

console.log('Symbol:', Tokensymbol);



 


  /** <p>{tokenInfo ? tokenInfo.name : 'Loading...'}</p>
              <p>{tokenInfo ? tokenInfo.decimals : 'Loading...'}</p>
              <p>Connected Network: {connectedNetwork} {networkName}</p>
   */



  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Airdrop tokens</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter the token address, receivers address, and the amount you want to send. Click the Approve button to
          approve the transaction and the Airdrop button to airdrop the tokens.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token-address">Token address</Label>
          <Input id="token-address" placeholder="Enter the token address" type="text" value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)} />
          <Image src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networkName}/assets/${tokenAddress}/logo.png`} width="50" height="30" alt="" />
          <p>{TokenName}</p>
          <h1></h1>

        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Token decimals</Label>
          <Input id="amount" placeholder="Enter the amount" type="text" onChange={(e) => setdecimals(Number(e.target.value))} />
        </div>


        <div className="space-y-2">
          <Label htmlFor="receiver-address">Receivers address</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="receiver-address"
              //onKeyPress="if(event.key==='Enter'){event.preventDefault()}"
              placeholder="Enter the receiver&apos;s address"
              type="text" value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button size="sm" onClick={() => addRecipient(recipientsText.trim())}>Add</Button>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <div className="text-sm font-medium ">
              <ul>
                {recipients.map((address, index) => (
                  <li key={index}> {address}

                    <button onClick={() => removeRecipient(index)} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 ">Remove</button>

                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to each address</Label>
          <Input id="amount" placeholder="Enter the amount" type="text" onChange={(e) => setAmount(Number(e.target.value))} />
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

        {isConnected ? (
             <div className="flex space-x-2 items-center justify-center">
                <ApproveToken tokenAddress={tokenAddress} amount={totalamount}/>
              <div className="m-3">
              <Button  onClick={handleClick} disabled={isPending} > {isPending ? (<ButtonLoading/>) : (<ButtonDemo  buttonName={'airdrop'}/>)}</Button>
              {isSuccess && <div>Transaction successful!</div>}
              </div>

             </div>
        ) : (
             <ConnectButton/>
        ) }



   

      </div>
    </div>
  )
}

const dropzoneStyle: React.CSSProperties = {
  border: "2px dashed #0087F7",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};



export default Airdroptest2;



//buttons

/**
 *      <div className="flex space-x-2 items-center justify-center">
        
        
          <ApproveToken tokenAddress={tokenAddress} amount={totalamount}/>
          <div className="m-3">
           
          <Button  onClick={handleClick} disabled={isPending} > {isPending ? (<ButtonLoading/>) : (<ButtonDemo  buttonName={'airdrop'}/>)}</Button>
          {isSuccess && <div>Transaction successful!</div>}
          </div>
        </div>
 */