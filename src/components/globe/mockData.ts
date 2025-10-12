import { DisasterDatum } from './types';

export function generateMockData(): DisasterDatum[] {
  return [
    {
      regionId: 'USA',
      total: 128,
      byType: {
        wildfire: 60,
        flood: 40,
        earthquake: 10,
        other: 18
      }
    },
    {
      regionId: 'MEX',
      total: 22,
      byType: {
        earthquake: 15,
        other: 7
      }
    },
    {
      regionId: 'JPN',
      total: 73,
      byType: {
        earthquake: 55,
        hurricane: 10,
        other: 8
      }
    },
    {
      regionId: 'CHN',
      total: 45,
      byType: {
        flood: 30,
        earthquake: 10,
        other: 5
      }
    },
    {
      regionId: 'IND',
      total: 67,
      byType: {
        flood: 40,
        hurricane: 15,
        other: 12
      }
    },
    {
      regionId: 'BRA',
      total: 34,
      byType: {
        flood: 20,
        wildfire: 10,
        other: 4
      }
    },
    {
      regionId: 'AUS',
      total: 89,
      byType: {
        wildfire: 55,
        flood: 20,
        other: 14
      }
    },
    {
      regionId: 'DEU',
      total: 12,
      byType: {
        flood: 8,
        other: 4
      }
    },
    {
      regionId: 'GBR',
      total: 18,
      byType: {
        flood: 12,
        other: 6
      }
    },
    {
      regionId: 'FRA',
      total: 15,
      byType: {
        flood: 10,
        other: 5
      }
    },
    {
      regionId: 'ITA',
      total: 25,
      byType: {
        earthquake: 15,
        flood: 7,
        other: 3
      }
    },
    {
      regionId: 'ESP',
      total: 20,
      byType: {
        wildfire: 12,
        flood: 5,
        other: 3
      }
    },
    {
      regionId: 'CAN',
      total: 56,
      byType: {
        wildfire: 35,
        flood: 15,
        other: 6
      }
    },
    {
      regionId: 'RUS',
      total: 41,
      byType: {
        wildfire: 25,
        flood: 10,
        other: 6
      }
    },
    {
      regionId: 'IDN',
      total: 92,
      byType: {
        earthquake: 45,
        flood: 30,
        hurricane: 10,
        other: 7
      }
    },
    {
      regionId: 'PHL',
      total: 78,
      byType: {
        hurricane: 50,
        flood: 20,
        earthquake: 5,
        other: 3
      }
    },
    {
      regionId: 'THA',
      total: 38,
      byType: {
        flood: 25,
        other: 13
      }
    },
    {
      regionId: 'TUR',
      total: 52,
      byType: {
        earthquake: 40,
        other: 12
      }
    },
    {
      regionId: 'ZAF',
      total: 29,
      byType: {
        flood: 18,
        wildfire: 8,
        other: 3
      }
    },
    {
      regionId: 'ARG',
      total: 31,
      byType: {
        flood: 20,
        wildfire: 8,
        other: 3
      }
    }
  ];
}

export function generateRandomData(count: number = 20): DisasterDatum[] {
  const countries = [
    'USA', 'CHN', 'JPN', 'DEU', 'GBR', 'FRA', 'IND', 'BRA', 'CAN', 'AUS',
    'MEX', 'KOR', 'ESP', 'ITA', 'TUR', 'IDN', 'NLD', 'SAU', 'CHE', 'POL',
    'BEL', 'SWE', 'IRL', 'AUT', 'NOR', 'ISR', 'SGP', 'DNK', 'PHL', 'THA'
  ];
  const types = ['earthquake', 'wildfire', 'flood', 'hurricane', 'other'] as const;

  return countries.slice(0, count).map(countryId => {
    const byType: any = {};
    let total = 0;

    // Randomly assign disasters
    types.forEach(type => {
      if (Math.random() > 0.5) {
        const value = Math.floor(Math.random() * 50) + 1;
        byType[type] = value;
        total += value;
      }
    });

    return {
      regionId: countryId,
      total: total || Math.floor(Math.random() * 30) + 1,
      byType: Object.keys(byType).length > 0 ? byType : undefined
    };
  });
}
