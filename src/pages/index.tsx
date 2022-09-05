import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { trpc } from "../utils/trpc";

interface CatResponse {
  id: string;
  url: string;
  width: number;
  height: number;
}

const Home: NextPage = () => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const castVote = trpc.useMutation(["cat.cast-vote"]);
  const createCat = trpc.useMutation(["cat.create-cat"]);
  const { isLoading, data, refetch, isFetching } = trpc.useQuery(
    ["cat.getTwoCats"],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (isFetching) {
      setIsImageLoading(true);
    } else {
    }
  }, [isFetching]);

  if (isLoading) {
    return <p>Loading</p>;
  }

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

    setIsImageLoading(true);
    refetch();
  };

  const [firstCat, secondCat] = data as Array<CatResponse>;

  return (
    <>
      <Head>
        <title>Cutest cat</title>
        <meta name="description" content="Choose the cutest cat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col sm:flex-row items-center justify-center min-h-screen p-4 mx-auto gap-10">
        <CatCard
          isImageLoading={isImageLoading}
          setIsImageLoading={setIsImageLoading}
          btnClassName="bg-blue-500"
          onClick={selectedTheCutest}
          catNumber={1}
          cat={firstCat as CatResponse}
        />
        <CatCard
          isImageLoading={isImageLoading}
          setIsImageLoading={setIsImageLoading}
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
  isImageLoading: boolean;
  setIsImageLoading: Dispatch<SetStateAction<boolean>>;
}

const CatCard: FC<CatCardProps> = ({
  cat: { id, url },
  catNumber,
  onClick,
  btnClassName,
  isImageLoading,
  setIsImageLoading,
}) => {
  const onLoadingComplete = () => setIsImageLoading(false);

  return (
    <div key={id} className="flex flex-col gap-2 ">
      <div className="shadow rounder aspect-square relative h-[200px] w-[200px]  sm:h-[400px] sm:w-[400px]">
        {isImageLoading && <h1>loading</h1>}
        <Image
          onLoadingComplete={onLoadingComplete}
          className={`${
            isImageLoading ? "opacity-0" : "opacity-100"
          } transition-opacity`}
          loading="eager"
          objectFit="cover"
          src={url}
          layout="fill"
          alt="random cat"
        />
        {/* )} */}
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
