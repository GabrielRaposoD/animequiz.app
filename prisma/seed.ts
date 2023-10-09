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

const parseAnimeData = (data: any): Prisma.AnimeCreateInput => {
  console.log(data.studio);
  const rating = ratings[data.rating as keyof typeof ratings];
  const genres = data.genres.map((genre: any) => genre.name);
  const themes = data.themes.map((theme: any) => theme.name);

  const year = new Date(data.aired.from).getFullYear();
  return {
    banner: data.images.jpg.image_url,
    synopsis: data.synopsis ?? '',
    title: data.titles[0].title,
    season: data.season,
    studio: data.studios[0]?.name ?? 'Unknown',
    source: data.source,
    episodes: data.episodes ?? 1,
    type: data.type,
    myAnimeListId: data.mal_id,
    year,
    genres,
    themes,
    rating: rating ?? 'G',
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
  const _ = [...Array(50).keys()];

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

  const animesData = animes!.flatMap((res) => {
    return res.data;
  });

  await prisma.anime.createMany({
    data: animesData.map((anime) => {
      const parsedAnime = parseAnimeData(anime);

      return parsedAnime;
    }),
    skipDuplicates: true,
  });

  await prisma.config.update({
    where: { id: config?.id },
    data: { animePage: page + 50 },
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
