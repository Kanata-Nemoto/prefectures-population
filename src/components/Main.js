import React from 'react';
import Check from './Check';

class Main extends React.Component {
  render() {
    const prefecturesList = [
      {
        name: 'A',
        population: [{year: 2000, number: 30000}, {year: 2010, number: 40000}],
      },
      {
        name: 'B',
        population: [{year: 2000, number: 30000}, {year: 2010, number: 40000}],
      },
    ];

    return (
      <div className='main-wrapper'>
        <div className='main'>
          <div className='checkbox-wrapper'>
            {prefecturesList.map((prefectureItem) => {
              return (
                <Check
                  name={prefectureItem.name}
                  population={prefectureItem.population}
                />
              );
            })}
          </div>
          <div className='graph-wrapper'>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
