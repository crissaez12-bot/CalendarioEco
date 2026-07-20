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
  capturedAt: '2026-07-20',
  impactFilter: 'Alto',
  countries: ['Estados Unidos', 'China', 'Eurozona / Alemania', 'Reino Unido', 'Japón'],
}

export const CALENDAR_WEEK: MacroDay[] = [
  {
    date: '2026-07-21',
    label: 'Martes, 21 de julio de 2026',
    events: [
      {
        time: '06:00',
        countryCode: 'GBR',
        countryFlag: '🇬🇧',
        countryLabel: 'Reino Unido',
        name: 'Claimant Count Change',
        actual: '-',
        forecast: '28.3K',
        previous: '31.2K',
      },
    ],
  },
  {
    date: '2026-07-22',
    label: 'Miércoles, 22 de julio de 2026',
    events: [
      {
        time: '06:00',
        countryCode: 'GBR',
        countryFlag: '🇬🇧',
        countryLabel: 'Reino Unido',
        name: 'CPI y/y',
        actual: '-',
        forecast: '2.7%',
        previous: '2.8%',
      },
    ],
  },
  {
    date: '2026-07-23',
    label: 'Jueves, 23 de julio de 2026',
    events: [
      {
        time: '12:15',
        countryCode: 'EUR',
        countryFlag: '🇪🇺',
        countryLabel: 'Eurozona / Alemania',
        name: 'Main Refinancing Rate',
        actual: '-',
        forecast: '2.40%',
        previous: '2.40%',
      },
      {
        time: '12:15',
        countryCode: 'EUR',
        countryFlag: '🇪🇺',
        countryLabel: 'Eurozona / Alemania',
        name: 'Monetary Policy Statement',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '12:45',
        countryCode: 'EUR',
        countryFlag: '🇪🇺',
        countryLabel: 'Eurozona / Alemania',
        name: 'ECB Press Conference',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
    ],
  },
]
