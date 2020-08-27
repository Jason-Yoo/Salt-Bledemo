var visitTrend= new Array();
visitTrend = [
  {
    "ref_date": "20200701",   //日期
    "visit_uv": 5,        //访问人数
  },
  {
    "ref_date": "20200702",
    "visit_uv": 6,
  },
  {
    "ref_date": "20200703",
    "visit_uv": 5,
  },
  {
    "ref_date": "20200704",
    "visit_uv": 7,
  },
  {
    "ref_date": "20200705",
    "visit_uv": 8,
  },
  {
    "ref_date": "20200706",
    "visit_uv": 5,
  },
  {
    "ref_date": "20200707",
    "visit_uv": 6,
  },
  {
    "ref_date": "20200708",
    "visit_uv": 7,
  },
];

// for(let t=8;t<10;t++){
// visitTrend.push({"ref_date":"202007"+"0"+t,"visit_uv":8})
// }
// for(let t=10;t<=31;t++){
//   visitTrend.push({"ref_date":"202007"+t,"visit_uv":t%6})
// }
// for(let t=1;t<3;t++){
//   visitTrend.push({"ref_date":"202008"+"0"+t,"visit_uv":10})
// }
module.exports = {
  visitTrend: visitTrend
}
