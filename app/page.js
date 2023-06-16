import Link from "next/link";
import LumenaveRaffle from "./components/lumenaveRaffle";
import { BsGift, BsPersonAdd } from "react-icons/bs";

export default async function Home() {
  // const data = await fetch(`http://localhost:3000/api/staff`);

  // const res = await data.json();

  return (
    <>
      <LumenaveRaffle />
      {/* <LumenaveRaffle data={res} /> */}
      <Link href="/add-prize" className="fixed bottom-0 left-2">
        <div className="flex items-center gap-2 text-3xl">
          <BsGift color="white" size={50} />
          <span className="text-white">+</span>
        </div>
      </Link>
      <Link href="/" className="fixed bottom-0 right-2">
        <BsPersonAdd color="white" size={50} />
      </Link>
    </>
  );
}
