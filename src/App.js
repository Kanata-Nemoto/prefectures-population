import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {}, 
      population: [],
    };
    this.changeSelected = this.changeSelected.bind(this);
  }

  componentDidMount() {
    fetch(
      'https://opendata.resas-portal.go.jp/api/v1/prefectures',
      { headers: { 'X-API-KEY': process.env.REACT_APP_POSIPAN_API_KEY }}
    )
      .then(response => response.json())
      .then(res => {
        this.setState({ prefectures: res.result });
      });
  }

  changeSelected(index) {
    const selected_copy = this.state.selected.slice();
    selected_copy[index] = !selected_copy[index];

    if (!this.state.selected[index]) {
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${index + 1}`,
        { headers: { 'X-API-KEY': process.env.REACT_APP_POSIPAN_API_KEY }}
      )
        .then(response => response.json())
        .then(res => {
          let tmp = []; //人口データを入れる配列
          Object.keys(res.result.data[0].data).forEach(i => {
            tmp.push(res.result.data[0].data[i].value); //総人口データの取得
          });
          const res_population = {
            name: this.state.prefectures[index].prefName,
            data: tmp
          };
          this.setState({
            selected: selected_copy,
            population: [...this.state.population, res_population]
          });
        });
    } else {
      const population_copy = this.state.population.slice();
      for (let i = 0; i < population_copy.length; i++) {
        if (population_copy[i].name === this.state.prefectures[index].prefName) {
          population_copy.splice(i, 1);
        }
      }
      this.setState({
        selected: selected_copy,
        population: population_copy
      });
    }
  }

  renderItem(props) {
    return(
      <div
        className='pref-check'
        key={props.prefCode}
      >
        <input 
          type='checkbox'
          checked={this.state.selected[props.prefCode - 1]}
          onChange={() => this.changeSelected(props.prefCode - 1)}
        />
        { props.prefName }
      </div>
    );
  }

  render() {
    const obj = this.state.prefectures;
    const options = {
      title: {
        text: '都道府県別 人口推移'
      },
      yAxis: {
        title: {
          text: '総人口'
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointInterval: 5,
          pointStart: 1960
        }
      },
      series: this.state.population
    };

    return (
      <div>
        <h1 className='header'>ゆめみ フロントエンドコーディング試験</h1>
        <h2 className='pref-title'>都道府県</h2>
        <div className='prefectures'>{Object.keys(obj).map(i => this.renderItem(obj[i]))}</div>
        <div className='highcharts'><HighchartsReact highcharts={Highcharts} options={options} /></div>
      </div>
    );
  }
}

export default App;