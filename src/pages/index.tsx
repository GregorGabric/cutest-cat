import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getPlaiceholder, IGetPlaiceholderReturn } from "plaiceholder";
import { FC, SyntheticEvent } from "react";
import { useIsFetching } from "react-query";
import Button from "../components/Button";
import { trpc } from "../utils/trpc";

export const getStaticProps = async () => {
  const [firstCat, secondCat] = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=2"
  ).then((data) => data.json());
  const firstCatPlaceholder = await getPlaiceholder(firstCat.url);
  const secondCatPlaceholder = await getPlaiceholder(secondCat.url);

  return {
    props: {
      catPlaceholder: [firstCatPlaceholder, secondCatPlaceholder],
    },
    revalidate: 1,
  };
};

interface CatResponse {
  id: string;
  url: string;
  width: number;
  height: number;
}

const Home: NextPage<{
  catPlaceholder: Array<IGetPlaiceholderReturn>;
}> = ({ catPlaceholder }) => {
  const castVote = trpc.useMutation(["cat.cast-vote"]);
  const createCat = trpc.useMutation(["cat.create-cat"]);
  const { isLoading, data, refetch } = trpc.useQuery(["cat.getTwoCats"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <h1>Loading</h1>;
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
          isLoading={isLoading}
          placeholder={catPlaceholder?.[0]}
          btnClassName="bg-blue-500"
          onClick={selectedTheCutest}
          catNumber={1}
          cat={firstCat as CatResponse}
        />
        <CatCard
          isLoading={isLoading}
          placeholder={catPlaceholder?.[1]}
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
  placeholder?: IGetPlaiceholderReturn;
  isLoading: boolean;
}

const CatCard: FC<CatCardProps> = ({
  cat: { id, url },
  catNumber,
  onClick,
  btnClassName,
  placeholder,
}) => {
  const isLoading = useIsFetching();
  return (
    <div key={id} className="flex flex-col gap-2 ">
      <div className="flex items-center justify-center shadow rounder aspect-square relative h-[200px] w-[200px]  sm:h-[400px] sm:w-[400px]">
        <Image
          className="rounded"
          placeholder="blur"
          blurDataURL={placeholder?.base64}
          priority={true}
          objectFit="cover"
          src={url}
          layout="fill"
          alt="random cat"
        />
      </div>
      <Button
        isLoading={!!isLoading}
        catNumber={catNumber}
        onClick={onClick}
        btnClassName={btnClassName}
      >
        Vote for me
      </Button>
    </div>
  );
};
