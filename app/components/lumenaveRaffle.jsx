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
import { BsGift, BsPerson } from "react-icons/bs";

export default function LumenaveRaffle() {
  const router = useRouter();
  const [prizes, setPrizes] = useState([]);
  const [player, setPlayer] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wraffling, setWraffling] = useState(false);
  const confettiWrapper = useRef(null);
  const height = 60;

  const fetchPrizes = async () => {
    const response = await fetch("/api/prize");
    const data = await response.json();
    setPrizes(data);
  };

  // set Player

  // const handlePlayer = (e) => {
  //   e.preventDefault();
  //   setPlayer(player);
  // };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const transitions = useTransition(
    prizes.map((data, i) => ({ ...data, y: 0.5 * i })),
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
    setGameStarted(true);
    if (prizes.length <= 1) {
      setWraffling(true);
      setShowConfetti(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const filterOutNames = prizes.filter(
      (name) => name !== prizes[randomIndex]
    );
    setPrizes(filterOutNames);
    setInitialLoad(true);
  }, [prizes]);

  const removePrize = async (prize) => {
    const hasConfirmed = confirm(
      `Are you sure you want to remove ${prize.name} ?`
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prize/${prize._id.toString()}`, {
          method: "DELETE",
        });

        const prizesToWin = prizes.filter((item) => item._id !== prize._id);

        setPrizes(prizesToWin);
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
    fetchPrizes();
    // removePrize();
    setGameStarted(false);
    setPrizes(prizes);
    setPlayer("");
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
  }, [initialLoad, prizes, startRaffle]);

  useEffect(() => {
    setWindowHeight(confettiWrapper.current.clientHeight);
    setWindowWidth(confettiWrapper.current.clientWidth);
  }, []);

  return (
    <main ref={confettiWrapper}>
      <div className="raffle-header">
        <Image width={200} src={HeadingImage} alt="heading logo" />
        {/* <h1>LUMENAVE INTERNATIONAL LIMITED RAFFLE DRAW</h1> */}
        {player && !gameStarted && (
          <h1>Welcome {player}, You can shuffle and try your luck </h1>
        )}
        {!initialLoad && (
          <div className="raffle-header__buttons">
            <div>
              <form className="mt-4">
                <label className="text-white">
                  Enter your name:
                  <input
                    className="mx-3 text-black p-2 rounded-lg"
                    type="text"
                    value={player}
                    onChange={(e) => setPlayer(e.target.value)}
                  />
                </label>
                {/* <input
                  className="bg-black px-3 py-2 ml-2 rounded-xl text-white"
                  type="submit"
                /> */}
              </form>
            </div>
            <button className="button-primary" onClick={startRaffle}>
              <Image src={Play} alt="heading logo" />
              Start Raffle
            </button>
            <button
              className="button-outline"
              onClick={() => setPrizes(shuffle(prizes))}
            >
              <Image src={Reshuffle} alt="heading logo" />
              Shuffle
            </button>
            <button className="bg-black py-2 px-11 rounded-full flex gap-2 items-center">
              <h4 className="text-white">{prizes.length}</h4>
              <BsGift color="white" size={20} />
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
              <span onClick={() => removePrize(item)}>{item.name}</span>
            </div>
          </animated.div>
        ))}
      </div>
      <div>
        2
        {showConfetti && (
          <div className="raffle-ends">
            {prizes.length === 1 ? (
              <h3 className="mb-4">
                Congratulations! {player} You have won {prizes[0]?.name} at the
                raffle!
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
