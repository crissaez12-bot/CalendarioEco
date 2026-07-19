// Archivo generado automaticamente por scripts/update-calendar.mjs
// No editar a mano — se sobreescribe en cada corrida del cron job semanal.
// Fuente: ForexFactory (feed publico no oficial) · Chile no incluido, ningun
// feed de forex trackea CLP — se sigue cargando manual aparte si hace falta.

export interface MacroEvent {
  time: string
  countryCode: string
  countryFlag: string
  countryLabel: string
  name: string
  actual: string
  forecast: string
  previous: string
}

export interface MacroDay {
  date: string
  label: string
  events: MacroEvent[]
}

export const CALENDAR_SOURCE = {
  provider: 'ForexFactory',
  weekLabel: 'Semana actual',
  capturedAt: '2026-07-19',
  impactFilter: 'Alto',
  countries: ['Estados Unidos', 'China', 'Eurozona / Alemania', 'Reino Unido', 'Japón'],
}

export const CALENDAR_WEEK: MacroDay[] = [
  {
    date: '2026-07-14',
    label: 'Martes, 14 de julio de 2026',
    events: [
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Core CPI m/m',
        actual: '-',
        forecast: '0.2%',
        previous: '0.2%',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Core CPI y/y',
        actual: '-',
        forecast: '2.8%',
        previous: '2.9%',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'CPI m/m',
        actual: '-',
        forecast: '-0.1%',
        previous: '0.5%',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'CPI y/y',
        actual: '-',
        forecast: '3.8%',
        previous: '4.2%',
      },
      {
        time: '14:00',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Fed Chairman Warsh Testifies',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '20:00',
        countryCode: 'GBR',
        countryFlag: '🇬🇧',
        countryLabel: 'Reino Unido',
        name: 'BOE Gov Bailey Speaks',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
    ],
  },
  {
    date: '2026-07-15',
    label: 'Miércoles, 15 de julio de 2026',
    events: [
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Core PPI m/m',
        actual: '-',
        forecast: '0.3%',
        previous: '0.4%',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'PPI m/m',
        actual: '-',
        forecast: '0.0%',
        previous: '1.1%',
      },
      {
        time: '14:00',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Fed Chairman Warsh Testifies',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
    ],
  },
  {
    date: '2026-07-16',
    label: 'Jueves, 16 de julio de 2026',
    events: [
      {
        time: '06:00',
        countryCode: 'GBR',
        countryFlag: '🇬🇧',
        countryLabel: 'Reino Unido',
        name: 'GDP m/m',
        actual: '-',
        forecast: '0.0%',
        previous: '-0.1%',
      },
    ],
  },
]
