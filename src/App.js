import React, { useState } from 'react';
import { DatePicker, Button, Space, Table } from 'antd';
import dayjs from 'dayjs';
// import moment from 'moment';
// import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const columns = [
  {
    title: 'Fecha Hora',
    dataIndex: 'fecha_hora',
    key: 'fecha_hora',
  },
  {
    title: 'Banda',
    dataIndex: 'banda',
    key: 'banda',
  },
  {
    title: 'Costo',
    dataIndex: 'costo',
    key: 'costo',
  },
  {
    title: 'POE',
    dataIndex: 'POE',
    key: 'POE',
  },{
    title: 'Generacion',
    dataIndex: 'generacion',
    key: 'generacion',
  },
  {
    title: 'indicador',
    dataIndex: 'indicador',
    key: 'indicador',
  },
  {
    title: 'liquidacion_POE',
    dataIndex: 'liquidacion_POE',
    key: 'liquidacion_POE',
  },{
    title: 'liquidacion_CVG',
    dataIndex: 'liquidacion_CVG',
    key: 'liquidacion_CVG',
  },{
    title: 'agente_a',
    dataIndex: 'agente_a',
    key: 'agente_a',
  },{
    title: 'agente_b',
    dataIndex: 'agente_b',
    key: 'agente_b',
  },
];

const App = () => {

  const [dates, setDates] = useState(null);
  const [value, setValue] = useState(null);
  const [disabledButton, setDisabledButton] = useState(true)
  const [requestRange, setRequestRage] = useState([])
  const [responseData, setResponseData] = useState([])

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/search?startDate=${requestRange[0]}&endDate=${requestRange[1]}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json()
      setResponseData(data)
    } catch (err) {
      console.log(err)
    }
  }

  const disabledDate = (current) => {
    const startDate = dayjs('2022-12-31');
    const endDate = dayjs('2023-07-01');
    return current < startDate || current > endDate;
  }


  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const handleDates = (val) => {
    setDates(val)
    if (val && val[0] !=null && val[1]!= null) {
      setDisabledButton(false)
      setRequestRage([val[0].format('YYYY-MM-DD'),val[1].add(1,'day').format('YYYY-MM-DD')])
    } else {
      setDisabledButton(true)
    }
  }


  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(responseData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `data-${requestRange[0]}-${requestRange[1]}.json`;

    link.click();
  };

  return (
    <>
      <p>selecciar rango de fechas, solo se puede dese 1-ENE a 30 Jun</p>
      <Space>
        <RangePicker
          value={dates || value}
          disabledDate={disabledDate}
          onCalendarChange={(val) => {
            handleDates(val);
          }}
          onChange={(val) => {
            setValue(val);
          }}
          onOpenChange={onOpenChange}
          placeholder={['fecha inicio', 'fecha fin']}
          changeOnBlur
        />
        <Button type="primary" disabled={disabledButton} onClick={fetchData}>Obtener Datos</Button>
        <p>  registros: {responseData.length}</p>
        <Button disabled={responseData.length===0} onClick={exportData}>Descargar</Button>
      </Space>
      <Table  columns={columns} dataSource={responseData} rowKey={'fecha_hora'}/>

    </>
  );
};
export default App;
