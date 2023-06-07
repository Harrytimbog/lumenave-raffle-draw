"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTransition, animated } from "react-spring";

import shuffle from "lodash/shuffle";
import Confetti from "react-confetti";
import Image from "next/image.js";
import useSound from "use-sound";
import soundUrl from "../sounds/crowd-cheering-143103.mp3";

// import data from "../../../data.js";
import HeadingImage from "../images/lumenave_logo.png";
import Play from "../images/play.svg";
import Reshuffle from "../images/reshuffle.svg";
import Replay from "../images/replay.svg";
import { BsPerson } from "react-icons/bs";

export default function LumenaveRaffle() {
  const router = useRouter();
  const [names, setNames] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wraffling, setWraffling] = useState(false);
  const confettiWrapper = useRef(null);
  const height = 60;

  const fetchContestants = async () => {
    const response = await fetch("/api/staff");
    const data = await response.json();
    setNames(data);
  };

  useEffect(() => {
    fetchContestants();
  }, []);

  const transitions = useTransition(
    names.map((data, i) => ({ ...data, y: 0.5 * i })),
    (d) => d.name,
    {
      from: { position: "initial", opacity: 0 },
      leave: {
        height: height - height * 0.2,
        opacity: 0,
      },
      enter: ({ y }) => ({ y, opacity: 1 }),
      update: ({ y }) => ({ y }),
    }
  );

  const startRaffle = useCallback(() => {
    if (names.length <= 1) {
      setWraffling(true);
      setShowConfetti(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * names.length);
    const filterOutNames = names.filter((name) => name !== names[randomIndex]);
    setNames(filterOutNames);
    setInitialLoad(true);
  }, [names]);

  const deleteContestant = async (staff) => {
    const hasConfirmed = confirm(
      `Are you sure you want to remove ${staff.name} ?`
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/staff/${staff._id.toString()}`, {
          method: "DELETE",
        });

        const nextContestants = names.filter((item) => item._id !== staff._id);

        setNames(nextContestants);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const playSound = () => {
  //   new Audio(sound).play();
  // };

  const [play, { stop }] = useSound(soundUrl, { volume: 1 });

  const restartRaffle = () => {
    setInitialLoad(false);
    fetchContestants();
    // deleteContestant();
    setNames(names);
    setWraffling(false);
    setShowConfetti(false);
  };

  useEffect(() => {
    if (initialLoad) {
      const filteringTimer = setTimeout(() => {
        startRaffle();
      }, 700);
      return () => {
        clearTimeout(filteringTimer);
      };
    }
  }, [initialLoad, names, startRaffle]);

  useEffect(() => {
    setWindowHeight(confettiWrapper.current.clientHeight);
    setWindowWidth(confettiWrapper.current.clientWidth);
  }, []);

  return (
    <main ref={confettiWrapper}>
      <div className="raffle-header">
        <Image width={200} src={HeadingImage} alt="heading logo" />
        {/* <h1>LUMENAVE INTERNATIONAL LIMITED RAFFLE DRAW</h1> */}
        {!initialLoad && (
          <div className="raffle-header__buttons">
            <button className="button-primary" onClick={startRaffle}>
              <Image src={Play} alt="heading logo" />
              Start Raffle
            </button>
            <button
              className="button-outline"
              onClick={() => setNames(shuffle(names))}
            >
              <Image src={Reshuffle} alt="heading logo" />
              Shuffle
            </button>
            <button className="bg-black py-2 px-11 rounded-full flex gap-2 items-center">
              <h4 className="text-white">{names.length}</h4>
              <BsPerson color="white" size={20} />
            </button>
          </div>
        )}
      </div>
      {wraffling && (
        <Confetti
          recycle={showConfetti}
          numberOfPieces={80}
          width={windowWidth}
          height={windowHeight}
        />
      )}
      {wraffling && play()}
      <div className="raffle-names">
        {transitions.map(({ item, props: { y, ...rest }, index }) => (
          <animated.div
            className="raffle-listnames"
            key="{index}"
            style={{
              transform: y.interpolate((y) => `translate3d(0,${y}px,0)`),
              ...rest,
            }}
          >
            <div className="raffle-namelist cursor-pointer">
              <span onClick={() => deleteContestant(item)}>{item.name}</span>
            </div>
          </animated.div>
        ))}
      </div>
      <div>
        2
        {showConfetti && (
          <div className="raffle-ends">
            {names.length === 1 ? (
              <h3 className="mb-4">
                Congratulations! {names[0]?.name} You have won the raffle!
              </h3>
            ) : (
              <h3 className="mb-4">This round is over</h3>
            )}
            <button className="button-outline" onClick={restartRaffle}>
              <Image src={Replay} alt="heading logo" />
              Replay
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
