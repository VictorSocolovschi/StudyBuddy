import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class GraphComponent extends React.Component {
    constructor(props) {
        super(props);
        this.addSymbols = this.addSymbols.bind(this);
    }

    calculateEventStatistics = (events) => {
        const eventTypes = ['Study', 'Hobby', 'Social']; // Update with your event types
        const statistics = {};
    
        // Initialize statistics object
        eventTypes.forEach(type => {
            statistics[type] = { totalHours: 0, count: 0 }; // Example: Track total hours and count
        });
    
        // Get today's date and the date two weeks from now
        const today = new Date();
        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 14);
    
        // Calculate total duration and count for each event type within the date range
        events.forEach(event => {
            const eventDate = new Date(event.startTime);
    
            if (eventDate >= today && eventDate <= twoWeeksFromNow && eventTypes.includes(event.eventType)) {
                // Assuming duration is a string like '1:00' or '0:30'
                const [hours, minutes] = event.duration.split(':').map(Number);
                const durationInHours = hours + minutes / 60;
                statistics[event.eventType].totalHours += durationInHours;
                statistics[event.eventType].count++;
            }
        });
    
        return eventTypes.map(type => ({
            label: type,
            y: statistics[type].totalHours // Example: Use total hours for the chart data
        }));
    };
    

    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);

        if (order > suffixes.length - 1)
            order = suffixes.length - 1;

        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    render() {
        const { events, loading } = this.props;

        const eventStatistics = this.calculateEventStatistics(events);

        const options = {
            animationEnabled: true,
            theme: "light2", //light2,dark1,dark2
            title: {
                text: "Time management for next 14 days"
            },
            axisY: {
                title: "Hours",
                labelFormatter: this.addSymbols,
                scaleBreaks: {
                    autoCalculate: true
                }
            },
            axisX: {
                title: "Events",
                labelAngle: 0
            },
            data: [{
                type: "column",
                dataPoints: eventStatistics // Use the calculated event statistics here
            }]
        };

        // useEffect(() => {
        //     const fetchWeeklyEfficiency = async () => {
        //         const response = await fetch('http://localhost:5000/get_weekly_efficiency', {
        //             headers: {
        //                 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        //             }
        //         });
        //         const data = await response.json();
        //         setEfficiencyData(data);
        //     };
        
        //     fetchWeeklyEfficiency();
        // }, []);

        
        return (
            <div id="statistic">
                {loading ? (
                    <p>Loading event statistics...</p>
                ) : (
                    <CanvasJSChart options={options} />
                )}
            </div>
        );
    }
}

export default GraphComponent;
