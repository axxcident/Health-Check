'use client';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

type SessionCheckinResultsProps = {
  session_id: string;
};

type SessionEntries = {
  entry_id: string;
  session_id: string;
  user_id: string;
  team_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
};

const BarStatitics = ({ session_id }: SessionCheckinResultsProps) => {
  const [sessionData, setSessionData] = useState<SessionEntries[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [prevNumEntries, setPrevNumEntries] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [screenWidth]);

  const chartAreaWidth = window.innerWidth < 401 ? '92%' : '83%';
  const chartmobileWidth = screenWidth < 431 ? 'horizontal' : 'vertical';

  useEffect(() => {
    const getSessionData = async () => {
      // setLoading(true);
      try {
        if (session_id) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/session-entries?Session_id=${session_id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          if (response.ok) {
            const sessionDatan = await response.json();
            const newSessionEntries = sessionDatan.session_entries;
            setPrevNumEntries(newSessionEntries.length);
            if (newSessionEntries.length > prevNumEntries) {
              setSessionData(newSessionEntries);
            }
            // setLoading(false);
          } else {
            console.error(
              'Error fetching session entry data:',
              response.status,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching session entry data:', error);
      }
    };

    const intervalId = setInterval(getSessionData, 12000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 300000);

    // Initial fetch
    getSessionData();

    return () => clearInterval(intervalId);
  }, [session_id]);

  const getAverageScore = (category: keyof SessionEntries) => {
    const totalScore = sessionData.reduce(
      (acc, session) => acc + Number(session[category]),
      0,
    );
    return totalScore / sessionData.length;
  };

  const getAverageScores = () => {
    const happinessAverage = getAverageScore('happiness');
    const productivityAverage = getAverageScore('productivity');
    const stressAverage = getAverageScore('stress');
    return [happinessAverage, productivityAverage, stressAverage];
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : sessionData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="laptop:w-[80%] w-full rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none">
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['Category', 'Average Score'],
              ['Happiness', getAverageScores()[0]],
              ['Productivity', getAverageScores()[1]],
              ['Stress', getAverageScores()[2]],
            ]}
            options={{
              title: 'Average Scores',
              hAxis: { title: 'Categories', minValue: 0, maxValue: 5 },
              legend: 'none',
              orientation: chartmobileWidth,
              // orientation: 'horizontal',
              chartArea: {
                left: screenWidth < 431 ? 32 : 90,
                top: 30,
                width: chartAreaWidth,
                height: '80%',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      )}
    </>
  );
};

export default BarStatitics;
