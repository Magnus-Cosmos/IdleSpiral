import type { NextPage } from 'next';
import Head from 'next/head';
import CryptoJS from "crypto-js";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [isHidden, setHidden] = useState(false);
  const toggleHidden = () => setHidden(!isHidden);

  const [stats, setStats] = useState<any>({});

  const displayedBattleRewards = ["ATK", "ATK%", "HP", "HP%", "DEF", "DEF%", "Crit Damage", "Regenerate", "Attack Speed", "S-Crit Damage", "Rare Drop Rate", "Math Skill"];

  function decrypt(text: string) {
    const kdf = CryptoJS.PBKDF2("kkyyhka", "stkttnsstkttns", {
      keySize: 8,
      hasher: CryptoJS.algo.SHA1,
      iterations: 1000
    });

    const key = CryptoJS.enc.Hex.parse(kdf.toString().substring(0, 32));
    const iv = CryptoJS.enc.Hex.parse(kdf.toString().substring(32, 64));
    // @ts-ignore: Ignore remaining args for cipherParams
    return CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(text) }, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
  }

  async function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (file == null) {
      console.log("no file");
      return;
    }
    const text = await file.text();
    const arr = text.trim().split("#");
    const saver = JSON.parse(decrypt(arr[0]));
    const save = JSON.parse(decrypt(arr[1]));
    const dto = JSON.parse(decrypt(arr[2]));
    const battle_rewards: { [key: string]: number } = {
      "HP": dto.battle_rewards[0],
      "ATK": dto.battle_rewards[1],
      "DEF": dto.battle_rewards[2],
      "a": dto.battle_rewards[3],
      "b": dto.battle_rewards[4],
      "c": dto.battle_rewards[5],
      "d": dto.battle_rewards[6],
      "e": dto.battle_rewards[7],
      "k": dto.battle_rewards[8],
      "Regenerate": dto.battle_rewards[9],
      "Crit Rate": dto.battle_rewards[10],
      "Crit Damage": dto.battle_rewards[11],
      "a%": dto.battle_rewards[12],
      "b%": dto.battle_rewards[13],
      "c%": dto.battle_rewards[14],
      "d%": dto.battle_rewards[15],
      "e%": dto.battle_rewards[16],
      "k%": dto.battle_rewards[17],
      "HP%": dto.battle_rewards[18],
      "ATK%": dto.battle_rewards[19],
      "DEF%": dto.battle_rewards[20],
      "n": dto.battle_rewards[21],
      "v": dto.battle_rewards[22],
      "γ": dto.battle_rewards[23],
      "δ": dto.battle_rewards[24],
      "Ω": dto.battle_rewards[25],
      "Attack Speed": dto.battle_rewards[26],
      "γ%": dto.battle_rewards[27],
      "δ%": dto.battle_rewards[28],
      "Ω%": dto.battle_rewards[29],
      "Exp": dto.battle_rewards[30],
      "Rare Drop Rate": dto.battle_rewards[31],
      "S-Crit Rate": dto.battle_rewards[32],
      "S-Crit Damage": dto.battle_rewards[33],
      "Math Skill": dto.battle_rewards[34],
      "Other": dto.battle_rewards[35],
      "Enemy HP Reduction": dto.battle_rewards[36],
      "Regenerate While Resting": dto.battle_rewards[37],
      "Max Level Up #24": dto.battle_rewards[38],
      "Unlock": dto.battle_rewards[39],
    };
    const f_battle_rewards: { [key: string]: string } = {};
    for (const reward in battle_rewards) {
      if (reward.indexOf("%") > -1 || reward.indexOf("Crit") > -1 || reward.indexOf("Speed") > -1 || reward.indexOf("Rate") > -1) {
        battle_rewards[reward] *= 100;
      }

      if (battle_rewards[reward] > 999) {
        const [coefficient, exponent] = battle_rewards[reward].toExponential(2).replace("+", "").split("e").map(val => Number(val));
        f_battle_rewards[reward] = "+" + coefficient.toFixed(2) + "e" + String(exponent).padStart(2, "0");
      } else {
        f_battle_rewards[reward] = "+" + battle_rewards[reward].toFixed(2);
      }

      if (reward.indexOf("%") > -1 || reward.indexOf("Crit") > -1 || reward.indexOf("Speed") > -1 || reward.indexOf("Rate") > -1) {
        f_battle_rewards[reward] += "%";
      }
    }
    console.log(f_battle_rewards);
    toggleHidden();
    setStats(f_battle_rewards);
  }

  const battleRewards: JSX.Element[] = [];

  for (const reward of displayedBattleRewards) {
    battleRewards.push(<>- {reward.replace("%", "")}<span className="inline-block ml-6"></span>{stats[reward]}<br></br></>)
  }

  return (
    <div className="px-8">
      <Head>
        <title>Idle Spiral</title>
        <meta name="description" content="For loading Idle Spiral save files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-4 flex flex-1 flex-col justify-center items-center">

        <div className={(isHidden ? "hidden " : "") + "flex flex-col justify-center items-center w-full"}>
          <p className="mb-2 text-2xl font-medium text-gray-500 dark:text-gray-400">Upload save file</p>
          <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-64 h-40 bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer shadow-md dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:shadow-gray-900">
            <div className="flex flex-col justify-center items-center py-6">
              <FontAwesomeIcon icon={faArrowCircleUp} className="w-12 opacity-50 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Drop file here</span> or click to upload</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleOnChange} accept=".txt"></input>
          </label>
        </div>

        <div className={(!isHidden ? "hidden " : "") + "flex flex-col justify-center items-center w-full h-full text-white"}>
          <div className="w-[60rem] h-[33.75rem] 2xl:w-[90rem] 2xl:h-[50.625rem] p-0.5 bg-zinc-900 shadow-lg shadow-zinc-600 dark:shadow-none">
            <div className="w-1/6 h-full bg-black border-2 border-zinc-200">
              <div className="w-full h-1/2">
                <h2 className="text-center bg-neutral-900">Raw Battle Rewards</h2>
                <p className="p-2 text-sm">{battleRewards}</p>
              </div>
              <div className="w-full h-1/2">
                <h2 className="text-center bg-neutral-900">Parameter Gain</h2>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default Home
