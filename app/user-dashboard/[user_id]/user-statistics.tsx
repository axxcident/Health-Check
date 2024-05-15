'use client';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useTeamFetch } from '@/app/lib/hooks';
import { useFetchUser } from '@/app/lib/hooks';

type UserSession = {
  session_id: string;
  team_id: string;
  session_date: string;
  entry_id: string;
  happiness: number | null;
  productivity: number | null;
  stress: number | null;
  comment: string;
};

type userProp = {
  userID: string | null;
  teamID: string | null;
  userSessions: UserSession[];
};

const UserStatistics = ({ userID, teamID, userSessions }: userProp) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [team, teamLoading] = useTeamFetch({ teamID });
  const [user, userLoading] = useFetchUser({ userId: userID });

  const [chartData, setChartData] = useState<any[][]>([]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [screenWidth]);

  const chartAreaWidth = window.innerWidth < 401 ? '100%' : '95%';

  useEffect(() => {
    const dataTitles = ['Session Date'];
    if (userSessions.some((session) => session.happiness !== null)) {
      dataTitles.push('Happiness');
    }
    if (userSessions.some((session) => session.productivity !== null)) {
      dataTitles.push('Productivity');
    }
    if (userSessions.some((session) => session.stress !== null)) {
      dataTitles.push('Stress');
    }

    const data = userSessions.map((session) => {
      const rowData: (string | number)[] = [
        new Date(session.session_date).toLocaleDateString(),
      ];

      if (session.happiness !== null) {
        rowData.push(session.happiness);
      }
      if (session.productivity !== null) {
        rowData.push(session.productivity);
      }
      if (session.stress !== null) {
        rowData.push(session.stress);
      }

      return rowData;
    });

    setChartData([dataTitles, ...data]);
  }, [userSessions]);

  const getAxisTicks = (userSessions: UserSession[]) => {
    const dates = userSessions.map((session) =>
      new Date(session.session_date).getTime(),
    );
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    return [minDate, maxDate];
  };
  // console.log('userSessions from UserStatistics: ', userSessions);
  // console.log('chartData from UserStatistics: ', chartData);

  return (
    <>
      <article
        className={`laptop:p-0 flex justify-center laptop:block w-[100%] laptop:w-[90%] laptop:mt-0 mt-[30px] laptop:ml-[42px] ${userSessions.length === 0 ? '' : 'laptop:rounded-md laptop:shadow-md laptop:hover:shadow-lg laptop:focus:shadow-md focus:outline-none'}`}
      >
        <div
          className={`laptop:w-full ${screenWidth < 401 ? 'w-[100%]' : 'w-[90%]'} ${userSessions.length === 0 ? '' : 'rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none'}`}
        >
          {loading ? (
            <p>Loading...</p>
          ) : userSessions.length === 0 ||
            (userSessions[0].happiness == undefined &&
              userSessions[0].productivity == undefined &&
              userSessions[0].stress == undefined) ? (
            <p>No data available to chart</p>
          ) : (
            <Chart
              width={'100%'}
              height={'450px'}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={chartData}
              options={{
                title: `${user && user?.first_name} ${user && user?.lastname} Session Statistics In Team ${team && team.team_name} Over Time`,
                hAxis: {
                  title: 'Session Date',
                  format: 'MMM d, yyyy',
                  viewWindowMode: 'pretty',
                  ticks: getAxisTicks(userSessions),
                },
                series: {
                  0: { curveType: 'function', lineWidth: 3 },
                  1: { curveType: 'function', lineWidth: 3 },
                  2: { curveType: 'function', lineWidth: 3 },
                },
                legend: 'top',
                chartArea: {
                  left: screenWidth < 401 ? 20 : 30,
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

export default UserStatistics;
