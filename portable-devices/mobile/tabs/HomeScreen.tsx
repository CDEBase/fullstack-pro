import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {Card, Grid, WhiteSpace} from '@ant-design/react-native';

const data = Array.from(new Array(12)).map((_val, i) => ({
  icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png',
  text: `Name${i}`,
}));

export default function HomeScreen() {
  // const dataSource = useSelector((state) => state.cards.dataSource);
  return (
    <>
      <Grid data={data} columnNum={4} isCarousel />
      <WhiteSpace size="lg" />
      <ScrollView style={{background: '#f5f5f5'}}>
        <WhiteSpace size="lg" />
      </ScrollView>
    </>
  );
}
