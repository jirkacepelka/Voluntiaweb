// Hodnoty – stejný obsah jako sekce „Hodnoty“ na is.voluntia.cz.

export interface Value {
  title: string;
  text: string;
  /** Ikona Lucide, nebo vlastní ikona NATO / mapa Evropy (jako v IS). */
  icon: 'Store' | 'Landmark' | 'Shapes' | 'Handshake' | 'nato' | 'europe';
}

export const values: Value[] = [
  { title: 'Volný trh', icon: 'Store', text: 'Zastáváme férovou a otevřenou tržní ekonomiku, prosazujeme masivní deregulaci a debyrokratizaci.' },
  { title: 'Menší stát', icon: 'Landmark', text: 'Prosazujeme co nejmenší státní zásahy do života občanů i ekonomiky, snižování daní a státních výdajů.' },
  { title: 'NATO', icon: 'nato', text: 'Prosazujeme setrvání a posílení pozice ČR v NATO, jedině tak zvládneme zachovat svobodnou ČR.' },
  { title: 'Decentralizace', icon: 'Shapes', text: 'Přenášení pravomocí na místní úroveň namísto centralizované byrokratické mašinérie.' },
  { title: 'Dobrovolnost', icon: 'Handshake', text: 'Odmítáme nucené státní zásahy a prosazujeme řešení na principu svobodných dohod a spolupráce.' },
  { title: 'Svobodná Evropa', icon: 'europe', text: 'Evropa se musí vrátit ze stavu továrny na regulace zpět k podpoře volného trhu, podnikání a inovací.' },
];
