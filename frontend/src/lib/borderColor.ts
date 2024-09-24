const colorMapping: Record<string, string> = {
    W: "#FFFFFF",   // White
    U: "#1E90FF",   // Blue
    B: "#000000",   // Black
    R: "#FF4500",   // Red
    G: "#228B22",   // Green
    C: "#606060",   // Colorless (optional)
  };

const getBorderColor = (colors: string[] | null): string => {
    if (!colors || colors.length === 0) {
      return "#A9A9A9";
    }

    if (colors.length === 1) {
      return colorMapping[colors[0]] || "#A9A9A9";
    }
  
    const gradientColors = colors
      .map((color) => colorMapping[color] || "#A9A9A9")
      .join(", ");
    return `linear-gradient(45deg, ${gradientColors})`;
  };

  export default getBorderColor