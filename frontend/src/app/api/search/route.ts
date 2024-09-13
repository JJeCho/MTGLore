import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

// Access environment variables
const driver = neo4j.driver(
  process.env.NEO4J_URI as string,
  neo4j.auth.basic(process.env.NEO4J_USER as string, process.env.NEO4J_PASSWORD as string)
);

// Named export for the POST method
export async function POST(request: Request) {
  // Extract query params (searchTerm) from the request URL
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm');

  if (!searchTerm) {
    return NextResponse.json({ error: 'Missing searchTerm' }, { status: 400 });
  }

  const session = driver.session();

  try {
    const query = `
      MATCH (p:Planeswalker)
      WHERE toLower(p.name) CONTAINS toLower($searchTerm)
      RETURN p.name AS name, 'Planeswalker' AS category
      UNION ALL
      MATCH (c:Creature)
      WHERE toLower(c.name) CONTAINS toLower($searchTerm)
      RETURN c.name AS name, 'Creature' AS category
      UNION ALL
      MATCH (a:Artifact)
      WHERE toLower(a.name) CONTAINS toLower($searchTerm)
      RETURN a.name AS name, 'Artifact' AS category
      UNION ALL
      MATCH (l:Land)
      WHERE toLower(l.name) CONTAINS toLower($searchTerm)
      RETURN l.name AS name, 'Land' AS category
      UNION ALL
      MATCH (pl:Plane)
      WHERE toLower(pl.name) CONTAINS toLower($searchTerm)
      RETURN pl.name AS name, 'Plane' AS category
      UNION ALL
      MATCH (s:Set)
      WHERE toLower(s.name) CONTAINS toLower($searchTerm)
      RETURN s.name AS name, 'Set' AS category
      UNION ALL
      MATCH (cs:CardSet)
      WHERE toLower(cs.name) CONTAINS toLower($searchTerm)
      RETURN cs.name AS name, 'Card' AS category
    `;

    const result = await session.run(query, { searchTerm });

    const records = result.records.map((record) => ({
      name: record.get('name'),
      category: record.get('category'),
    }));

    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  } finally {
    await session.close();
  }
}
