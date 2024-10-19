export const calculateStatistics = (points) => {
    if (points.length === 0) {
      return {
        events: 0,
        totalFatalities: 0,
        avgFatalities: '0',
        maxFatalities: 0,
        dateRange: { startDate: 'N/A', endDate: 'N/A' },
      };
    }
  
    
    const totalEvents = points.length;
  
   
    const totalFatalities = points.reduce((sum, point) => sum + point.fatalities, 0);
  
   
    const avgFatalities = totalFatalities / totalEvents;
  
    
    const maxFatalities = Math.max(...points.map((point) => point.fatalities));
  
    
    const dates = points.map((point) => point.event_date.getTime());
  
    
    const minDate = new Date(Math.min(...dates));

    
    const maxDate = new Date(Math.max(...dates));
  
    
    return {
      events: totalEvents,                   
      totalFatalities,                        
      avgFatalities: avgFatalities.toFixed(2), 
      maxFatalities,                          
      dateRange: {
        startDate: minDate.toLocaleDateString(), 
        endDate: maxDate.toLocaleDateString(),   
      },
    };
  };
  