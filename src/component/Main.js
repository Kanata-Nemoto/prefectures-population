import React from "react";
import Checkbox from "./Checkbox";
import Graph from "./Graph";

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false), // checkboxの状態
      prefectures: {}, // 都道府県データ
      population: [], // 人口データ
    };
    this.changeSelected = this.changeSelected.bind(this);
  }

  // RESASapiを用いて都道府県データを取得し、stateにセット
  componentDidMount() {
    fetch(
      // https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html より
      "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      { headers: { "X-API-KEY": process.env.REACT_APP_POSIPAN_API_KEY } } // .env からAPI_KEYを呼び出して使用
    )
      .then((response) => response.json())
      .then((res) => {
        this.setState({ prefectures: res.result });
      });
  }

  // checkboxの値の変化を認識
  changeSelected(index) {
    const selected_copy = this.state.selected.slice();
    selected_copy[index] = !selected_copy[index];

    // checkboxにチェックが付いた時の処理
    if (!this.state.selected[index]) {
      fetch(
        // RESASapiを用いて総人口データの取得
        // https://opendata.resas-portal.go.jp/docs/api/v1/population/composition/perYear.html より
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${
          index + 1
        }`,
        { headers: { "X-API-KEY": process.env.REACT_APP_POSIPAN_API_KEY } }
      )
        .then((response) => response.json())
        .then((res) => {
          let tmp = [];
          Object.keys(res.result.data[0].data).forEach((i) => {
            tmp.push(res.result.data[0].data[i].value); // 総人口データを年毎に受け取りtmpにpush
          });
          const res_population = {
            name: this.state.prefectures[index].prefName, // 都道府県名
            data: tmp,
          };
          this.setState({
            selected: selected_copy,
            population: [...this.state.population, res_population],
          });
        });
    } else {
      // checkboxのチェックが外された時の処理
      const population_copy = this.state.population.slice();
      for (let i = 0; i < population_copy.length; i++) {
        if (
          population_copy[i].name === this.state.prefectures[index].prefName
        ) {
          population_copy.splice(i, 1); // 該当する総人口データの削除
        }
      }
      this.setState({
        selected: selected_copy,
        population: population_copy,
      });
    }
  }

  render() {
    return (
      <main>
        <Checkbox
          selected={this.state.selected}
          prefectures={this.state.prefectures}
          population={this.state.population}
          changeSelected={this.changeSelected}
        />
        <Graph population={this.state.population} />
      </main>
    );
  }
}

export default Main;
