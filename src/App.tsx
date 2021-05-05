import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Fusion from './components/Fusion';
import Themes from './components/Themes';
import Docs from './components/Docs';
import Alerts from './components/Alerts';
import logo from './logo.svg';

import './App.css';
import getAllStorageSyncData from './utils/getAllStorageSyncData';
import AllData from './components/AllData';

const getKeysByObject = (inputObject: any, targetKeys: Array<String>) => {
  if (inputObject === null) {
    return {}
  }

  return Object.keys(inputObject).reduce((output: any, key: string) => {
    if (targetKeys.includes(key)) {
      output[key] = inputObject[key]
    }
    return output;
  }, {})
}

const renderSection = (activeTab: string, allKeyValueData: any, status: string ) => {
  switch (activeTab) {
    case 'themes':
      return <Themes data={getKeysByObject(allKeyValueData, ['blockDistTag'])} status={status} />
    case 'docs':
      return <Docs />
    case 'alerts':
      return <Alerts />
    case 'all':
      return <AllData data={allKeyValueData} status={status} />
    case 'fusion':
    default:
      return <Fusion data={getKeysByObject(allKeyValueData, ['outputType', 'deployment'])} status={status} />;
  }
}

const App = () => {
  const [activeTab, setActiveTab] = useState('fusion')
  const [allData, setAllData] = useState({
    status: 'idle',
    data: null,
    error: null
  });

  const { status, data: allKeyValueData } = allData;

  useEffect(() => {
    setAllData(prevState => ({ ...prevState, status: 'pending',  }));
    getAllStorageSyncData().then((syncData: any) => {
      console.log(syncData, 'sync data')
      setAllData({ status: 'resolved', data: syncData, error: null })
    }, error => {
      setAllData(prevState => ({ status: 'rejected', error, data: prevState.data  }))
    })
    // setAllData does not need to be watched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Nav variant="pills" defaultActiveKey="fusion">
          <Nav.Item>
            <Nav.Link eventKey="fusion" onClick={() => setActiveTab('fusion')}
            >Fusion</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="themes" onClick={() => setActiveTab('themes')}>Themes</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="docs" onClick={() => setActiveTab('docs')}>Docs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="alerts" onClick={() => setActiveTab('alerts')}>
              Alerts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="all" onClick={() => setActiveTab('all')}>
              All
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div>
          {renderSection(activeTab, allKeyValueData, status)}
        </div>
      </header>
    </div>
  );
};

export default App

