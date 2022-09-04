import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FC, SyntheticEvent } from "react";
import { trpc } from "../utils/trpc";

interface CatResponse {
  id: string;
  url: string;
  width: number;
  height: number;
}

const Home: NextPage = () => {
  const { isLoading, data, refetch } = trpc.useQuery(["cat.getTwoCats"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const castVote = trpc.useMutation(["cat.cast-vote"]);
  const createCat = trpc.useMutation(["cat.create-cat"]);

  if (isLoading) {
    return <p>Loading</p>;
  }

  const [firstCat, secondCat] = data as Array<CatResponse>;

  const selectedTheCutest = async ({
    currentTarget: {
      dataset: { catNumber },
    },
  }: SyntheticEvent<HTMLButtonElement>) => {
    if (!firstCat?.id || !secondCat?.id) {
      return;
    }

    await createCat.mutateAsync({
      url: firstCat.url,
      id: firstCat.id,
    });
    await createCat.mutateAsync({
      url: secondCat.url,
      id: secondCat.id,
    });

    switch (catNumber) {
      case "1":
        castVote.mutate({
          votedFor: firstCat.id,
          votedAgainst: secondCat.id,
        });
        break;
      case "2":
        castVote.mutate({
          votedFor: secondCat.id,
          votedAgainst: firstCat.id,
        });
        break;
    }

    refetch();
  };

  return (
    <>
      <Head>
        <title>Cutest cat</title>
        <meta name="description" content="Choose the cutest cat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col sm:flex-row items-center justify-center min-h-screen p-4 mx-auto gap-10">
        <CatCard
          btnClassName="bg-blue-500"
          onClick={selectedTheCutest}
          catNumber={1}
          cat={firstCat as CatResponse}
        />
        <CatCard
          btnClassName="bg-green-500"
          onClick={selectedTheCutest}
          catNumber={2}
          cat={secondCat as CatResponse}
        />
      </main>
    </>
  );
};

export default Home;

interface CatCardProps {
  cat: CatResponse;
  catNumber: number;
  onClick: (event: SyntheticEvent<HTMLButtonElement>) => void;
  btnClassName: string;
}

const CatCard: FC<CatCardProps> = ({
  cat: { id, url },
  catNumber,
  onClick,
  btnClassName,
}) => {
  return (
    <div key={id} className="flex flex-col gap-2 ">
      <div className="shadow rounder aspect-square relative h-[200px] w-[200px]  sm:h-[400px] sm:w-[400px]">
        {url && (
          <Image
            className=""
            loading="eager"
            objectFit="cover"
            src={url}
            layout="fill"
            alt="random cat"
          />
        )}
      </div>
      <button
        data-cat-number={catNumber}
        onClick={onClick}
        className={`rounded-lg mx-auto px-4 py-2 ${btnClassName}`}
      >
        Im the cutest
      </button>
    </div>
  );
};
