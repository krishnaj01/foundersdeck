import StartupCard, { StartupCardType } from "@/components/StartupCard";
import SearchForm from "@/components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {

  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params }); // new method: fetches all startups from the database

  // const posts = await client.fetch(STARTUPS_QUERY); // old method: fetches all startups from the database

  // console.log(JSON.stringify(posts, null, 2)); // null, 2 adds addiitonal spacing in the console log, just to style it
  // const posts = [
  //   {
  //     _createdAt: new Date(),
  //     views: 55,
  //     author: {_id: 1, name: 'John Doe'},
  //     _id: 1,
  //     description: 'This is a description.',
  //     image: 'https://images.unsplash.com/photo-1634912314704-c646c586b131?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     category: "Robots",
  //     title: 'We Robots'
  //   }
  // ]

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect with Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts.length > 0 ? posts.map((post: StartupCardType, index: number) => (
            <li key={post._id} className="startup-card group">
              <StartupCard post={post} />
            </li>
          )) : (
            <p className="no-results">No startups found.</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
