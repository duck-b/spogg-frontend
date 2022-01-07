import React, { useState } from 'react';
import { Layout } from 'components/layout/user';
import axios from 'axios';

const GoodsPresenter = () => {
  const [goods, setGoods] = useState([]);
  const [search, setSearch] = useState('');
  const handleClickGoods = async() => {
    // const data = {
    //   "startDate": "2017-08-01",
    //   "endDate": "2017-09-30",
    //   "timeUnit": "month",
    //   "category": [
    //       {"name": "패션의류", "param": ["50000000"]},
    //       {"name": "화장품/미용", "param": ["50000002"]}
    //   ],
    //   "device": "pc",
    //   "ages": ["20", "30"],
    //   "gender": "f"
    // }
    // const config = {
    //     headers: {
    //         "X-Naver-Client-Id": 'YxD7HKQsx5SslP1h4zau',
    //         "X-Naver-Client-Secret": 'wucpAPCoLg',
    //         "Content-Type": "application/json"
    //     }
    // };
    await axios.get(`/api/test/naverapi/${search}`).then((response)=>{
      console.log(response)
      setGoods(response.data.items)
    });
  }
  return (
    <Layout page="goods">
      <div>
        <input type='text' style={{marginLeft: '10px'}} value={search} onChange={(e)=>setSearch(e.target.value)}/><button style={{marginLeft: '10px'}} onClick={handleClickGoods}>검색</button>
      </div>
      {goods.map((good, i) => (
        <div style={{width: '100%'}} key={i}>
          <div style={{ padding: '10px'}}>
              <div style={{boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)', borderRadius: '10px'}}>
                <img src={good.image} style={{width: '100%', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}/>
                <div style={{padding: '10px'}}>
                  <p>상품 ID : {good.productId}</p>
                  <p>상품 명 : {good.title.split('<b>').join('').split('</b>').join('')}</p>
                  <p>상품군 : {good.productType}</p>
                  <p>카테고리 : {good.category1} &gt; {good.category2} &gt; {good.category3} &gt; {good.category4}</p>
                  <p>최저가 : {good.lprice}</p>
                  <p>최고가 : {good.hprice}</p>
                  <p>브랜드 명 : {good.brand}</p>
                  <p>제조사 명 : {good.maker}</p>
                  <p>Link : <a href={good.link} target="_blank">바로가기</a></p>
                </div>
              </div>
          </div>
        </div>
      ))}
    </Layout>
  ); 
};

export default GoodsPresenter;
