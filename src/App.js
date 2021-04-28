import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const  back_api = window.location.hostname === 'localhost' ? 'https://pmb.sixhands.co' :window.location.protocol + '//' + window.location.hostname;
// export let back_api = 'https://localranktracker.com'
  const mapkit_jwt = '/api/map_jwt/';
  const [data, setData] = useState({
    business: '',
    latitude: 0,
    longitude: 0,
    language: '',
    keyword: ''
  });
  const [token, setToken] = useState('');

  const [results, setResults] = useState([]);

  let headers = new Headers();
  let mapkit_search;
  let map_search;
  let mapkit_region;
  let mapkit_span;
  let mapkit_coordinate;

  const setValue = (type, value) => {
    setData({...data, [type]: value})
  }

  const submit = () => {
    searchPin(data)
  }

  const searchPin = (detail) => {
    let name = detail.business.split(' ')[0]
    mapkit_coordinate = new window.mapkit.Coordinate(detail.latitude, detail.longitude);
    mapkit_span= new window.mapkit.CoordinateSpan(1, 1);
    mapkit_region = new window.mapkit.CoordinateRegion(mapkit_coordinate, mapkit_span);
    let options = {
      language: detail.language,
      coordinate: new window.mapkit.Coordinate(detail.latitude, detail.longitude),
      region: mapkit_region,
      getsUserLocation: false
    }
    mapkit_search = new window.mapkit.Search(options);
    console.log(mapkit_search,detail)
    let index = 30;
    mapkit_search.autocomplete(detail.keyword, function(error, data) {
      if (error) {
        console.log(error);
      }else{
        console.log(data)
        if (data.results.length !== 0) {
          data.results = data.results.filter(el => el.coordinate);
          index=30;
          let position = data.results.filter(elemnt => {
            return elemnt.displayLines[0].includes(name);
          })[0];
          index = data.results.indexOf(position) + 1;
        }
        // if (data.places.length !== 0) {
        //     data.places = data.places.filter(el => el.coordinate);
        //     index=30;
        //     let position = data.places.filter(elemnt => {
        //         return detail.muid === elemnt.coordinate.latitude + ' ' + elemnt.coordinate.longitude && elemnt.displayLines[0].includes(name);
        //     })[0];
        //     index = data.places.indexOf(position) + 1;
        // }
        detail.value = index;
        detail.data = data.results;
        setResults(data.results)
      }
    }, {...options,
      includeQueries: true,
      includeAddresses: true,
      // limitToCountries: "EN"
    });
  }

  const initMapkit = (token) => {
    window.mapkit.init({
      authorizationCallback: function (done) {
        done(token);
      },
      language: "es"
    });
    map_search = new window.mapkit.Map('map',
        {center: new window.mapkit.Coordinate(25.875291202976097,  -80.141396849738)})
    mapkit_coordinate = new window.mapkit.Coordinate(25.875291202976097,  -80.141396849738);
    mapkit_span= new window.mapkit.CoordinateSpan(90/20, 180/20);
    mapkit_region = new window.mapkit.CoordinateRegion(mapkit_coordinate, mapkit_span)
  }

  useEffect(() => {
    let timer = setInterval(() => {
      if (token && token !== ''){
        initMapkit(token)
        clearInterval(timer)
      }
    },500)
  }, [token])

  return (
    <div className="App">
      <input placeholder={'longitude'} id={'longitude'} type={'number'} onChange={e => setValue('longitude', e.target.value)} value={data.longitude}/>
      <input placeholder={'latitude'} id={'latitude'} type={'number'} onChange={e => setValue('latitude', e.target.value)} value={data.latitude}/>
      <input placeholder={'language'} id={'language'} type={'text'} onChange={e => setValue('language', e.target.value)} value={data.language}/>
      <input placeholder={'business'} id={'business'} type={'text'} onChange={e => setValue('business', e.target.value)} value={data.business}/>
      <input placeholder={'keyword'} id={'keyword'} type={'text'} onChange={e => setValue('keyword', e.target.value)} value={data.keyword}/>
      <button id={'search'} onClick={() => submit()}>search</button>
      <input id={'token'} onChange={e => setToken(e.target.value)} value={token} type={'text'}/>
      <p>{JSON.stringify(results)}</p>
      <input id={'result'} value={JSON.stringify(results)}/>
      <div id={'map'} style={{display: 'none'}}/>
    </div>
  );
}

export default App;
