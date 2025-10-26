export interface Theme {
  name: string
  sidebarBackground: string
  headerBackground: string
  mainBackground: string
  cardBackground: string
  cardBorder: string
  shadow: string
  textPrimary: string
  accentPrimary: string
  accentSecondary: string
  buttonStyle: {
    background: string
    color: string
    borderRadius: string
  }
}

export const playfulLocalTheme: Theme = {
  name: "Playful Local Energy",
  sidebarBackground: "#E5F7F8",
  headerBackground: "white",
  mainBackground: "#FFF9F5",
  cardBackground: "white",
  cardBorder: "1px solid rgba(0,0,0,0.05)",
  shadow: "0 2px 6px rgba(0,0,0,0.05)",
  textPrimary: "#2C2A29",
  accentPrimary: "#F46C5B",
  accentSecondary: "#F783A5",
  buttonStyle: {
    background: "#F46C5B",
    color: "white",
    borderRadius: "9999px",
  },
}

export const modernBoutiqueTheme: Theme = {
  name: "Modern Boutique Ice Cream",
  sidebarBackground: "#FFFFFF",
  headerBackground: "linear-gradient(90deg, #F46C5B, #F783A5)",
  mainBackground: "#FFFCFA",
  cardBackground: "#FFFFFF",
  cardBorder: "1px solid rgba(0,0,0,0.06)",
  shadow: "0 4px 12px rgba(0,0,0,0.06)",
  textPrimary: "#333333",
  accentPrimary: "#F46C5B",
  accentSecondary: "#F783A5",
  buttonStyle: {
    background: "linear-gradient(90deg, #F46C5B, #F783A5)",
    color: "white",
    borderRadius: "12px",
  },
}

export type ThemeName = "playful" | "modern"

export const themes: Record<ThemeName, Theme> = {
  playful: playfulLocalTheme,
  modern: modernBoutiqueTheme,
}
