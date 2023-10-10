import * as fs from 'fs';

import { Prisma, PrismaClient, Rating } from '@prisma/client';
import { parallel, sleep, try as tryit } from 'radash';

const prisma = new PrismaClient();

const ratings: { [key: string]: Rating } = {
  'G - All Ages': 'G',
  'PG - Children': 'PG',
  'PG-13 - Teens 13 or older': 'PG13',
  'R - 17+ (violence & profanity)': 'R',
  'R+ - Mild Nudity': 'R',
  'Rx - Hentai': 'RX',
};

const FETCH_AMOUNT = 50;

const findPrequel = async (data: any) => {
  if (!data.hasPrequel) {
    return { anime: data.anime, hasPrequel: false };
  }

  const res = await fetch(
    process.env.ANIME_API_URL + `anime/${data.anime.mal_id}/relations`
  ).then((res) => res.json());

  await sleep(1000);

  const prequel = res.data.find((item: any) => {
    return item.relation === 'Prequel';
  });

  if (!prequel) {
    return { anime: data.anime, hasPrequel: false };
  }

  const newAnime = await fetch(
    process.env.ANIME_API_URL + `anime/${prequel.entry[0].mal_id}/full`
  ).then((res) => res.json());

  await sleep(1000);

  return { anime: newAnime.data, hasPrequel: true };
};

const parseAnimeData = (data: any): Prisma.AnimeCreateInput => {
  const rating = ratings[data?.rating as keyof typeof ratings] ?? 'G';
  const genres = data.genres.map((genre: any) => genre.name);
  const themes = data.themes.map((theme: any) => theme.name);

  const year = new Date(data.aired.from).getFullYear();
  return {
    banner: data.images.jpg.image_url,
    synopsis: data.synopsis ?? '',
    title: data.titles[0].title,
    season: data.season ? data.season : 'Unknown',
    studio:
      data.studios[0]?.name.length > 0 ? data.studios[0]?.name : 'Unknown',
    source: data.source,
    episodes: data.episodes ?? 1,
    type: data.type,
    myAnimeListId: data.mal_id,
    year,
    genres: genres.length > 0 ? genres : ['Unknown'],
    themes: themes.length > 0 ? themes : ['Unknown'],
    rating: rating,
  };
};

async function main() {
  let config = await prisma.config.findFirst({});

  if (!config) {
    config = await prisma.config.create({
      data: {},
    });
  }

  let page = config.animePage || 1;
  const _ = [...Array(FETCH_AMOUNT).keys()];

  const [animesErr, animes] = await tryit(parallel)(1, _, async (i) => {
    const data = await fetch(
      process.env.ANIME_API_URL + `top/anime?page=${page + i}`
    );

    await sleep(1000);

    return await data.json();
  });

  if (animesErr) {
    console.error(animesErr);
    return;
  }

  let animesData = animes!.flatMap((res) => {
    return res.data.map((anime: any) => {
      return { anime, hasPrequel: true };
    });
  });

  animesData = animesData.filter((a) => {
    return (a.anime.type as string).toLowerCase() === 'tv';
  });

  let hasPrequel = true;

  while (hasPrequel) {
    animesData = await parallel(1, animesData, findPrequel);

    if (!animesData.some((anime) => anime.hasPrequel)) {
      hasPrequel = false;
    }
  }

  animesData = animesData.filter((a) => a.anime.type === 'TV');

  await prisma.anime.createMany({
    data: animesData.map((a) => {
      const parsedAnime = parseAnimeData(a.anime);

      return parsedAnime;
    }),
    skipDuplicates: true,
  });

  await prisma.config.update({
    where: { id: config?.id },
    data: { animePage: page + FETCH_AMOUNT },
  });

  const dbAnimes = await prisma.anime.findMany({});

  await parallel(1, dbAnimes, async (anime) => {
    const data = await fetch(
      process.env.ANIME_API_URL + `anime/${anime.myAnimeListId}/characters`
    );

    await sleep(1000);

    const res = await data.json();

    const charactersData = res.data as any[];

    return await prisma.character.createMany({
      data: charactersData.map((data) => ({
        animeId: anime.id,
        image: data.character.images.jpg.image_url,
        slug: data.character.name + ' - ' + anime.title,
        name: data.character.name.split(',').reverse().join(' ').trim(),
      })),
      skipDuplicates: true,
    });
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
