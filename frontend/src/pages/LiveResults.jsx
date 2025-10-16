// src/pages/LiveResults.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentElection } from '../api/electionService';
import ResultChart from '../components/ResultChart';
import toast from 'react-hot-toast';

const LiveResults = () => {
  const [liveElection, setLiveElection] = useState(null); // Holds the raw data from API
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: State specifically for the chart's data to control animation
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

  // This effect runs ONLY when the liveElection data from the API changes
  useEffect(() => {
    if (liveElection) {
      // Step 1: Set chart data to a "zero" state. This makes the segments shrink.
      const zeroedData = liveElection.parties.map(p => ({
        ...p,
        voteCount: 0 
      }));
      setChartData(zeroedData);

      // Step 2: After a tiny delay, set the real data to trigger the "grow" animation.
      const timer = setTimeout(() => {
        setChartData(liveElection.parties.map(p => ({
            name: p.candidate.name,
            party: p.candidate.party,
            voteCount: p.voteCount
        })));
      }, 50); // 50ms is enough for React to see the state change

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [liveElection]); // Dependency: the raw data from the API

  // This effect handles fetching data from the API every 3 seconds
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data } = await getCurrentElection();
        if (data) {
          // Just update the main data state. The other useEffect will handle animating the chart.
          setLiveElection(data);
        } else {
          toast.success('The live election has concluded.');
          navigate('/results');
        }
      } catch (error) {
        console.error('Failed to fetch live updates:', error);
      }
    };
    
    const fetchInitialData = async () => {
      try {
        const { data } = await getCurrentElection();
        if (data) {
          setLiveElection(data);
        } else {
          toast.error('There is no current election running.');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to fetch live election data.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    const intervalId = setInterval(fetchUpdates, 4000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-slate-400 p-8">Searching for live elections...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">{liveElection.title}</h1>
        <p className="text-red-600 mt-3 text-3xl font-bold animate-pulse">Live Result</p>
      </div>
      
      {liveElection && (
        <ResultChart 
          // ❌ REMOVED the key prop
          // ✅ Pass the animated chartData state to the component
          data={chartData} 
        />
      )}
    </div>
  );
};




export default LiveResults;