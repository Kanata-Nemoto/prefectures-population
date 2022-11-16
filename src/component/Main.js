import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

  // RESASapiを用いて都道府県データを取得する
  componentDidMount() {
    fetch(
      // https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html より
      "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      { headers: { "X-API-KEY": process.env.REACT_APP_POSIPAN_API_KEY } } // .env からAPI_KEYを呼び出して使用
    )
      .then((response) => response.json())
      .then((res) => {
        this.setState({ prefectures: res.result }); // state.prefectures にデータをセット
      });
  }

  // checkboxの値の変化を認識
  changeSelected(index) {
    const selected_copy = this.state.selected.slice(); // selectedのコピーを作成
    selected_copy[index] = !selected_copy[index]; // selected_copy の値を反転

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
          let tmp = []; // 総人口データを入れておく配列
          Object.keys(res.result.data[0].data).forEach((i) => {
            tmp.push(res.result.data[0].data[i].value); // 総人口データを年毎に受け取りtmpにpush
          });
          const res_population = {
            name: this.state.prefectures[index].prefName, // 都道府県名
            data: tmp,
          };
          this.setState({
            selected: selected_copy, // 反転したデータをselectedにセット
            population: [...this.state.population, res_population], // 受け取った総人口データをpopulationにセット
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

  // checkboxと都道府県名の表示
  renderItem(props) {
    return (
      <div className="pref-check" key={props.prefCode}>
        <input
          type="checkbox"
          checked={this.state.selected[props.prefCode - 1]} //prefCode は 1~47, selected は [0]~[46]
          onChange={() => this.changeSelected(props.prefCode - 1)}
        />
        {props.prefName}
      </div>
    );
  }

  // highcharts を用いてグラフの表示
  render() {
    const obj = this.state.prefectures;
    const options = {
      // グラフオプションの設定
      title: {
        text: "都道府県別 人口推移", // グラフタイトル
      },
      yAxis: {
        title: {
          text: "総人口", // Y軸ラベル
        },
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointInterval: 5, // 5年区切りで表示
          pointStart: 1960, // 1960年～
        },
      },
      series: this.state.population, // グラフする総人口データ
    };
    return (
      <div>
        <h2 className="pref-title">都道府県</h2>
        <div className="prefectures">
          {Object.keys(obj).map((i) => this.renderItem(obj[i]))}
        </div>
        <div className="highcharts">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    );
  }
}

export default Main;
