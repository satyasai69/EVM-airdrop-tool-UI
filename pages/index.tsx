import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintNFT } from "../components/airdrop";
import Navbar from "@/components/navbar";
import Airdroptest2 from "@/components/airdroptest2"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} `}
    >
      
      <div className="absolute top-11 right-0 m-4">
        <ConnectButton />
      </div>
      <Airdroptest2/>

    
    </main>
  );
}
