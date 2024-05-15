'use client';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useTeamFetch } from '@/app/lib/hooks';

type SessionEntry = {
  session_id: string;
  team_id: string;
  session_date: string;
  entry_id: string;
  user_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
};

type teamProp = {
  teamID: string | null;
  sessionTeamData: SessionEntry[];
  loading: boolean;
};

const TeamStatistics = ({ teamID, sessionTeamData, loading }: teamProp) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [chartData, setChartData] = useState<any[][]>([]);
  const [team, teamLoading] = useTeamFetch({ teamID });

  const getAverageScores = (data: SessionEntry[]) => {
    const averages: (string | number | SessionEntry)[][] = [
      ['Session Date', 'Happiness', 'Productivity', 'Stress'],
    ];

    const sessions: Record<
      string,
      { happiness: number[]; productivity: number[]; stress: number[] }
    > = {};

    data.forEach((entry) => {
      const date = new Date(entry.session_date).toLocaleDateString();

      if (!sessions[date]) {
        sessions[date] = { happiness: [], productivity: [], stress: [] };
      }

      sessions[date].happiness.push(entry.happiness);
      sessions[date].productivity.push(entry.productivity);
      sessions[date].stress.push(entry.stress);
    });

    for (const date in sessions) {
      const happinessAverage =
        sessions[date].happiness.reduce((acc, val) => acc + val, 0) /
        sessions[date].happiness.length;
      const productivityAverage =
        sessions[date].productivity.reduce((acc, val) => acc + val, 0) /
        sessions[date].productivity.length;
      const stressAverage =
        sessions[date].stress.reduce((acc, val) => acc + val, 0) /
        sessions[date].stress.length;

      averages.push([
        date,
        happinessAverage,
        productivityAverage,
        stressAverage,
      ]);
    }
    return averages;
  };

  useEffect(() => {
    setChartData(getAverageScores(sessionTeamData));
  }, [sessionTeamData]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [screenWidth]);

  let chartAreaWidth = screenWidth < 401 ? '100%' : '95%';

  // console.log('chartData from TeamStatistics: ', chartData);

  return (
    <>
      <article
        className={`laptop:p-0 flex justify-center laptop:block w-[100%] laptop:w-[90%] mt-[30px] laptop:ml-[42px] ${sessionTeamData.length === 0 ? '' : 'laptop:rounded-md laptop:shadow-md laptop:hover:shadow-lg laptop:focus:shadow-md focus:outline-none'}`}
      >
        <div
          className={`laptop:w-full ${screenWidth < 401 ? 'w-[100%]' : 'w-[90%]'} ${sessionTeamData.length === 0 ? '' : 'rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none'}`}
        >
          {loading ? (
            <p>Loading...</p>
          ) : sessionTeamData.length === 0 ? (
            <>
              <p>No data available</p>
              <p>Create a new session to get started</p>
            </>
          ) : (
            <Chart
              width={'100%'}
              height={'450px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={chartData}
              options={{
                title: `Average Team Member Statistics Over Time for team ${team && team.team_name}`,
                hAxis: { title: 'Session Date' },
                series: {
                  0: { curveType: 'function', lineWidth: 3 },
                  1: { curveType: 'function', lineWidth: 3 },
                  2: { curveType: 'function', lineWidth: 3 },
                },
                legend: 'top',
                chartArea: {
                  left: screenWidth < 401 ? 20 : 35,
                  top: 40,
                  width: chartAreaWidth,
                  height: '80%',
                },
                tooltip: { isHtml: true },
                selectionMode: 'multiple',
              }}
              rootProps={{ 'data-testid': '1' }}
            />
          )}
        </div>
      </article>
    </>
  );
};

export default TeamStatistics;
