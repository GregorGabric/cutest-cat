import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import { trpc } from "../utils/trpc";

interface CatResponse {
  id: string;
  url: string;
  width: number;
  height: number;
}

const Home: NextPage = () => {
  const { isLoading, data } = trpc.useQuery(["cat.getTwoCats"], {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  // const { data, isLoading } =
  //   trpc.proxy.example.getCat.useQuery<Array<CatResponse>>();

  if (isLoading) {
    return <p>Loading</p>;
  }

  const [firstCat, secondCat] = data;

  return (
    <>
      <Head>
        <title>Cutest cat</title>
        <meta name="description" content="Choose the cutest cat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex items-center justify-center min-h-screen p-4 mx-auto gap-10">
        <CatCard cat={firstCat} />
        <CatCard cat={secondCat} />
      </main>
    </>
  );
};

export default Home;

interface CatCardProps {
  cat: CatResponse;
}

const CatCard: FC<CatCardProps> = ({ cat: { id, url } }) => {
  return (
    <div key={id} className="flex flex-col gap-2 ">
      <div className="shadow rounder aspect-square relative h-[400px] w-[400px]">
        {url && (
          <Image
            className="transition-all"
            loading="eager"
            objectFit="cover"
            src={url}
            layout="fill"
            alt="random cat"
          />
        )}
      </div>
      <button className="rounded-lg mx-auto px-4 py-2 bg-green-400 active:translate-y-1 transition-transform ease-in">
        Im the cutest
      </button>
    </div>
  );
};
