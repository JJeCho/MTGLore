export type CardSet = {
    uuid: string;
    name: string;
    manaValue: number | null;
    rarity: string | null;
    type: string | null;
    colors: string[] | null;
    power: string | null;
    toughness: string | null;
    flavorText: string | null;
    artist: string | null;
  };
  
export type SetData = {
    name: string;
    releaseDate: string;
    totalSetSize: number;
    type: string;
    cards: CardSet[];
  };

export type Card = {
    uuid: string;
    name: string;
    manaValue: number | null;
    convertedManaCost: number | null;
    rarity: string | null;
    type: string | null;
    colors: string[] | null;
    power: string | null;
    toughness: string | null;
    flavorText: string | null;
    artist: string | null;
    hasFoil: boolean | null;
    hasNonFoil: boolean | null;
    borderColor: string | null;
    frameVersion: string | null;
    originalText: string | null;
    keywords: string[] | null;
    subtypes: string[] | null;
    supertypes: string[] | null;
    code: string[] | null;
    setName: string[] | null;
    scryfallId: string | null;
  };