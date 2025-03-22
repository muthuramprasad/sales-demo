import React from 'react'
import { Card, Col, Row , Timeline } from 'antd';
import { RiseOutlined} from "@ant-design/icons"
import BarChart from '../BarChart/BarChart';
import PendingTable from '../Barchart/PendingTable';
import Notes  from '../Barchart/Notes';
import Account from '../Barchart/Account';

const Home = () => {
  return (
    <div>
    <Row gutter={16}>
    <Col span={6}>
      <Card title="Total Lead" variant="borderless"  className='ant-card'>
<Row>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
  <h1 >45,231.69</h1>
  <p>+20.1% from last month</p>
  </Col>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1 align='end'><RiseOutlined /></h1>
  <p align='end'> Month</p>
  </Col>
</Row>
      </Card>
    </Col>



    <Col span={6}> 
      <Card title="Total Users" variant="borderless" className='ant-card'>
      <Row>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1>45,231.69</h1>
  <p>+20.1% from last month</p>
  </Col>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1 align='end'><RiseOutlined /></h1>
  <p align='end'> Month</p>
  </Col>
</Row>
      </Card>
    </Col>



    <Col span={6}> 
      <Card title="Total Qoutation" variant="borderless" className='ant-card'>
      <Row>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1>45,231.69</h1>
  <p>+20.1% from last month</p>
  </Col>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1 align='end'><RiseOutlined /></h1>
  <p align='end'> Month</p>
  </Col>
</Row>
      </Card>
    </Col>
    <Col span={6}> 
      <Card title="Total Invoice" variant="borderless" className='ant-card'>
      <Row>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1>45,231.69</h1>
  <p>+20.1% from last month</p>
  </Col>
  <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
  <h1 align='end'><RiseOutlined /></h1>
  <p align='end'> Month</p>
  </Col>
</Row>
      </Card>
    </Col>


  
  </Row>

  <Row>
    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
    <BarChart />
    
    </Col>

    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
 
  
      <Card title="Pending" variant="borderless"  className='ant-card'>
<Row>
  <Col xs={24} sm={12} md={24} lg={24} xl={24} xxl={24} >

<PendingTable/>
  </Col>
  
</Row>
      </Card>
  
    </Col>
  </Row>


  <Row>
  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
 
  
 <Card title="Notes Follow Up" variant="borderless"  >
<Row>
<Col xs={24} sm={12} md={24} lg={24} xl={24} xxl={24} >
<div>
<Notes/>
</div>

</Col>

</Row>
 </Card>

</Col>



    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
 
  
      <Card title="Account Follow Up" variant="borderless"  >
<Row>
  <Col xs={24} sm={12} md={24} lg={24} xl={24} xxl={24} >

<Account/>
  </Col>
  
</Row>
      </Card>
  
    </Col>
  </Row>



  
    </div>
  )
}

export default Home
