'use client';

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const colorMapping: Record<string, string> = {
  W: "#FFFFFF",   // White
  U: "#1E90FF",   // Blue
  B: "#000000",   // Black
  R: "#FF4500",   // Red
  G: "#228B22",   // Green
};

const Navigation = () => {
  const router = useRouter();

  const handleNavigate = (category: string, id: string) => {
    let routePath = `/lore/${category}/${id}`;

    switch (category) {
      case 'Set':
        routePath = `/sets/${id}`;
        break;
      case 'Card':
        routePath = `/cards/${id}`;
        break;
      case 'Cards':
        routePath = `/cards`;
        break;
      case 'Artist':
        routePath = `/artists/${id}`;
        break;
      case 'Color':
        routePath = `/colors/${id}`;
        break;
      case 'Rarity':
        routePath = `/rarity/${id}`;
        break;
      case 'ManaValue':
        routePath = `/manaValue/${Number(id)}`;
        break;
      default:
        break;
    }

    router.push(routePath);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => router.push("/")}>
          <Image
            src="/logo.png"
            alt="MTGLore"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold text-gray-800">MTGLore</span>
        </div>

        <nav className="flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
                  Colors
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 space-y-2">
                  {Object.keys(colorMapping).map((colorKey) => (
                    <Button
                      key={colorKey}
                      onClick={() => handleNavigate("Color", colorKey)}
                      style={{ backgroundColor: colorMapping[colorKey], color: colorKey === 'W' ? '#000' : '#fff' }}
                    >
                      {colorKey === 'W' ? 'White' : colorKey === 'U' ? 'Blue' : colorKey === 'B' ? 'Black' : colorKey === 'R' ? 'Red' : 'Green'}
                    </Button>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
                  Mana Values
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4 space-y-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      onClick={() => handleNavigate("ManaValue", `${i}`)}
                    >
                      {i}
                    </Button>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button variant="outline" onClick={() => handleNavigate("Cards", '')}>
            All Cards
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
