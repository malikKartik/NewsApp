import {Dimensions, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Animated, {
  Extrapolate,
  FadeInUp,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import deleteIcon from '../../assets/delete.png'
import heart from '../../assets/heart.png';
import heartFill from '../../assets/heart-fill.png';


const APressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  pinNews: (title: string, newsToBePinned: News) => void;
  item: News;
  index: number;
  deleteNews: (title: string, newsToBeDeleted: News) => void;
};

const width = Dimensions.get('window').width;

const NewsCardComponent = ({item, index, pinNews, deleteNews}: Props) => {
  const opacity = useSharedValue(0);
  const x = useSharedValue(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef();
  const [isBGVisible, setIsBGVisible] = useState(false);
  useEffect(() => {
    opacity.value = withTiming(1);
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     set
  //   }, 500)
  // }, [])

  const pinCard = () => {
    if(item.isPinned) return;
    opacity.value = withTiming(0, {}, () => {
      runOnJS(pinNews)(item.title, item);
    });
  };

  const removeCard = () => {
    opacity.value = withTiming(0, {}, () => {
      runOnJS(deleteNews)(item.title, item);
    });
  };

  const rStyles = useAnimatedStyle(() => {
    const height = interpolate(
      opacity.value,
      [1, 0],
      [120, 0],
      Extrapolate.CLAMP,
    );
    // const x = interpolate(opacity.value, [1, 0], [0, -width], Extrapolate.CLAMP);
    return {
      opacity: opacity.value,
      height: height,
      transform: [{translateX: x.value}],
    };
  }, []);

  const backgroundStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [-1, 0,1],
      ['#973430', 'transparent', 'green'],
    );
    const opacity = interpolate(x.value, [-1, 0, 1], [1, 0, 1]);
    return {
      backgroundColor: backgroundColor,
      opacity: opacity
    };
  }, []);

  const pan = Gesture.Pan()
    .failOffsetY([-5, 5])
    .activeOffsetX([-5, 5])
    .onUpdate(e => {
      if(e.translationX <= 0){
        x.value = e.translationX;
      }
    })
    .onEnd(e => {
      if (x.value < -width / 2) {
        x.value = withTiming(-width, {}, () => {
          runOnJS(removeCard)();
        });
      } else {
        x.value = withTiming(0);
      }
    });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideBackground, backgroundStyles]}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
            height: 100,
            width: 100,
          }}>
            <Image source={deleteIcon} style={{height: 32, width: 32, resizeMode: "contain"}}/>
          <LottieView
            source={require('../../assets/heart.json')}
            autoPlay
            loop
            colorFilters={[
              {
                keypath: 'button',
                color: '#F00000',
              },
              {
                keypath: 'Sending Loader',
                color: '#F00000',
              },
            ]}
          />
        </View>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.innerContainer, rStyles]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.text, {fontWeight: '600'}]} numberOfLines={3}>
            {item.title}
          </Text>
          <Pressable onPress={pinCard}>
          <Image source={item.isPinned ? heartFill : heart} style={{height: 32, width: 32, resizeMode: 'contain'}}/>
          </Pressable>
          </View>
          <View>
            <Text style={styles.timeText}>{item.publishedAt}</Text>
            <Text style={styles.publisherText}>By {item.author}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default NewsCardComponent;

const styles = StyleSheet.create({
  container: {},
  slideBackground: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 16,
    backgroundColor: '#141316',
    // backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    borderColor: '#49454E',
    justifyContent: 'space-between',
  },
  text: {
    color: '#E7E1F5',
    fontSize: 16,
    fontFamily: 'Roboto',
    width: '80%',
  },
  timeText: {
    fontSize: 10,
    color: '#E7E1F5',
    fontFamily: 'Roboto',
    marginTop: 8,
  },
  publisherText: {
    fontSize: 10,
    color: '#928F99',
    fontFamily: 'Roboto',
  },
});
