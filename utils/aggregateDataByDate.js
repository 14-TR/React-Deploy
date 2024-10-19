import { group } from 'd3-array';


export const aggregateDataByDate = (battlesData, explosionsData) => {
  const battlesGroupedByDate = group(battlesData, (d) =>
    d.event_date.toISOString().split('T')[0]  
  );


  const explosionsGroupedByDate = group(explosionsData, (d) =>
    d.event_date.toISOString().split('T')[0]  
  );


  const aggregatedData = Array.from(new Set([...battlesGroupedByDate.keys(), ...explosionsGroupedByDate.keys()]))
    .map((date) => {
      return {
        date,
        battles: (battlesGroupedByDate.get(date) || []).length,
        explosions: (explosionsGroupedByDate.get(date) || []).length,
      };
    });


  return aggregatedData;
};
