import React from "react";

class Checkbox extends React.Component {
  // selectbox & 都道府県名の表示
  renderItem(data) {
    return (
      <div className="pref-check" key={data.prefCode}>
        <input
          type="checkbox"
          checked={this.props.selected[data.prefCode - 1]} //prefCode は 1~47, selected は [0]~[46]
          onChange={() => this.props.changeSelected(data.prefCode - 1)}
        />
        {data.prefName}
      </div>
    );
  }

  // 47都道府県のselectbox & 都道府県名の表示
  render() {
    const obj = this.props.prefectures;
    return (
      <section>
        <h2 className="pref-title">都道府県</h2>
        <div className="prefectures">
          {Object.keys(obj).map((i) => this.renderItem(obj[i]))}
        </div>
      </section>
    );
  }
}

export default Checkbox;
