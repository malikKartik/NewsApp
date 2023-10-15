import { Button, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGetNews } from '../../hooks/useGetNews'
import NewsCardComponent from '../../components/NewsCardComponent'
import { useIntervalTrigger } from '../../hooks/useIntervalTrigger'
import reload from '../../../assets/reload.png';

export const Home = () => {
    const {news, pinnedNews, pinNews, getMoreNews, isLoading, deleteNews} = useGetNews();
    const resetTimer = useIntervalTrigger(getMoreNews, 10*1000)
    const onLoadPress = () => {
      getMoreNews();
    }
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Trending News</Text>
        <Pressable onPress={onLoadPress}>
          <Image source={reload} style={{height: 40, width: 40, resizeMode: 'contain'}}/>
        </Pressable>
      </View>
      <FlatList
        data={[...pinnedNews,...news]}
        keyExtractor={item => {
          return item.url;
        }}
        refreshing={isLoading}
        onRefresh={() => {
          resetTimer()
          getMoreNews()
        }}
        style={{flex: 1}}
        renderItem={({item, index}) => <NewsCardComponent item={item} index={index} pinNews={pinNews} deleteNews={deleteNews}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    newsCard: {
        marginHorizontal: 16,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5
    },
    topBar: {
        width: "100%",
        height: 56,
        backgroundColor: "#1C1B1E",
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    heading: {
      color: '#E7E1F5',
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: "700"
    }
})