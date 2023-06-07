import Link from "next/link";
import LumenaveRaffle from "./components/lumenaveRaffle";
import { BsPersonAdd } from "react-icons/bs";

export default async function Home() {
  // const data = await fetch(`http://localhost:3000/api/staff`);

  // const res = await data.json();

  return (
    <>
      <LumenaveRaffle />
      {/* <LumenaveRaffle data={res} /> */}
      <Link href="/add-contestant" className="fixed bottom-0 left-0">
        <BsPersonAdd color="white" size={50} />
      </Link>
    </>
  );
}
