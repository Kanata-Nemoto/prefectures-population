import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class Graph extends React.Component {
  // highcharts を用いてグラフの表示
  render() {
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
      series: this.props.population, // グラフにする総人口データ
    };
    return (
      <section>
        <div className="highcharts">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </section>
    );
  }
}

export default Graph;
